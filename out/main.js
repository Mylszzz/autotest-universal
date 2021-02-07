"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./driver");
const deviceActions_1 = require("./testactions/deviceActions");
const GlobalUtil_1 = require("./utils/GlobalUtil");
const ReadCSV_1 = require("./utils/ReadCSV");
const Tools_1 = require("./utils/Tools");
const LogUtils_1 = require("./utils/LogUtils");
const deviceName_1 = require("./static/deviceName");
const Rufund_1 = require("./testactions/Rufund");
let map = new Map();
let fileName = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + "-" + Tools_1.Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";
const deviceName = deviceName_1.DeviceName.getDeviceName(); // a8或者elo
/**
 * 执行脚本流程之前的一些准备工作
 * 包括读取配置到Map中
 */
function before() {
    GlobalUtil_1.GlobalUtil.init();
    // 读取测试数据
    map = ReadCSV_1.ReadCSV.readFile();
    let saleContent = map.get('saleContent');
    LogUtils_1.logger.info("-------map--------------");
    LogUtils_1.logger.info(saleContent);
}
async function salesSettlement() {
    LogUtils_1.logger.info("开始创建client");
    let client = await driver_1.SingleDriver.createClient();
    LogUtils_1.logger.info("成功创建[" + deviceName + "]client");
    /*
    登录(A8和Elo通用。)
     */
    await deviceActions_1.LoginAction.login(client);
    await deviceActions_1.UploadLogAction.uploadTodayLogAction(client);
    await deviceActions_1.RefreshAction.refreshAction(client);
    await deviceActions_1.LogoutAction.accountLogout(client);
    // /*
    //  For Test Only
    //  测试打印屏幕上显示的销售信息
    //   */
    // await client.pause(30000);
    // console.log('------------测试：打印销售信息------------');
    // try {
    //     await ValidateOrderInfo.saveOrderInfoToCsv(client);
    // } catch (e) {
    //     console.log(e);
    // }
    /*

     */
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
            //   await VipMixedPayment.test(client, payTree, otherTree,i,headers,saleContent[i].split(','),fileName);
        }
        else {
        }
    }
    await Rufund_1.Refund.Refund(client);
}
before();
salesSettlement();
