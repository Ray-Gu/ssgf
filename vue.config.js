//跨域代理设置，才跨域直接获取一些请求
let proxyObj={};

proxyObj['/']={

    //webSocket
    ws:false,
    //目标地址
    target :'http://127.0.0.1:8081',
    //发送请求头会被设置成target
    changeOrigin:true,
    //不重写请求地址
    pathRewrite :{
        '^/':'/'
    }
}


module.exports = {
    devServer:{
        host : '0.0.0.0',
        port : 8080,
        proxy: proxyObj
    }
}
