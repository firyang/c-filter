'use strict'

const axios = require('axios')

const AjaxRequest = function () {
    this.timeout = 3000
}

AjaxRequest.prototype.setInterceptor = function (instance) {
    instance.interceptors.response.use(res => {
        return res.data
    })
}

AjaxRequest.prototype.request = function (options) {
    const instance = axios.create()
    this.setInterceptor(instance)
    return instance({ ...options, timeout: this.timeout })
}

module.exports = new AjaxRequest