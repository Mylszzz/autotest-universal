"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device_Elo = exports.Device_A8 = exports.Login = void 0;
const logUtils_1 = require("../../utils/logUtils");
const globalUtil_1 = require("../../utils/globalUtil");
const exceptions_1 = require("../../utils/exceptions");
/**
 * 登录的抽象类
 * 继承此方法还需要考虑在globalUtils.ts中更新机器的配置信息
 * 需要实现3个抽象方法
 * 具体子类应该使用单例设计模式
 */
class Login {
    constructor(client) {
        this.client = client;
        this.username = globalUtil_1.GlobalUtil.getConfigMap().get("username"); // 从map中得到用户名
        this.password = globalUtil_1.GlobalUtil.getConfigMap().get("password"); // 从map中得到密码
    }
}
exports.Login = Login;
/**
 * A8
 */
class Device_A8 extends Login {
    constructor(client) {
        super(client);
    }
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new Device_A8(client);
        }
        return this.instance;
    }
    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            logUtils_1.LogUtils.loginLog.info("****开始进行商户登录****");
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
        }
        catch (e) {
            logUtils_1.LogUtils.loginLog.error(e);
        }
    }
    async loginProcess() {
        try {
            await this.usernameText.clearValue(); //
            await this.client.pause(1000);
            await this.usernameText.setValue(this.username);
            await this.client.pause(1000);
            await this.passwordText.setValue(this.password);
            await this.client.pause(1000);
            let loginBtn = await this.client.$('//android.widget.Button[@content-desc="登录"]');
            await this.client.pause(1000);
            await loginBtn.click();
        }
        catch (e) {
        }
        finally {
            try {
                let msg = await this.client.$('//android.view.View[@content-desc="货号:' +
                    globalUtil_1.GlobalUtil.getConfigMap().get("storeNumber") + '"]');
                await this.client.setImplicitTimeout(100); // 0.1秒Timeout
                if (await msg.isDisplayed()) {
                    await this.client.setImplicitTimeout(10000); // 10秒Timeout
                    logUtils_1.LogUtils.loginLog.info("*********商户登录成功*********" + new Date());
                }
                else {
                    await this.client.setImplicitTimeout(10000); // 10秒Timeout
                    throw new exceptions_1.LoginException('L0001', '登录失败！');
                }
            }
            catch (e) {
                if (e instanceof exceptions_1.LoginException) {
                    logUtils_1.LogUtils.loginLog.error(e.toString());
                    await this.reboot();
                }
                else {
                    logUtils_1.LogUtils.loginLog.error(e.toString());
                }
            }
        }
    }
    async reboot() {
        await this.client.startActivity('net.ttoto.grandjoy.hbirdpos', 'net.ttoto.grandjoy.hbirdpos.MainActivity');
        logUtils_1.LogUtils.loginLog.warn("******设备重新启动了！******");
        await this.loginProcess();
    }
}
exports.Device_A8 = Device_A8;
/**
 * Elo
 */
class Device_Elo extends Login {
    constructor(client) {
        super(client);
    }
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new Device_Elo(client);
        }
        return this.instance;
    }
    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            logUtils_1.LogUtils.loginLog.info("*********开始进行商户登录*********");
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[2]');
        }
        catch (e) {
            logUtils_1.LogUtils.loginLog.error(e);
        }
    }
    async loginProcess() {
        try {
            await this.usernameText.clearValue();
            await this.client.pause(1000);
            await this.usernameText.setValue(this.username);
            await this.client.pause(1000);
            await this.passwordText.setValue(this.password);
            await this.client.pause(1000);
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
        catch (e) {
            logUtils_1.LogUtils.loginLog.error(e);
        }
    }
    async reboot() {
        //TODO
    }
}
exports.Device_Elo = Device_Elo;
