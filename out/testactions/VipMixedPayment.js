"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VipMixedPayment = void 0;
const TouchAction_1 = require("./TouchAction");
const number_precision_1 = __importDefault(require("number-precision"));
const GlobalUtil_1 = require("../utils/GlobalUtil");
const saleData_1 = require("../entity/saleData");
const LogUtils_1 = require("../utils/LogUtils");
const PaymentProcessing_1 = require("./PaymentProcessing");
const ExportCsv_1 = require("../utils/ExportCsv");
const CsvOptions_1 = require("../utils/CsvOptions");
const ScreenShotUtil_1 = require("../utils/ScreenShotUtil");
const loginAction_1 = require("./loginAction");
const LoginVip_1 = require("./LoginVip");
class VipMixedPayment {
    static async test(client, payTree, otherTree, frequency, headers, saleContent, fileName) {
        // 订单号
        let orderNoValue;
        // 这笔销售的总金额
        let price = 0;
        // 销售输出csv数据
        let saleOrderData = [];
        try {
            // 退货、取消交易
            let content = otherTree.get("data")[0];
            // 退货、取消交易的值
            let val = otherTree.get("data")[1];
            let cancel = "";
            let backGoods = "";
            for (let i = 0; i < content.length; i++) {
                if (content[i].includes("取消交易")) {
                    cancel = val[i];
                }
                else if (content[i].includes("退货")) {
                    backGoods = val[i];
                }
            }
            // 支付方式:
            let payMethods = payTree.get("data")[0];
            // 支付方式对应金额 [1,2]
            let prices = payTree.get("data")[1];
            // 日志信息
            LogUtils_1.LogUtils.log.info("测试" + payMethods);
            //
            await this.sleep(2000);
            //输入会员手机号
            // TODO： 输入手机号有时有错误
            await LoginVip_1.LoginVip.loginVip(client);
            //点击选取货品
            let toSale = await client.$('//android.view.View[@content-desc="货号:' + GlobalUtil_1.GlobalUtil.map.get('storeNumber') + '"]');
            await toSale.click();
            //计算总价
            let p = 0;
            for (let i = 0; i < prices.length; i++) {
                p += prices[i];
            }
            price = number_precision_1.default.strip(p);
            //输入价格
            await TouchAction_1.TouchAction.touchPriceAction(client, price.toString());
            //确定
            let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
            await confirm.click();
            //去结算
            let settlement = await client.$('//android.widget.Button[@content-desc="去结算"]');
            await settlement.click();
            let up_down = 0;
            // 订单取消
            if (cancel === 'Y') {
                let i = Math.floor(Math.random() * (payMethods.length - 1));
                if (i == 0) {
                    i = 1;
                }
                //选择支付方式
                for (let j = 0; j < payMethods.length; j++) {
                    //第几步取消
                    if (i === j) {
                        orderNoValue = await PaymentProcessing_1.PaymentProcessing.cancelTheDeal(client);
                        LogUtils_1.LogUtils.log.info("取消交易：" + payMethods + "  符合预期");
                        break;
                    }
                    else {
                        LogUtils_1.LogUtils.log.info("+++++++进入sales_cancelled");
                        await this.sales_cancelled(client, payMethods, prices, j, up_down);
                    }
                }
            }
            // 订单不取消
            else {
                orderNoValue = await this.normalSales(client, payMethods, prices, up_down);
                LogUtils_1.LogUtils.log.info("销售：" + payMethods + "  符合预期");
            }
            //创建销售数据
            let saleData = new saleData_1.SaleData();
            saleData.saleTime = new Date().toLocaleDateString();
            saleData.orderNo = "'" + orderNoValue;
            saleData.price = price;
            saleData.saleContent = saleContent;
            saleOrderData.push(saleData);
            let option = CsvOptions_1.CsvOptions.configurationOption(frequency, headers);
            await ExportCsv_1.ExportCsv.printSaleData(option, saleOrderData, fileName);
        }
        catch (e) {
            // 出错截图
            await ScreenShotUtil_1.ScreenShotUtil.takeScreenShot(client, orderNoValue);
            //创建销售数据
            let saleData = new saleData_1.SaleData();
            saleData.saleTime = new Date().toLocaleDateString();
            saleData.orderNo = "'" + orderNoValue;
            saleData.price = price;
            saleData.saleContent = saleContent;
            saleOrderData.push(saleData);
            let option = CsvOptions_1.CsvOptions.configurationOption(frequency, headers);
            await ExportCsv_1.ExportCsv.printSaleData(option, saleOrderData, fileName);
            // 重启
            await client.launchApp();
            await loginAction_1.LoginAction.Login(client);
        }
    }
    static async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, ms);
        });
    }
    static async normalSales(client, payMethods, prices, up_down) {
        for (let j = 0; j < payMethods.length; j++) {
            // 恢复正常等待时间
            await client.setImplicitTimeout(10000);
            let payName = payMethods[j];
            //获取所有支付方式
            let payss = await client.findElements('xpath', '//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View[' + (17 + j * 2) + ']/android.view.View');
            let i = 1;
            for (i; i <= payss.length; i++) {
                let p = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View[' + (17 + j * 2) + ']/android.view.View[' + i + ']');
                let name = await p.getAttribute('content-desc');
                if (payName === name) {
                    break;
                }
            }
            if (i <= 6) {
                if (up_down === 0) {
                    await TouchAction_1.TouchAction.clickPay(client, i);
                }
                else {
                    for (let x = 0; x < up_down; x++) {
                        let up = await client.$('//android.widget.Button[@content-desc="arrow dropup"]');
                        await up.click();
                    }
                    await TouchAction_1.TouchAction.clickPay(client, i);
                }
            }
            else {
                let downCount = 0;
                let num = i;
                while (num > 6) {
                    num = num - 6;
                    downCount += 1;
                }
                if (up_down < downCount) {
                    let tmp = downCount;
                    downCount = downCount - up_down;
                    up_down = tmp;
                    for (let x = 0; x < downCount; x++) {
                        let down = await client.$('//android.widget.Button[@content-desc="arrow dropdown"]');
                        await down.click();
                    }
                    if (payss.length - 6 * downCount < 3) {
                        num += 4;
                        await TouchAction_1.TouchAction.clickPay(client, num);
                    }
                    else if (payss.length - 6 * downCount >= 3 && payss.length - 6 * downCount < 5) {
                        num += 2;
                        await TouchAction_1.TouchAction.clickPay(client, num);
                        // console.log("点击第几个：" + num);
                    }
                    else if (payss.length - 6 * downCount >= 6) {
                        await TouchAction_1.TouchAction.clickPay(client, num);
                    }
                }
                else if (up_down > downCount) {
                    let tmp = downCount;
                    downCount = up_down - downCount;
                    up_down = tmp;
                    for (let x = 0; x < downCount; x++) {
                        let down = await client.$('//android.widget.Button[@content-desc="arrow dropup"]');
                        await down.click();
                    }
                    if (payss.length - 6 * downCount < 3) {
                        num += 4;
                        await TouchAction_1.TouchAction.clickPay(client, num);
                    }
                    else if (payss.length - 6 * downCount >= 3 && payss.length - 6 * downCount < 5) {
                        num += 2;
                        await TouchAction_1.TouchAction.clickPay(client, num);
                        // console.log("点击第几个：" + num);
                    }
                    else if (payss.length - 6 * downCount >= 6) {
                        await TouchAction_1.TouchAction.clickPay(client, num);
                    }
                }
                else {
                    if (payss.length - 6 * downCount < 3) {
                        num += 4;
                        await TouchAction_1.TouchAction.clickPay(client, num);
                    }
                    else if (payss.length - 6 * downCount >= 3 && payss.length - 6 * downCount < 5) {
                        num += 2;
                        await TouchAction_1.TouchAction.clickPay(client, num);
                        // console.log("点击第几个：" + num);
                    }
                    else if (payss.length - 6 * downCount >= 6) {
                        await TouchAction_1.TouchAction.clickPay(client, num);
                    }
                }
            }
            // 输入该支付方式的价格
            await TouchAction_1.TouchAction.touchPriceAction(client, prices[j].toString());
            let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
            await confirm.click();
            // 各种支付方式的处理
            await PaymentProcessing_1.PaymentProcessing.handle(client);
        }
        // 恢复正常等待时间
        await client.setImplicitTimeout(20000);
        let buffer = await client.$('//android.view.View[@content-desc="结算"]');
        await buffer.getAttribute('content-desc');
        // 打印中
        try {
            let printing = await client.$('//android.webkit.WebView[@content-desc="Ion' +
                'ic App"]/android.app.Dialog/android.view.View[1]/android.widget.Image[12]');
            while (true) {
                await client.isElementDisplayed(printing.elementId);
            }
        }
        catch (e) {
        }
        //获取订单号
        let orderNo = await client.$('//android.view.View[@content-desc="订单号"]/following-sibling::android.view.View');
        let orderNoValue = await orderNo.getAttribute('content-desc');
        //完成
        let complete = await client.$('//android.widget.Button[@content-desc="完成"]');
        await complete.click();
        return orderNoValue;
    }
    static async sales_cancelled(client, payMethods, prices, j, up_down) {
        // 恢复正常等待时间
        await client.setImplicitTimeout(10000);
        let payName = payMethods[j];
        //获取所有支付方式
        let payss = await client.findElements('xpath', '//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View[' + (17 + j * 2) + ']/android.view.View');
        let i = 1;
        for (i; i <= payss.length; i++) {
            let p = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View[' + (17 + j * 2) + ']/android.view.View[' + i + ']');
            let name = await p.getAttribute('content-desc');
            if (payName === name) {
                break;
            }
        }
        if (i <= 6) {
            if (up_down === 0) {
                await TouchAction_1.TouchAction.clickPay(client, i);
            }
            else {
                for (let x = 0; x < up_down; x++) {
                    let up = await client.$('//android.widget.Button[@content-desc="arrow dropup"]');
                    await up.click();
                }
                await TouchAction_1.TouchAction.clickPay(client, i);
            }
        }
        else {
            let downCount = 0;
            let num = i;
            while (num > 6) {
                num = num - 6;
                downCount += 1;
            }
            if (up_down < downCount) {
                let tmp = downCount;
                downCount = downCount - up_down;
                up_down = tmp;
                for (let x = 0; x < downCount; x++) {
                    let down = await client.$('//android.widget.Button[@content-desc="arrow dropdown"]');
                    await down.click();
                }
                if (payss.length - 6 * downCount < 3) {
                    num += 4;
                    await TouchAction_1.TouchAction.clickPay(client, num);
                }
                else if (payss.length - 6 * downCount >= 3 && payss.length - 6 * downCount < 5) {
                    num += 2;
                    await TouchAction_1.TouchAction.clickPay(client, num);
                    // console.log("点击第几个：" + num);
                }
                else if (payss.length - 6 * downCount >= 6) {
                    await TouchAction_1.TouchAction.clickPay(client, num);
                }
            }
            else if (up_down > downCount) {
                let tmp = downCount;
                downCount = up_down - downCount;
                up_down = tmp;
                for (let x = 0; x < downCount; x++) {
                    let down = await client.$('//android.widget.Button[@content-desc="arrow dropup"]');
                    await down.click();
                }
                if (payss.length - 6 * downCount < 3) {
                    num += 4;
                    await TouchAction_1.TouchAction.clickPay(client, num);
                }
                else if (payss.length - 6 * downCount >= 3 && payss.length - 6 * downCount < 5) {
                    num += 2;
                    await TouchAction_1.TouchAction.clickPay(client, num);
                    // console.log("点击第几个：" + num);
                }
                else if (payss.length - 6 * downCount >= 6) {
                    await TouchAction_1.TouchAction.clickPay(client, num);
                }
            }
            else {
                if (payss.length - 6 * downCount < 3) {
                    num += 4;
                    await TouchAction_1.TouchAction.clickPay(client, num);
                }
                else if (payss.length - 6 * downCount >= 3 && payss.length - 6 * downCount < 5) {
                    num += 2;
                    await TouchAction_1.TouchAction.clickPay(client, num);
                    // console.log("点击第几个：" + num);
                }
                else if (payss.length - 6 * downCount >= 6) {
                    await TouchAction_1.TouchAction.clickPay(client, num);
                }
            }
        }
        // 输入该支付方式的价格
        await TouchAction_1.TouchAction.touchPriceAction(client, prices[j].toString());
        let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
        await confirm.click();
        // 各种支付方式的处理
        await PaymentProcessing_1.PaymentProcessing.handle(client);
    }
}
exports.VipMixedPayment = VipMixedPayment;