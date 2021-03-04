"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./driver");
const deviceActions_1 = require("./testactions/deviceActions");
const globalUtil_1 = require("./utils/globalUtil");
const logUtils_1 = require("./utils/logUtils");
const deviceName_1 = require("./static/deviceName");
const saleMainLoop_1 = require("./testactions/sale/saleMainLoop");
const settings_1 = require("./static/settings");
class Main {
    static async runScript(deviceName) {
        deviceName_1.DeviceName.setDeviceName(deviceName);
        /*
        读取机器配置到configMap中
         */
        globalUtil_1.GlobalUtil.init();
        /*
        创建对应机器的webdriverio.BrowserObject对象
         */
        logUtils_1.LogUtils.log.info("开始创建client");
        this.client = await driver_1.SingleDriver.createClient();
        logUtils_1.LogUtils.log.info("成功创建[" + deviceName + "]client");
        /*
        登录模块
         */
        if (settings_1.generalSettings.enableLoginModule) {
            await deviceActions_1.LoginAction.login(this.client);
        }
        /*
        销售模块
         */
        if (settings_1.generalSettings.enableSaleModule) {
            logUtils_1.LogUtils.log.info("开始进行销售测试");
            await saleMainLoop_1.SaleMainLoop.salePreparation(this.client);
            await saleMainLoop_1.SaleMainLoop.saleMainLoop();
            logUtils_1.LogUtils.log.info("销售测试完成");
        }
        /*
        上传日志
         */
        if (settings_1.generalSettings.enableUploadLogModule) {
            await deviceActions_1.UploadLogAction.uploadTodayLogAction(this.client);
        }
        /*
        刷新店铺
         */
        if (settings_1.generalSettings.enableRefreshModule) {
            await deviceActions_1.RefreshAction.refreshAction(this.client);
        }
    }
}
async function salesSettlement() {
    // await LogoutAction.accountLogout(client);
    //  await CancelReturns.cancelReturns(client);
    /*
     For Test Only
     测试打印屏幕上显示的销售信息
      */
    // await client.pause(30000);
    // console.log('------------测试：打印销售信息------------');
    // try {
    //     await ValidateOrderInfo.saveOrderInfoToCsv(client);
    // } catch (e) {
    //     console.log(e);
    // }
    /*
    退款
     */
    // let refundAction = new RefundAction(client);
    //  await refundAction.refundProcess();
}
Main.runScript('a8'); // a8 或者 elo
