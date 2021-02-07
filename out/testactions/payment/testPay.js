"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPay = void 0;
const number_precision_1 = __importDefault(require("number-precision"));
const TouchAction_1 = require("../TouchAction");
class TestPay {
    static async test(client, payTree, frequency, headers, fileName) {
        let price = 0;
        let saleOrderData = [];
        let action = await client.$('//android.view.View[@content-desc="货号:HT202011190002801"]');
        await action.click();
        await client.pause(1000);
        let payMethods = payTree.get("data")[0];
        console.log("输出数据");
        console.log(payTree.get("data"));
        console.log(payMethods);
        let prices;
        for (let i = 1; i < payTree.get("data").length; i++) {
            prices = payTree.get("data")[i];
            console.log(prices);
        }
        // console.log("=========打印payMethods.length"+payMethods.length)
        //计算总价
        let total = 0;
        for (let i = 0; i < prices.length; i++) {
            total += prices[i];
        }
        price = number_precision_1.default.strip(total);
        await TouchAction_1.TouchAction.touchPriceAction(client, price.toString());
        await client.pause(1000);
        //确定
        let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
        await confirm.click();
        await client.pause(1000);
        let pay = await client.$('//android.widget.Button[@content-desc="去结算"]');
        await pay.click();
        await client.pause(1000);
        for (let i = 0; i < payMethods.length; i++) {
            if (prices[i] !== '0') {
                let value = prices[i];
                let method = payMethods[i];
                let toDo = await client.$('//android.widget.Button[@content-desc="' + method + '"]');
                await toDo.click();
                await client.pause(1000);
                console.log("=====这里是方法测试method===" + method);
                let writePrice = await client.$('//android.view.View[@content-desc="' + value + '"]');
                await writePrice.click();
                console.log("=====这里是方法测试value====" + value);
                await client.pause(1000);
                let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
                await confirm.click();
                //打印时间要长一点
                await client.pause(6000);
            }
        }
        let reconfirm = await client.$('//android.widget.Button[@content-desc="确定"]');
        await reconfirm.click();
        await client.pause(5000);
        let complete = await client.$('//android.widget.Button[@content-desc="完成"]');
        await complete.click();
        await client.pause(3000);
    }
}
exports.TestPay = TestPay;
