"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./driver");
const loginAction_1 = require("./testactions/loginAction");
// import {VipMixedPayment} from "./testactions/VipMixedPayment";
const Tools_1 = require("./utils/Tools");
let map = new Map();
let fileName = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + "-" + Tools_1.Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";
function before() {
    // GlobalUtil.init();
    // 读取测试数据
    // map = ReadCSV.readFile();
}
async function salesSettlement() {
    let client = await driver_1.SingleDriver.createClient();
    await loginAction_1.LoginAction.Login(client);
    // let saleContent = map.get('saleContent');
    // let headers:string[] = [];
    // headers.push("saleTime");
    // headers.push("orderNo");
    // headers.push("price");
    // headers.push(saleContent[0].split(','));
    // for (let i = 1; i <= map.size-1; i++) {
    //     let mode = map.get(i);
    //     if (mode!==undefined){
    //         let payTree = mode.payTree;
    //         let otherTree = mode.otherTree;
    //         await VipMixedPayment.test(client, payTree, otherTree,i,headers,saleContent[i].split(','),fileName);
    //
    //     }else{
    //
    //     }
    //
    // }
}
before();
salesSettlement();
// (function (){
//     console.log(fileName)            2021-1-25-60cbe1f9-cdcd-4d49-a437-eac92b0e3617.csv
//     console.log(fileName2)           2021/1/25-892c8de0-0997-407b-8aa5-3f80e0baee04.csv
// })()
