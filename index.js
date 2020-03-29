'use strict'

const path = require('path')
const fs = require('fs')
const argv = require('optimist').argv
const chalk = require('chalk')
const Filter = require('./Filter')

const configPath = path.resolve('cft.config.js')

if (fs.existsSync(configPath)) {
    Object.assign(argv, require(configPath))
}

const imaPath = argv.path || process.argv[2]
const httpRequestUrls = argv.httpRequestUrls || []
const exclude = argv.exclude || []

if (!imaPath || typeof imaPath !== 'string') {
    const msg = ['The images directory is required',
        'you may use ft-img --path "path" or ft-img "path"']
    console.log(chalk.red(msg.join('\n')))
    process.exit()
}

const filter = new Filter(imaPath, httpRequestUrls, exclude)

filter.run()