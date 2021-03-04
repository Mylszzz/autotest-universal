"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundOrder_elo = exports.RefundOrder_a8 = exports.RefundOrder = void 0;
const logUtils_1 = require("../../utils/logUtils");
const globalUtil_1 = require("../../utils/globalUtil");
const deviceName_1 = require("../../static/deviceName");
const touchMethod_1 = require("../../utils/touchMethod");
const inputCoordinates_1 = require("../../static/inputCoordinates");
const buttonXPaths_1 = require("../../static/buttonXPaths");
const viewXpaths_1 = require("../../static/viewXpaths");
const deviceName = deviceName_1.DeviceName.getDeviceName();
/**
 * 进行订单退货流程
 */
class RefundOrder {
    /**
     * 输入密码前的操作
     * @param client
     * @param confirm 确认按钮
     */
    static async refundFirst(client, orderText, confirm) {
        //    点击申请退货
        await client.pause(2000);
        let apply = await client.$(orderText);
        await apply.click();
        await client.pause(1000);
        //    点击确认退货
        let reConfirm = await client.$(confirm);
        await reConfirm.click();
        await client.pause(1000);
    }
    /**
     * 输入密码后的操作
     * @param client
     * @param confirm 确认按钮
     * @param determine 确定按钮
     */
    static async refundThen(client, confirm, determine) {
        let confirm1 = await client.$(confirm);
        await confirm1.click();
        await client.pause(1000);
        //    最后一次提示是否确认退货
        let lastConfirm = await client.$(determine);
        await lastConfirm.click();
        await client.pause(1000);
    }
    /**
     * 输入密码
     * @param client
     * @param determine 确定按钮
     * @param number    密码
     */
    static async refundPass(client, determine, number) {
        await client.pause(1000);
        //输入密码
        if (deviceName == 'a8') {
            let touchFun = touchMethod_1.TouchMethod.getTouchMethod();
            await touchFun(client, number, inputCoordinates_1.InputCoordinates.getCoordMap()); // A8退款使用A8通用坐标Map
        }
        else if (deviceName == 'elo') {
            let touchFun = touchMethod_1.TouchMethod.getTouchMethod();
            await touchFun(client, number, inputCoordinates_1.InputCoordinates.getCoordMapForRedundPwd()); // Elo退款坐标
        }
        logUtils_1.LogUtils.log.info("******授权码填写结束******");
        //密码确定
        let confirmTip = await client.$(determine);
        await confirmTip.click();
        await client.pause(1000);
    }
    /**
     * 完成退货后的操作
     * @param client
     * @param menu  菜单栏
     * @param home    销售主页
     */
    static async refundOk(client, menu, home) {
        let finish = await client.$('//android.widget.Button[@content-desc="完成"]');
        await client.pause(500);
        await finish.click();
        await client.setImplicitTimeout(1000);
        await client.pause(1000);
        //点击菜单栏
        let menu2 = await client.$(menu);
        await menu2.click();
        await client.pause(1000);
        //返回到主页
        let chooseSale = await client.$(home);
        await chooseSale.click();
        await client.pause(1000);
    }
    /**
     * 当日订单退款
     * @author lina
     * @param client
     * @param orderNo   订单号
     */
    static async refundOrderToday(client, orderNo) {
        logUtils_1.LogUtils.log.info("******对订单" + orderNo + "进行当日整单退款操作(今日)******");
        await client.pause(1000);
        await RefundOrder.refundFirst(client, buttonXPaths_1.ButtonXPaths_A8.ORDERTEXT, buttonXPaths_1.ButtonXPaths_A8.CONFIRM);
        // 输入退货的固定密码
        logUtils_1.LogUtils.log.info("请输入授权码");
        let number = await globalUtil_1.GlobalUtil.getConfigMap().get('backGoods');
        await this.refundPass(client, buttonXPaths_1.ButtonXPaths_A8.DETERMINE, number);
        try {
            let element = await client.findElements("xpath", viewXpaths_1.ViewXPaths_A8.MESSAGE);
            if (element.length != 0 && typeof element == "object") {
                let determine1 = await client.$(buttonXPaths_1.ButtonXPaths_A8.DETERMINE);
                await determine1.click();
                await client.pause(500);
                let back1 = await client.$(buttonXPaths_1.ButtonXPaths_A8.BACK);
                await back1.click();
                logUtils_1.LogUtils.log.info('********订单支付行包含指定支付供应商, 不支持退货********');
                return false;
            }
            else {
                logUtils_1.LogUtils.log.info('********订单支付行支持退货********');
                let confirmTip1 = await client.$(buttonXPaths_1.ButtonXPaths_A8.DETERMINE);
                await confirmTip1.click();
                await client.pause(1000);
                await this.refundThen(client, buttonXPaths_1.ButtonXPaths_A8.CONFIRM, buttonXPaths_1.ButtonXPaths_A8.DETERMINE);
                //  打印订单耗时
                let tip = await client.$(buttonXPaths_1.ButtonXPaths_A8.DETERMINE);
                await client.pause(1000);
                await tip.click();
                await client.pause(6000);
                logUtils_1.LogUtils.refundLog.info('更改退货成功');
                //    点击返回
                let back = await client.$(buttonXPaths_1.ButtonXPaths_A8.RETURN);
                await client.pause(1000);
                await back.click();
                await client.pause(1000);
                await this.refundOk(client, buttonXPaths_1.ButtonXPaths_A8.MENU, buttonXPaths_1.ButtonXPaths_A8.HOME);
                return true;
            }
        }
        catch (e) {
            //   this.refundException(client, ButtonXPaths_A8.DETERMINE, ButtonXPaths_A8.BACK, ViewXPaths_A8.MESSAGE);
            return false;
        }
    }
    /**
     * 订单隔日整单退款
     * @author Lina
     * @param client
     * @param orderNo 订单号
     */
    static async refundBeforeOrder(client, orderNo) {
        logUtils_1.LogUtils.log.info("******对订单" + orderNo + "进行当日整单退款操作（隔日）******");
        // 查询成功，执行退款操作
        await client.pause(1000);
        await this.refundFirst(client, buttonXPaths_1.ButtonXPaths_A8.ORDERTEXT, buttonXPaths_1.ButtonXPaths_A8.CONFIRM);
        try {
            let element = await client.findElements("xpath", viewXpaths_1.ViewXPaths_A8.MESSAGE);
            if (element.length != 0 && typeof element == "object") {
                let determine1 = await client.$(buttonXPaths_1.ButtonXPaths_A8.DETERMINE);
                await determine1.click();
                await client.pause(500);
                let back1 = await client.$(buttonXPaths_1.ButtonXPaths_A8.BACK);
                await back1.click();
                logUtils_1.LogUtils.log.info('********订单支付行包含指定支付供应商, 不支持退货********');
                return false;
            }
            else {
                logUtils_1.LogUtils.log.info('********订单支付行支持退货********');
                await this.refundThen(client, buttonXPaths_1.ButtonXPaths_A8.CONFIRM, buttonXPaths_1.ButtonXPaths_A8.DETERMINE);
                //  打印订单耗时
                let tip = await client.$(buttonXPaths_1.ButtonXPaths_A8.DETERMINE);
                await client.pause(1000);
                tip.click();
                await client.pause(6000);
                //  return true;
                logUtils_1.LogUtils.refundLog.info('订单退货成功');
                //    点击返回
                let back = await client.$(buttonXPaths_1.ButtonXPaths_A8.RETURN);
                await client.pause(1000);
                await back.click();
                await client.pause(1000);
                await this.refundOk(client, buttonXPaths_1.ButtonXPaths_A8.MENU, buttonXPaths_1.ButtonXPaths_A8.HOME);
                logUtils_1.LogUtils.refundLog.info("====订单" + orderNo + "隔日整单退款成功");
                return true;
            }
        }
        catch (e) {
        }
    }
}
exports.RefundOrder = RefundOrder;
RefundOrder.isFind = false;
/**
 * A8直接继承
 */
