"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VipLogin_Elo = exports.VipLogin_A8 = void 0;
const touchAction_1 = require("./touchAction");
const globalUtil_1 = require("../utils/globalUtil");
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
