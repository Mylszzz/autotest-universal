"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePassword_Elo = exports.ChangePassword_A8 = exports.ChangePassword = void 0;
const logUtils_1 = require("../../utils/logUtils");
const globalUtil_1 = require("../../utils/globalUtil");
const settings_1 = require("../../static/settings");
const buttonXPaths_1 = require("../../static/buttonXPaths");
/**
 * 修改密码的抽象类
 * 需要实现2个抽象方法
 * 具体子类应该使用单例设计模式
 */
class ChangePassword {
    constructor(client) {
        this.client = client;
        this.oldPassword = globalUtil_1.GlobalUtil.getConfigMap().get("password"); // 从map中得到旧密码
        this.newPassword = globalUtil_1.GlobalUtil.getConfigMap().get("newPassword"); // 从map中得到新密码
    }
}
exports.ChangePassword = ChangePassword;
/**
* A8
*/
class ChangePassword_A8 extends ChangePassword {
    constructor(client) {
        super(client);
    }
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new ChangePassword_A8(client);
        }
        return this.instance;
    }
    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            let menu = await this.client.$(buttonXPaths_1.ButtonXPaths_A8.MENU);
            await menu.click();
            await this.client.pause(2000);
            //  点击查询
            let chooseBackGood = await this.client.$('//android.widget.Button[@content-desc="lock 修改密码"]');
            await chooseBackGood.click();
            logUtils_1.LogUtils.loginLog.info("****开始进行密码修改****");
            this.oldPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View/android.view.View[2]/android.widget.EditText');
            this.newPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View/android.view.View[4]/android.widget.EditText');
            this.confirmPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View/android.view.View[6]/android.widget.EditText');
        }
        catch (e) {
            logUtils_1.LogUtils.loginLog.error(e);
        }
    }
    async changePasswordProcess() {
        try {
            this.getDeviceConfig();
            await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
            await this.oldPasswordText.setValue(this.oldPassword);
            await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
            await this.newPasswordText.setValue(this.newPassword);
            await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
            await this.confirmPasswordText.setValue(this.newPassword);
            await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
            let loginBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
            await loginBtn.click();
        }
        catch (e) {
        }
        finally {
            try {
                let msg = await this.client.$('//android.view.View[@content-desc="修改成功"]');
                if (await msg.isDisplayed()) {
                    let determine = await this.client.$('//android.widget.Button[@content-desc="确定"]');
                    await determine.click();
                    let PasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
                    await PasswordText.setValue(this.newPassword);
                    let loginBtn = await this.client.$('//android.widget.Button[@content-desc="登录"]');
                    await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
                    await loginBtn.click();
                }
                else {
                    await this.client.setImplicitTimeout(10000); // 10秒Timeout
                }
            }
            catch (e) {
                logUtils_1.LogUtils.loginLog.error(e.toString());
            }
        }
    }
}
exports.ChangePassword_A8 = ChangePassword_A8;
/**
 * Elo
 */
class ChangePassword_Elo extends ChangePassword {
    constructor(client) {
        super(client);
    }
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new ChangePassword_Elo(client);
        }
        return this.instance;
    }
    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            logUtils_1.LogUtils.loginLog.info("****开始进行密码修改****");
            this.oldPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View/android.view.View[2]/android.widget.EditText');
            this.newPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View/android.view.View[3]/android.widget.EditText');
            this.confirmPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View/android.view.View[4]/android.widget.EditText');
        }
        catch (e) {
            logUtils_1.LogUtils.loginLog.error(e);
        }
    }
    async changePasswordProcess() {
        try {
            await this.oldPasswordText.setValue(this.oldPassword);
            await this.newPasswordText.setValue(this.newPassword);
            await this.confirmPasswordText.setValue(this.newPassword);
            await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
            let loginBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
            await loginBtn.click();
        }
        catch (e) {
        }
        finally {
            try {
                let msg = await this.client.$('//android.view.View[@content-desc="修改成功"]');
                if (await msg.isDisplayed()) {
                    let determine = await this.client.$('//android.widget.Button[@content-desc="确定"]');
                    await determine.click();
                    let PasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
                    await PasswordText.setValue(this.newPassword);
                    // 点击登录按钮
                    await this.client.touchAction([{
                            action: 'tap',
                            x: 950,
                            y: 670
                        }]);
                    // 缓冲
                    await this.client.$('//android.view.View[@content-desc="会员"]');
                    logUtils_1.LogUtils.loginLog.info("*********商户登录成功*********");
                }
            }
            catch (e) {
                logUtils_1.LogUtils.loginLog.error(e);
            }
        }
    }
}
exports.ChangePassword_Elo = ChangePassword_Elo;