class RefundOrder_a8 extends RefundOrder {
}
exports.RefundOrder_a8 = RefundOrder_a8;
/**
 * ELO因为方法操作的流程不一样，需要重写一部分。
 */
class RefundOrder_elo extends RefundOrder {
    /**
     * 当日订单退款
     * @author lina
     * @param client
     * @param orderNo   订单号
     */
    static async refundOrderToday(client, orderNo) {
        logUtils_1.LogUtils.log.info("******对订单" + orderNo + "进行当日整单退款操作(今日)******");
        try {
            await this.refundFirst(client, buttonXPaths_1.ButtonXPaths_Elo.ORDERTEXT, viewXpaths_1.ViewXpaths_ELO.DETERMINE);
            // 输入退货的固定密码
            let fixedpwd = await client.$('//android.view.View[@content-desc="固定密码"] ');
            await fixedpwd.click();
            let number = await globalUtil_1.GlobalUtil.getConfigMap().get('backGoods');
            await this.refundPass(client, buttonXPaths_1.ButtonXPaths_Elo.DETERMINE, number);
            //提示确定
            let confirmTip1 = await client.$(viewXpaths_1.ViewXpaths_ELO.DETERMINE);
            await confirmTip1.click();
            await client.pause(1000);
            await this.refundThen(client, buttonXPaths_1.ButtonXPaths_Elo.CONFIRM, viewXpaths_1.ViewXpaths_ELO.DETERMINE);
            //  打印订单耗时
            await client.pause(10000);
            await this.refundOk(client, buttonXPaths_1.ButtonXPaths_Elo.MENU, buttonXPaths_1.ButtonXPaths_Elo.HOME);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * 订单隔日整单退款
     * @author Lina
     * @param client
     * @param orderNo 订单号
     */
    static async refundBeforeOrder(client, orderNo) {
        logUtils_1.LogUtils.log.info("******对订单" + orderNo + "进行当日整单退款操作（隔日）******");
        try {
            await this.refundFirst(client, buttonXPaths_1.ButtonXPaths_Elo.ORDERTEXT, buttonXPaths_1.ButtonXPaths_Elo.CONFIRM);
            await this.refundThen(client, buttonXPaths_1.ButtonXPaths_Elo.CONFIRM, viewXpaths_1.ViewXpaths_ELO.DETERMINE);
            let number = await globalUtil_1.GlobalUtil.getConfigMap().get('backGoods2');
            await this.refundPass(client, buttonXPaths_1.ButtonXPaths_Elo.DETERMINE, number);
            await client.pause(10000);
            logUtils_1.LogUtils.log.info("******订单" + orderNo + "隔日整单退款成功******");
            await this.refundOk(client, buttonXPaths_1.ButtonXPaths_Elo.MENU, buttonXPaths_1.ButtonXPaths_Elo.HOME);
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
exports.RefundOrder_elo = RefundOrder_elo;
