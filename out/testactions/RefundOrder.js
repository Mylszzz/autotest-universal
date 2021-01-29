"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundOrder = void 0;
const LogUtils_1 = require("../utils/LogUtils");
const Search_1 = require("./Search");
const TouchAction_1 = require("./TouchAction");
const GlobalUtil_1 = require("../utils/GlobalUtil");
const ScreenShotUtil_1 = require("../utils/ScreenShotUtil");
class RefundOrder {
    // @ts-ignore
    static async refundOrderToday(client, orderNo) {
        LogUtils_1.LogUtils.log.info("====对订单" + orderNo + "进行当日整单退款操作=====");
        //查询订单,并判断是否成功
        await Search_1.Search.searchNo(client, orderNo);
        try {
            let codeNo = await client.$('//android.view.View[@content-desc=' + orderNo + ']');
            await codeNo.click();
            LogUtils_1.LogUtils.log.info("开始申请退货！");
            await client.pause(1000);
            let re = await client.$('//android.widget.Button[@content-desc="申请退货"]');
            await re.click();
            await client.pause(1000);
            LogUtils_1.LogUtils.log.info("开始申请退货！");
            let ok1 = await client.$('//android.widget.Button[@content-desc="确认"]');
            await ok1.click();
            LogUtils_1.LogUtils.log.info("确认申请退货！");
            await client.pause(1000);
            // 输入退货的权限码
            LogUtils_1.LogUtils.log.info("====输入权限码====");
            await TouchAction_1.TouchAction.input(client);
            await client.pause(1000);
            if (!RefundOrder.isFind) {
                let ok2 = await client.$('//android.widget.Button[@content-desc="确认"]');
                await ok2.click();
                let ok3 = await client.$('//android.widget.Button[@content-desc="确认"]');
                await ok3.click();
                let ok4 = await client.$('//android.widget.Button[@content-desc="确认"]');
                await ok4.click();
                //  打印订单耗时
                await client.pause(2000);
                //    确认提示
                let tip = await client.$('//android.widget.Button[@content-desc="确定"]');
                await client.pause(500);
                tip.click();
                LogUtils_1.LogUtils.log.info("====订单" + orderNo + "当日整单退款成功");
                return true;
            }
        }
        catch (e) {
            LogUtils_1.LogUtils.log.info("====该笔订单预查询失败或退款失败,执行截屏操作===");
            await ScreenShotUtil_1.ScreenShotUtil.takeScreenShot(client, orderNo);
            return false;
        }
    }
    /**
     * 订单隔日整单退款
     * @author Daniel_Li
     * @param client
     * @param orderNo
     */
    // @ts-ignore
    static async refundBeforeOrder(client, orderNo) {
        LogUtils_1.LogUtils.log.info("====对订单" + orderNo + "进行当日整单退款操作=====");
        //查询订单,并判断是否成功
        await Search_1.Search.searchNo(client, orderNo);
        // 查询成功，执行退款操作
        try {
            let codeNo = await client.$('//android.view.View[@content-desc=' + orderNo + ']');
            await codeNo.click();
            await client.pause(1000);
            let re = await client.$('//android.widget.Button[@content-desc="申请退货"]');
            await re.click();
            let ok1 = await client.$('//android.widget.Button[@content-desc="确认"]');
            await ok1.click();
            let ok2 = await client.$('//android.widget.Button[@content-desc="确认"]');
            await ok2.click();
            let ok3 = await client.$('//android.widget.Button[@content-desc="确认"]');
            await ok3.click();
            let ok4 = await client.$('//android.widget.Button[@content-desc="确认"]');
            await ok4.click();
            //  打印订单耗时
            await client.pause(2000);
            //    确认提示
            let tip = await client.$('//android.widget.Button[@content-desc="确定"]');
            await client.pause(500);
            tip.click();
            LogUtils_1.LogUtils.log.info("====订单" + orderNo + "隔日整单退款成功");
            return true;
        }
        catch (e) {
            LogUtils_1.LogUtils.log.info("====该笔订单预查询失败或退款失败,执行截屏操作===");
            await ScreenShotUtil_1.ScreenShotUtil.takeScreenShot(client, orderNo);
            try {
                LogUtils_1.LogUtils.log.info("监测是否为不支持供应商错误");
                if (await client.isElementDisplayed((await client.$('//android.view.View[@content-desc="退货信息预查询失败，订单支付行包含指定支付供应商, 不支持退货"]')).elementId)) {
                    // let tip = await client.$('//android.view.View[@content-desc="退货信息预查询失败，订单支付行包含指定支付供应商, 不支持退货"]');
                    let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
                    await confirm.click();
                    await client.pause(500);
                    let back = await client.$('//android.widget.Button[@content-desc="arrow back "]');
                    await back.click();
                    RefundOrder.isFind = true;
                    LogUtils_1.LogUtils.log.info('-----------------订单支付行包含指定支付供应商, 不支持退货-------------');
                }
            }
            catch (e) {
            }
            return false;
        }
    }
    /**
     * 隔日订单部分退款
     * @param client
     * @param orderNo
     */
    // @ts-ignore
    static async refundBeforeOrderPart(client, orderNo) {
        LogUtils_1.LogUtils.log.info("====对订单" + orderNo + "进行隔日部分退款操作=====");
        //查询订单
        await Search_1.Search.searchNo(client, orderNo);
        try {
            let re = await client.$('//android.widget.Button[@content-desc="申请退货"]');
            await re.click();
            let ok1 = await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
            await ok1.click();
            // 输入瑞华的固定密码
            let fixedpwd = await client.$('//android.view.View[@content-desc="固定密码"] ');
            await fixedpwd.click();
            LogUtils_1.LogUtils.log.info("====输入固定密码====");
            let pwd = GlobalUtil_1.GlobalUtil.map.get('returnGoodPassword');
            let pwdok = await client.$('//android.view.View[@content-desc="确定"]');
            LogUtils_1.LogUtils.log.info("====配置文件中的退款固定密码为：" + pwd);
            await TouchAction_1.TouchAction.touchPasswordAction(client, pwd);
            await pwdok.click();
            let ok2 = await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
            await ok2.click();
            //输入要退款的金额
            let canrefundMoney = await client.findElements('xpath', '//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[19]/android.widget.EditText[1]');
            let ok3 = await client.$('//android.widget.Button[@content-desc="确认"]');
            await ok3.click();
            let ok4 = await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
            await ok4.click();
            //退积分中
            try {
                let refund = await client.$('//android.view.View[@content-desc="退积分..."]');
                while (true) {
                    await client.isElementDisplayed(refund.elementId);
                }
            }
            catch (e) {
            }
            LogUtils_1.LogUtils.log.info("====订单" + orderNo + "隔日部分退款成功");
            return true;
        }
        catch (e) {
            LogUtils_1.LogUtils.log.info("====该笔订单查询失败或退款失败");
            await ScreenShotUtil_1.ScreenShotUtil.takeScreenShot(client, orderNo);
            return false;
        }
    }
}
exports.RefundOrder = RefundOrder;
/**
 * 当日订单退款
 * @author Daniel_Li
 * @param client
 * @param orderNo
 */
RefundOrder.isFind = false;
