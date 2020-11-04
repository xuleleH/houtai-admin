import{reqListSpec,reqSpecCount}from "../../util/request.js";

const state={
    //分类列表
    list:[],
    //总数初始值
    total:0,
    //一页个数的初始值
    size:2,
    //页码
    page:1,
}

const mutations={
    //直接修改list
    changeList(state,arr){
        state.list=arr;
    },
    //修改总数(发请求可以得来)
    changeTotal(state,sum){
        state.total=sum
    },
    //修改page
    changePage(state,page){
        state.page=page;
    }
}

const actions={
    //发起列表请求 context为仓库store
    reqListAction(context,bool){
        //size查询条数page页码数
        let isPage=bool?{}:{page:context.state.page,size:context.state.size}
        reqListSpec(isPage).then(res=>{
            if(res.data.code==200){
                let list=res.data.list?res.data.list:[];
                //如果取到了空数组，并且当前页不是第一页，那么重新请求前一页
                if(list.length==0&&context.state.page>1){
                    context.commit("changePge",context.state.page--);
                    context.dispatch("reqListAction");
                    return;
                }
                list.forEach(item=> {
                    item.attrs=JSON.parse(item.attrs)
                });
                //通过commit提交到mutations修改list
                context.commit("changeList",list)
            }
            
        })
    },
    //发起总数请求
    reqCountAction(context){
        reqSpecCount().then(res=>{
            if(res.data.code==200){
                //修改总数
                context.commit("changeTotal",res.data.list[0].total);
            }
        })
    },
    //修改页码
    changePageAction(context,page){
        context.commit("changePage",page);
        //重新刷林列表
      context.dispatch("reqListAction");
    }
}

const getters={
    //导出数据
    list(state){
        return state.list
    },
    //导出总数
    total(state){
        return state.total
    },
    //导出一页的个数
    size(state){
        return state.size
    },
}

export default{
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}