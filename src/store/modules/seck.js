import{reqListSeck}from "../../util/request.js";

const state={
    //秒杀列表
    list:[]
}

const mutations={
    //直接修改list
    changeList(state,arr){
        state.list=arr;
    }
}

const actions={
    //发起列表请求 context为仓库store
    reqListAction(context){
        reqListSeck().then(res=>{
            // console.log(res);
            if(res.data.code==200){
                let list=res.data.list?res.data.list:[]
                //通过commit提交到mutations修改list
                context.commit("changeList",list)
            }
            
        })
    }
}

const getters={
    //导出数据
    list(state){
        return state.list
    }
}

export default{
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}