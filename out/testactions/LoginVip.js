"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VipLogin_Elo = exports.VipLogin_A8 = exports.LoginVip = void 0;
const touchAction_1 = require("./touchAction");
const globalUtil_1 = require("../utils/globalUtil");
/**
 * @deprecated
 */
class LoginVip {
    /**
     * @deprecated
     * 请使用deviceActions.ts下VipLoginAction.vipLogin()代替
     * @param client
     * @returns {Promise<void>}
     */
    static async loginVip(client) {
        //点击登录会员
        let vip = await client.$('//android.view.View[@content-desc="请点击登录会员号码"]');
        await vip.click();
        //输入会员号码
        await touchAction_1.TouchAction.phoneNum(client, globalUtil_1.GlobalUtil.getConfigMap().get('vipPhone'));
        await client.pause(1000);
        //点击确定
        let ok = await client.$('//android.widget.Button[@content-desc="确定"]');
        await ok.click();
        await client.pause(3000);
    }
}
exports.LoginVip = LoginVip;
/**
 * A8
 */
class VipLogin_A8 {
    constructor(client) {
        this.client = client;
        this.phoneNum = globalUtil_1.GlobalUtil.getConfigMap().get('vipPhone');
    }
    async vipLogin() {
        let vipBtn = await this.client.$('//android.view.View[@content-desc="请点击登录会员号码"]');
        await vipBtn.click();
        //输入会员号码
        await touchAction_1.TouchAction.phoneNum(this.client, this.phoneNum);
        await this.client.pause(1000);
        //点击确定
        let okBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await okBtn.click();
        await this.client.pause(3000);
    }
}
exports.VipLogin_A8 = VipLogin_A8;
/**
 * ELO
 */
class VipLogin_Elo {
    constructor(client) {
        this.client = client;
        this.phoneNum = globalUtil_1.GlobalUtil.getConfigMap().get('vipPhone');
    }
    async vipLogin() {
        //输入会员号码
        await touchAction_1.TouchAction.phoneNum(this.client, this.phoneNum);
        await this.client.pause(1000);
        //点击确定
        let okBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await okBtn.click();
        await this.client.pause(3000);
    }
}
exports.VipLogin_Elo = VipLogin_Elo;
