'use strict'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const axios = require('./lib/axiosRequest')

/**
 * 获取路径名，如 'src/assets/images' 会拆分成 'src/assets' + 'images'
 * @param {String} p 图片路径
 */
const getProps = p => {
    let imgPath, srcDirName
    if (/\//.test(p)) {
        const arr = p.split('/')
        srcDirName = arr.pop()
        imgPath = arr.join('/')
    } else {
        srcDirName = p
        imgPath = ''
    }
    return { imgPath, srcDirName }
}

/**
 * 创建文件夹
 * @param {String} dir 路径 'F:/workspace/c-filter/bin/a/b/c'
 * @param {String} prev 已存在的文件夹 'F:/workspace/c-filter/bin'
 */
const createDir = (dir, prev) => {
    if (!prev) {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    } else {
        const tail = dir.slice(prev.length)
        const items = tail.split('\\').slice(1)
        let _dir = prev

        items.map(item => {
            _dir = path.resolve(_dir, item)
            if (!fs.existsSync(_dir)) {
                fs.mkdirSync(_dir)
            }
        })
    }
}

/**
 * 从服务器获取图片资源信息
 * @param {Array} apiList api地址列表
 */
const getResources = async (apiList) => {
    const promises = apiList.map(options => {
        return axios.request(options)
    })
    const res = await Promise.all(promises)
    const content = res.map(data => JSON.stringify(data)).join(';')
    return content
}

/**
 * 
 * @param {String} content 待匹配的文本
 * @param {RegExp} reg 匹配图片的正则表达式 
 */
const match = (content, reg) => {
    content = content.replace(/\r\n/g, '')
    return content.match(reg)
}

const Filter = function (imgPath, apiList, exclude) {
    const { imgPath: p, srcDirName } = getProps(imgPath)
    this.imgPath = p
    this.srcDirName = srcDirName
    this.desDirName = this.srcDirName + '_copy'
    this.src = path.resolve(imgPath)
    this.des = this.src.replace(this.srcDirName, this.desDirName)
    this.apiList = apiList
    this.root = process.cwd()
    this.imgReg = new RegExp(`${this.srcDirName}/\\S+?.(?:gif|jpg|jpeg|bmp|png|svg)`, 'ig')
    this.exclude = ['.vscode', '.git', '.github', 'node_modules', 'build', 'config', 'test', 'types'].concat(exclude)
    this.files = []
    this.lost = []
}

Filter.prototype.getFiles = function (path) {
    const files = fs.readdirSync(path)
    if (!files.length && path == this.root) {
        console.log(chalk.yellow((`The directory is empty. directory: ${path}`)))
        process.exit()
    }
    files.map(file => {
        const isExclude = this.exclude.includes(file);
        if (!isExclude) {
            const dir = [path, file].join('/')
            const stat = fs.statSync(dir)
            if (stat.isFile() && /\.html$|\.(sa|sc|c)ss$|\.less$|\.js$|\.vue$/i.test(file)) {
                this.files.push(dir)
            } else if (stat.isDirectory()) {
                this.getFiles(dir)
            }
        }
    })
}


Filter.prototype.handleImage = function (images, file) {
    if (!images) return

    images.map(img => {
        const { dir, base } = path.parse(path.resolve(this.imgPath, img))
        const srcDir = dir
        const desDir = srcDir.replace(this.srcDirName, this.desDirName)
        const filename = base

        createDir(desDir, this.des)

        try {
            fs.writeFileSync(path.resolve(desDir, filename), fs.readFileSync(path.resolve(srcDir, filename)))
        } catch (error) {
            const msg = file ? `${img} 在文件 ${file.slice(this.root.length)} 中引用，但目录中没有找到该图片` : `${img} 在服务器资源中引用，但目录中没有找到该图片`
            this.lost.push(msg)
        }
    })

}

Filter.prototype.walk = function () {
    let count = 0
    this.files.map(file => {
        const content = fs.readFileSync(file, 'utf-8')
        const images = match(content, this.imgReg)
        if (images) {
            this.handleImage(images, file)
        } else {
            count++
        }
    })

    if (count === this.files.length) {
        console.log(chalk.yellow('not matched any image.'))
        process.exit()
    }

    const successMsg = [
        'Successfully',
        `Filtered images in "${this.des.slice(this.root.length + 1)}"`
    ]

    if (this.lost.length) {
        const content = JSON.stringify(this.lost, null, '\n')
        fs.writeFileSync(path.resolve(this.des, 'lost_infomation.json'), content, 'utf-8')
        successMsg.push(chalk.yellow(`Image reference missing, please find "${this.des.slice(this.root.length + 1)}\\lost_infomation.json"`))
    }

    console.log(chalk.green(successMsg.join('\n')))
}

Filter.prototype.run = function () {
    this.getFiles(this.root)

    if (!this.files.length) {
        console.log(chalk.yellow('not found any file.'))
        process.exit()
    }

    createDir(this.des)

    if (this.apiList.length) {
        (async () => {
            const content = await getResources(this.apiList)
            const images = match(content, this.imgReg)
            this.handleImage(images)
            this.walk()
        })()
    } else {
        this.walk()
    }
}

module.exports = Filter

