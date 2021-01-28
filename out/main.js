"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./driver");
const loginAction_1 = require("./testactions/loginAction");
const GlobalUtil_1 = require("./utils/GlobalUtil");
const ReadCSV_1 = require("./utils/ReadCSV");
const VipMixedPayment_1 = require("./testactions/VipMixedPayment");
const Tools_1 = require("./utils/Tools");
const LogUtils_1 = require("./utils/LogUtils");
let map = new Map();
let fileName = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + "-" + Tools_1.Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";
function before() {
    GlobalUtil_1.GlobalUtil.init();
    // 读取测试数据
    map = ReadCSV_1.ReadCSV.readFile();
    let saleContent = map.get('saleContent');
    LogUtils_1.logger.info("-------map--------------");
    LogUtils_1.logger.info(saleContent);
}
async function salesSettlement() {
    let client = await driver_1.SingleDriver.createClient();
    await client.setImplicitTimeout(20000);
    await loginAction_1.LoginAction.Login(client);
    let saleContent = map.get('saleContent');
    let headers = [];
    headers.push("saleTime");
    headers.push("orderNo");
    headers.push("price");
    headers.push(saleContent[0].split(','));
    for (let i = 1; i <= map.size - 1; i++) {
        let mode = map.get(i);
        if (mode !== undefined) {
            let payTree = mode.payTree;
            console.log("payTree[" + i + "]:" + payTree.get('data'));
            console.log(payTree.get("data")[0] + " " + payTree.get("data")[1]);
            let otherTree = mode.otherTree;
            console.log("otherTree[" + i + "]:" + otherTree.get('data'));
            console.log(otherTree.get("data")[0] + " " + otherTree.get("data")[1]);
            await VipMixedPayment_1.VipMixedPayment.test(client, payTree, otherTree, i, headers, saleContent[i].split(','), fileName);
        }
        else {
        }
    }
}
before();
salesSettlement();
// (function (){
//     console.log(fileName)            2021-1-25-60cbe1f9-cdcd-4d49-a437-eac92b0e3617.csv
//     console.log(fileName2)           2021/1/25-892c8de0-0997-407b-8aa5-3f80e0baee04.csv
// })()
