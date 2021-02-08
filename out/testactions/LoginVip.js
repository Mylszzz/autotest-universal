"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginVip = void 0;
const TouchAction_1 = require("./TouchAction");
const globalUtil_1 = require("../utils/globalUtil");
/*
* 登录会员
* */
class LoginVip {
    static async loginVip(client) {
        //点击登录会员
        let vip = await client.$('//android.view.View[@content-desc="请点击登录会员号码"]');
        await vip.click();
        //输入会员号码
        await TouchAction_1.TouchAction.phoneNum(client, globalUtil_1.GlobalUtil.getConfigMap().get('vipPhone'));
        await client.pause(1000);
        //点击确定
        let ok = await client.$('//android.widget.Button[@content-desc="确定"]');
        await ok.click();
        await client.pause(3000);
    }
}
exports.LoginVip = LoginVip;
