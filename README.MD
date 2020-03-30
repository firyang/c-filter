## c-filter
用于清理web项目中，未使用的图片。安装到项目中，通过命令行执行命令 cft 来工作。支持请求服务数据进行筛选。   
它不会更改原来的图片资源，只会将使用的图片筛选出来，放在原目录_copy目录中。

### Install
```bash
$ npm install c-filter --save-dev
```

### Usage
执行 cft 命令，传入图片路径（该参数为必需）
```bash
cft src/images
cft --path src/images
```
也可以使用配置文件 cft.config.js 传参  
该配置文件需要放在项目根目录 
```javascript
module.exports = {
    path: "src/images"
}
```
exclude 忽略不需要检查的文件夹   
默认忽略 '.vscode', '.git', '.github', 'node_modules', 'build', 'config', 'test', 'types'  
```javascript
module.exports = {
    path: "src/images"
    exclude: ["data"]
}
```
httpRequestUrls 如图片是请求服务渲染的，则可配置api 请求服务数据进行筛选   
```javascript
module.exports = {
    path: "src/images",
    exclude: ["data"],
    httpRequestUrls: ["https://xxx/resource"]
}
```