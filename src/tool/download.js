import axios from "axios";
import {getToken} from "@/tool/cookie";

const service = axios.create({
    responseType:'arraybuffer'
})

service.interceptors.request.use(config=>{
    const token = getToken();
    //如果cookie中有token,将token加到request头中发送到服务器
    if(token){
        config.headers['Authorization'] = token;
    }
    return config;
})

service.interceptors.response.use(resp=>{
    const headers = resp.headers;
    let reg = RegExp(/application\/json/);
    if(headers['content-type'].match(reg)){
        resp.data = unitToString(resp.data);
    }else{
        let fileDownload = require('js-file-download');
        let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
        let contentType = headers['content-type'];
        fileName = decodeURIComponent(fileName);
        fileDownload(resp.data,fileName,contentType);
    }
},err=>{
    console.log(err);
})

function unitToString(unitArray){
    let encodeString = String.fromCharCode.apply(null,new Uint8Array(unitArray));
    let decodedString = decodeURIComponent(escape(encodeString));
    return JSON.parse(decodedString);
}

let base='';
export const downloadRequest=(url,parmas)=>{
    return service({
        method:'get',
        url:`${base}${url}`,
        data:parmas
    })
}

export default service;
