"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./driver");
const deviceActions_1 = require("./testactions/deviceActions");
const globalUtil_1 = require("./utils/globalUtil");
const readCSV_1 = require("./utils/readCSV");
const tools_1 = require("./utils/tools");
const logUtils_1 = require("./utils/logUtils");
const deviceName_1 = require("./static/deviceName");
const refundAction_1 = require("./testactions/refund/refundAction");
let map = new Map();
let fileName = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + "-" + tools_1.Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";
const deviceName = deviceName_1.DeviceName.getDeviceName(); // a8或者elo
/**
 * 执行脚本流程之前的一些准备工作
 * 包括读取配置到Map中
 */
function before() {
    globalUtil_1.GlobalUtil.init();
    // 读取测试数据
    map = readCSV_1.ReadCSV.readFile();
    let saleContent = map.get('saleContent');
    logUtils_1.LogUtils.log.info("-------map--------------");
    logUtils_1.LogUtils.log.info(saleContent);
}
async function salesSettlement() {
    logUtils_1.LogUtils.log.info("开始创建client");
    let client = await driver_1.SingleDriver.createClient();
    logUtils_1.LogUtils.log.info("成功创建[" + deviceName + "]client");
    /*
    登录(A8和Elo通用。)
     */
    await deviceActions_1.LoginAction.login(client);
    // await UploadLogAction.uploadTodayLogAction(client);
    // await RefreshAction.refreshAction(client);
    // await LogoutAction.accountLogout(client);
    //  await CancelReturns.cancelReturns(client);
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
    // let search_a8 = new Search_a8(client);
    // await search_a8.search();
    // await search_a8.searchOrder();
    // let tempValueObject = await client.$('//android.view.View[@content-desc="交易日期"]/following-sibling::android.view.View');
    // let tempValue = await tempValueObject.getAttribute('content-desc');
    // let beforeToday = search_a8.isBeforeToday(tempValue);
    // LogUtils.refundLog.info(beforeToday);
    let refundAction = new refundAction_1.RefundAction(client);
    await refundAction.refundProcess();
}
before();
salesSettlement();
