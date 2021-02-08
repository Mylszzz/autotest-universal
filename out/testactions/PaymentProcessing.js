"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcessing = void 0;
const globalUtil_1 = require("../utils/globalUtil");
/**
 * 销售支付细节处理
 */
class PaymentProcessing {
    static async handle(client) {
        await client.setImplicitTimeout(0);
        await this.selectCardType(client);
    }
    // 选择卡类型   电子卡和实体卡
    static async selectCardType(client) {
        // 购物卡，请选择卡类型
        try {
            let cardType = await client.$('//android.view.View[@content-desc="请选择卡类型"]');
            await cardType.getAttribute('content-desc');
            if (globalUtil_1.GlobalUtil.map.get('CardType') === '电子卡') {
                let electronicCard = await client.$('//android.widget.Button[@content-desc="电子卡"]');
                await electronicCard.click();
                // 等待扫码
                await this.scanCode(client);
            }
            else if (globalUtil_1.GlobalUtil.map.get('CardType') === '实体卡') {
                let physicalCard = await client.$('//android.widget.Button[@content-desc="实体卡"]');
                await physicalCard.click();
            }
        }
        catch (e) {
            await this.selectPayMethod(client);
        }
    }
    // 选择支付方式  目前：微信和支付宝
    static async selectPayMethod(client) {
        //选择支付方式
        try {
            let payMethod = await client.$('//android.view.View[@content-desc="选择支付方式"]');
            await payMethod.getAttribute('content-desc');
            if (globalUtil_1.GlobalUtil.map.get('TTPAYMethod') === '微信') {
                let weChat = await client.$('//android.widget.RadioButton[@content-desc="微信"]');
                await weChat.click();
            }
            else if (globalUtil_1.GlobalUtil.map.get('TTPAYMethod') === '支付宝') {
                let alipay = await client.$('//android.widget.RadioButton[@content-desc="支付宝"]');
                await alipay.click();
            }
            let confirm = await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
            await confirm.click();
            // 判断是否支付
            let confirmPayment = await client.$('//android.view.View[@content-desc="请扫描二维码完成支付"]');
            while (true) {
                await client.isElementDisplayed(confirmPayment.elementId);
            }
        }
        catch (e) {
            await this.scanCode(client);
        }
    }
    // 扫码框
    static async scanCode(client) {
        // 扫码框
        try {
            // 扫码框
            let scanCodeBox = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.widget.EditText');
            while (true) {
                await client.isElementDisplayed(scanCodeBox.elementId);
            }
        }
        catch (e) {
        }
    }
    // 取消交易
    static async cancelTheDeal(client) {
        let cancel = await client.$('//android.widget.Button[@content-desc="取消交易"]');
        await cancel.click();
        // await client.$('//android.view.View[@content-desc="已支付金额将会按原方式退回"]');
        let determine = await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
        await determine.click();
        //获取订单号
        let orderNo = await client.$('//android.view.View[@content-desc="订单号"]/following-sibling::android.view.View');
        let orderNoValue = await orderNo.getAttribute('content-desc');
        let confirm = await client.$('//android.widget.Button[@content-desc="确认"]');
        await confirm.click();
        let determine2 = await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
        await determine2.click();
        return orderNoValue;
    }
    // 支付出错的提示
    static async errorTip(client) {
        try {
            let nn = await client.$('//android.view.View[@content-desc="云地址为空，请先设置云管理参数"]');
            await nn.getAttribute('content-desc');
            // 错误截图
            await client.takeScreenshot();
            let retry = await client.$('//android.widget.Button[@content-desc="重试"]');
            await retry.click();
            let cancel = await client.$('//android.widget.Button[@content-desc="取消"]');
            await cancel.click();
            await client.$('//android.view.View[@content-desc="支付失败"]');
            let confirm = await client.$('(//android.widget.Button[@content-desc="确定"])[2]');
            await confirm.click();
            // 支付出错取消交易
            await this.cancelTheDeal(client);
        }
        catch (e) {
        }
    }
}
exports.PaymentProcessing = PaymentProcessing;
