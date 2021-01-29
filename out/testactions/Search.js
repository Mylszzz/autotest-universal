"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search = void 0;
const TouchAction_1 = require("./TouchAction");
const LogUtils_1 = require("../utils/LogUtils");
class Search {
    static async search(client) {
        let menu = await client.$('//android.widget.Button[@content-desc="menu "]');
        await menu.click();
        await client.pause(1000);
        //  点击查询
        let chooseBackGood = await client.$('//android.widget.Button[@content-desc="list box 查询/退货"]');
        await chooseBackGood.click();
        await client.pause(2000);
    }
    static async searchNo(client, num) {
        //  查询订单号或会员号
        let codeNoText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.widget.EditText');
        await codeNoText.click();
        await client.pause(1000);
        await TouchAction_1.TouchAction.phoneNum(client, num);
        await client.pause(2000);
        try {
            let ok = await client.$('//android.widget.Button[@content-desc="确定"]');
            await ok.click();
            await client.pause(1000);
            LogUtils_1.LogUtils.log.info("=====" + num + "查询符合预期==");
            LogUtils_1.LogUtils.log.info("=====查询结束====");
        }
        catch (e) {
            LogUtils_1.LogUtils.log.info("=====" + num + "查询无结果==");
            LogUtils_1.LogUtils.log.info("=====查询结束====");
        }
    }
}
exports.Search = Search;
