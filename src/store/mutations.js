export const state={
    //用户信息
userInfo:sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{}
}

export const mutations={
    //修改用户信息
    changeUserInfo(state,info){
         state.userInfo=info;
         //存到本地存储
         if(info.userName){
              sessionStorage.setItem("userInfo",JSON.stringify(info));
         }else{
             sessionStorage.removeItem("userInfo")
         }
        
    }
}

export const getters={
    userInfo(state){
        return state.userInfo;
    }
}