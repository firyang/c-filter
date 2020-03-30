## c-filter 
[![npm version](https://badge.fury.io/js/c-filter.svg)](https://badge.fury.io/js/c-filter) 

Used to clean up unused images in web projects. Installed into the project, and execute the command（cft）through the command line to work.  
Support for requesting service data for filtering.  
It will not change the original resources, it will only find the used images and move to the '[imagePath]_copy' directory.  

### Install
```bash
$ npm install c-filter --save-dev
```

### Usage
Execute cft command, pass in the picture path (this parameter is required)  
```bash
cft src/images
cft --path src/images
```
You can also use the configuration file cft.config.js to pass parameters.   
The file needs to be placed in the project root directory.  
```javascript
module.exports = {
  path: "src/images"
}
```
Ignore folders that do not need to be checked.   
Default ignore: '.vscode', '.git', '.github', 'node_modules', 'build', 'config', 'test', 'types'  
```javascript
module.exports = {
  path: "src/images"
  exclude: ["data"]
}
```
If the picture requests to be rendered, you can configure the api to request service data for filtering.  
The parameters please refer to axios.  
```javascript
module.exports = {
  path: "src/images",
  exclude: ["data"],
  apiList: [
    {
      type: 'get',
      url:"http://xxx/resource"
    }
  ]
}
```