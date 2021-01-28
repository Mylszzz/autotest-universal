"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search = void 0;
const TouchAction_1 = require("./TouchAction");
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
        await TouchAction_1.TouchAction.phoneNum(client, num);
        let ok = await client.$('//android.widget.Button[@content-desc="确定"]');
        await ok.click();
    }
}
exports.Search = Search;
