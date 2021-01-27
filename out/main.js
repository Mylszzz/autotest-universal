"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./driver");
const loginAction_1 = require("./testactions/loginAction");
// import {GlobalUtil} from "./utils/GlobalUtil";
const GlobalUtil_1 = require("./utils/GlobalUtil");
const ReadCSV_1 = require("./utils/ReadCSV");
// import {VipMixedPayment} from "./testactions/VipMixedPayment";
const Tools_1 = require("./utils/Tools");
const LogUtils_1 = require("./utils/LogUtils");
const deviceName_1 = require("./entity/deviceName");
let map = new Map();
let fileName = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + "-" + Tools_1.Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";
const deviceName = deviceName_1.DeviceName.getDeviceName(); // a8或者elo
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
    LogUtils_1.logger.info("成功创建client");
    let device;
    if (deviceName == 'a8') {
        device = new loginAction_1.Device_A8(client);
    }
    else if (deviceName == 'elo') {
        device = new loginAction_1.Device_Elo(client);
    }
    await client.setImplicitTimeout(20000);
    await device.getDeviceConfig();
    client.pause(1000);
    await device.loginProcess();
    client.pause(1000);
}
before();
salesSettlement();
// (function (){
//     console.log(fileName)            2021-1-25-60cbe1f9-cdcd-4d49-a437-eac92b0e3617.csv
//     console.log(fileName2)           2021/1/25-892c8de0-0997-407b-8aa5-3f80e0baee04.csv
// })()
