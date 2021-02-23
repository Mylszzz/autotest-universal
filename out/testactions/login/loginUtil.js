"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device_Elo = exports.Device_A8 = exports.Device = void 0;
const logUtils_1 = require("../../utils/logUtils");
const globalUtil_1 = require("../../utils/globalUtil");
const exceptions_1 = require("../../utils/exceptions");
/**
 * device 的抽象类
 * 不同的机器继承次方法需要readUtils.ts中更新机器的配置信息
 * 需要实现2个抽象方法
 */
class Device {
    constructor(client) {
        this.client = client;
        this.username = globalUtil_1.GlobalUtil.getConfigMap().get("username"); // 从map中得到用户名
        this.password = globalUtil_1.GlobalUtil.getConfigMap().get("password"); // 从map中得到密码
    }
}
exports.Device = Device;
class Device_A8 extends Device {
    constructor(client) {
        super(client);
    }
    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            logUtils_1.LogUtils.loginLog.info("====开始进行商户登录===");
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
                    logUtils_1.LogUtils.loginLog.info("============login finish=============" + new Date());
                    logUtils_1.LogUtils.loginLog.info("====商户登录成功===");
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
        logUtils_1.LogUtils.loginLog.warn("----------设备重新启动了！！！！");
        await this.loginProcess();
    }
}
exports.Device_A8 = Device_A8;
class Device_Elo extends Device {
    constructor(client) {
        super(client);
    }
    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            logUtils_1.LogUtils.loginLog.info("====开始进行商户登录===");
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
            console.log("============login finish=============" + new Date());
            logUtils_1.LogUtils.loginLog.info("====商户登录成功===");
        }
        catch (e) {
            logUtils_1.LogUtils.loginLog.error(e);
        }
    }
    async reboot() {
    }
}
exports.Device_Elo = Device_Elo;
