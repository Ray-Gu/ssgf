import store from "@/store";
import {getRequest} from "@/tool/request";

export function getUserInfo(){
    getRequest('/admin/employees/user/info').then(resp=>{
        if(resp){
            store.state.user.user = resp.data;
        }
    })
}

