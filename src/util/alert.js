import Vue from 'vue';
let Vm = new Vue();
//成功弹框
export const successAlert = (msg)=>{
    Vm.$message({
        message:msg,
        type:"success"
    });
}


//警告弹框
export const waringAlert = (msg)=>{
    Vm.$message({
        message:msg,
        type:"warning"
    });
}