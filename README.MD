# c-filter
[![npm version](https://badge.fury.io/js/c-filter.svg)](https://badge.fury.io/js/c-filter) 

js toolkit is used to clean up unused pictures in web projects   
Support request service data to filter   
It will not change the original resource, only find the referenced resource and copy it to the [imagePath]_copy directory.

## Install
Globally
```bash
npm install c-filter -g
```
Locally
```bash
npm install c-filter --save-dev
```

## Usage
During global installation, you can directly execute the "cft" command in the project to run the program
```bash
cft
```
When installing in the project, you need to configure scripts and use "npm run cft" to run the program
```
{
  scripts:{
    "cft":"cft"
  }
}
```
```bash
npm run cft
```
If npm version>=5.2, npx can be used without scripts
```bash
npx cft
```
The image path is a required parameter and it can be passed in on the command line  (the path is relative to the project root directory)
```bash
cft src/images
cft --path src/images
```
You can also use the configuration file "cft.config.js" to pass parameters, and the file needs to be placed in the project root directory
```javascript
module.exports = {
  path: "src/images"
}
```
Ignore folders that do not need to be checked   
Default Ignore: '.vscode', '.git', '.github', 'node_modules', 'build', 'config', 'test', 'types'

```javascript
module.exports = {
  path: "src/images"
  exclude: ["data"]
}
```
If the picture is rendered by requesting service data, you can configure the api to request service data for filtering   
for request parameters in apiList, please refer to axios

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
