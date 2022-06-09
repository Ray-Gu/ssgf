import axios from "axios";
import {Message} from "element-ui";
import {getToken, removeToken} from "@/tool/cookie";


const request = axios.create({
    // baseURL:process.env["VUE_APP_BASE_API"],  //设置了代理服务器，就不能再用这个了，解决了后台session识别前端req的问题
    timeout:5000,

})
//请求前处理，比如说带上token
request.interceptors.request.use((config)=>{
    const token = getToken();
    //如果cookie中有token,将token加到request头中发送到服务器
    if(token){
        config.headers['Authorization'] = token;
    }
    return config;
})

//返回时处理,这是一个promise，所以传进去两个函数
request.interceptors.response.use(response=>{
    // console.log('res..:',response);
    /*
    200: 请求处理成功
    500: 请求处理失败
    401: 请求未认证，跳转登录页
    403: 没有任何权限
    406: 请求未授权，跳转未授权提示页
    */
    const res = response.data;
    if(response.status && response.status===200){
        if(res.code===500) {
            Message.error({message: res.message});
            return;
        }
        if(res.code === 401 ){
            Message.error({message: res.message});
            removeToken();
            location.reload();
        }
        if(res.code === 403 ){
            Message.error({message: res.message});
            removeToken();
            location.reload();
        }
    }
    return res;
}, error => {
    if(error.response.code === 504 || error.response.code=== 404){
        Message.error('服务器找不到页面');
    }
    else if(error.response.code === 403){
        Message.error('权限不足，请联系管理员');
    }else{
        if(error.response.data.message){
            Message.error(error.response.data.message);
        }
        else{
            Message.error('未知错误!');
        }
    }
    return ;
});

let base = '';
//封装post方法
export const postRequest=(url,params)=>{
    return request({
        method:'post',
        url:`${base}${url}`,
        data:params
    })
};

//封装get方法
export const getRequest=(url,params)=>{
    return request({
        method:'get',
        url:`${base}${url}`,
        params:params,
    })
};

//封装put方法
export const putRequest=(url,params)=>{
    return request({
        method:'put',
        url:`${base}${url}`,
        data:params
    })
};

//delete
export const deleteRequest=(url,params)=>{
    return request({
        method:'delete',
        url:`${base}${url}`,
        data:params
    })
};

export default request;
