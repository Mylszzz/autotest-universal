"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VipLogin_Elo = exports.VipLogin_A8 = void 0;
const phoneNum_1 = require("../phoneNum");
const globalUtil_1 = require("../../utils/globalUtil");
const logUtils_1 = require("../../utils/logUtils");
/**
 * A8
 */
class VipLogin_A8 {
    constructor(client) {
        this.client = client;
        this.phoneNum = globalUtil_1.GlobalUtil.getConfigMap().get('vipPhone');
    }
    /**
     * 获得VipLogin_A8的实例
     * @param client
     * @returns {VipLogin_A8}
     */
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new VipLogin_A8(client);
        }
        return this.instance;
    }
    async vipLogin() {
        let vipBtn = await this.client.$('//android.view.View[@content-desc="请点击登录会员号码"]');
        await vipBtn.click();
        logUtils_1.LogUtils.saleLog.info('******登录vip账号:' + this.phoneNum + '*******');
        //输入会员号码
        await phoneNum_1.PhoneNum.phoneNum(this.client, this.phoneNum);
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
    /**
     * 获得VipLogin_Elo的实例
     * @param client
     * @returns {VipLogin_Elo}
     */
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new VipLogin_Elo(client);
        }
        return this.instance;
    }
    async vipLogin() {
        //输入会员号码
        await phoneNum_1.PhoneNum.phoneNum(this.client, this.phoneNum);
        await this.client.pause(1000);
        //点击确定
        let okBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await okBtn.click();
        await this.client.pause(3000);
    }
}
exports.VipLogin_Elo = VipLogin_Elo;
