import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import {actions} from "./actions";
import {state,mutations,getters} from "./mutations";
import caidan from "./modules/caidan";
import role from "./modules/role";
import sort from "./modules/sort";
import spec from "./modules/spec";
import goods from "./modules/goods";
import banner from "./modules/banner";
import seck from "./modules/seck";




export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules:{
        caidan,
        role,
        sort,
        spec,
        goods,
        banner,
        seck,
    }
})