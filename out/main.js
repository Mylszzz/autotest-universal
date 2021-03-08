"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./driver");
const deviceActions_1 = require("./testactions/deviceActions");
const globalUtil_1 = require("./utils/globalUtil");
const logUtils_1 = require("./utils/logUtils");
const deviceName_1 = require("./static/deviceName");
const saleMainLoop_1 = require("./testactions/sale/saleMainLoop");
const refundAction_1 = require("./testactions/refund/refundAction");
const settings_1 = require("./static/settings");
const refundAction_1 = require("./testactions/refund/refundAction");
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
        退货模块
         */
        if (settings_1.generalSettings.enableRefundModule) {
            logUtils_1.LogUtils.log.info("开始进行退货测试");
            let refundAction = new refundAction_1.RefundAction(this.client);
            await refundAction.refundProcess();
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
        /*
        退出登录
         */
        if (settings_1.generalSettings.enableLogoutModule) {
            await deviceActions_1.LogoutAction.accountLogout(this.client);
        }
    }
}
Main.runScript('a8'); // a8 或者 elo
