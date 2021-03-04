"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutAction_Elo = exports.LogoutAction_A8 = void 0;
const logUtils_1 = require("../../utils/logUtils");
const inputCoordinates_1 = require("../../static/inputCoordinates");
const buttonXPaths_1 = require("../../static/buttonXPaths");
const settings_1 = require("../../static/settings");
/**
 * A8的退出脚本具体类
 * 单例模式
 */
class LogoutAction_A8 {
    constructor(client) {
        this.client = client;
    }
    /**
     * 获得LogoutAction_A8的唯一实例
     * @param {WebdriverIO.BrowserObject} client
     * @returns {LogoutAction_A8}
     */
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new LogoutAction_A8(client);
        }
        return this.instance;
    }
    // 退出登录
    async accountLogout() {
        let menuBtn = await this.client.$(buttonXPaths_1.ButtonXPaths_A8.MENU);
        await menuBtn.click();
        await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
        let accountLogoutBtn = await this.client.$(buttonXPaths_1.ButtonXPaths_A8.ACCOUNTLOGOUT);
        await accountLogoutBtn.click();
        await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
        let confirmBtn = await this.client.$(buttonXPaths_1.ButtonXPaths_A8.CONFIRM);
        await confirmBtn.click();
        logUtils_1.LogUtils.log.info("******账号登出--》手动登出符合预期******");
        await this.client.pause(settings_1.runTimeSettings.longPauseTime);
    }
    // 退出系统
    async sysLogout() {
        let menu = await this.client.$(buttonXPaths_1.ButtonXPaths_A8.MENU);
        await menu.click();
        await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
        let sysLogout = await this.client.$(buttonXPaths_1.ButtonXPaths_A8.SYSTEMLOGOUT);
        await sysLogout.click();
        logUtils_1.LogUtils.log.info("******账号登出--》手动登出符合预期******");
        await this.client.pause(settings_1.runTimeSettings.longPauseTime);
    }
}
exports.LogoutAction_A8 = LogoutAction_A8;
/**
 * Elo
 */
class LogoutAction_Elo {
    constructor(client) {
        this.client = client;
    }
    /**
     * 获得LogoutAction_A8的唯一实例
     * @param {WebdriverIO.BrowserObject} client
     * @returns {LogoutAction_A8}
     */
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new LogoutAction_Elo(client);
        }
        return this.instance;
    }
    // 退出登录
    async accountLogout() {
        let contactBtn = await this.client.$(buttonXPaths_1.ButtonXPaths_Elo.CONTACT);
        await contactBtn.click();
        await this.client.pause(500);
        // 以坐标形式点击退出账号按钮
        await this.client.touchAction([
            {
                action: 'tap',
                x: inputCoordinates_1.InputCoordinates_Elo.getExitAccountCoor()[0].x,
                y: inputCoordinates_1.InputCoordinates_Elo.getExitAccountCoor()[0].y,
            },
        ]);
        await this.client.touchAction([
            {
                action: 'tap',
                x: inputCoordinates_1.InputCoordinates_Elo.getExitAccountCoor()[1].x,
                y: inputCoordinates_1.InputCoordinates_Elo.getExitAccountCoor()[1].y,
            },
        ]);
        try {
            await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            logUtils_1.LogUtils.log.info("******账号登出--》手动登出符合预期******");
            await this.client.pause(settings_1.runTimeSettings.longPauseTime);
        }
        catch (e) {
            logUtils_1.LogUtils.log.info("******账号登出--》手动登出不符合预期******");
        }
    }
    // 退出系统
    async sysLogout() {
        let menuBtn = await this.client.$(buttonXPaths_1.ButtonXPaths_Elo.MENU);
        await menuBtn.click();
        await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
        let sysLogoutBtn = await this.client.$(buttonXPaths_1.ButtonXPaths_Elo.SYSTEMLOGOUT);
        await sysLogoutBtn.click();
        await this.client.pause(settings_1.runTimeSettings.longPauseTime);
    }
}
exports.LogoutAction_Elo = LogoutAction_Elo;
