"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device_Elo = exports.Device_A8 = exports.Device = void 0;
const logUtils_1 = require("../../utils/logUtils");
const globalUtil_1 = require("../../utils/globalUtil");
/**
 * device 的抽象类
 * 不同的机器继承次方法需要readUtils.ts中更新机器的配置信息
 * 需要实现2个抽象方法
 */
class Device {
    constructor(client) {
        this.client = client;
        this.username = globalUtil_1.GlobalUtil.getConfigMap().get("username"); // 从map中得到用户名
        if (this.username == "" || this.username == undefined) {
            globalUtil_1.GlobalUtil.init();
        }
        this.password = globalUtil_1.GlobalUtil.getConfigMap().get("password"); // 从map中得到密码
    }
}
exports.Device = Device;
class Device_A8 extends Device {
    constructor(clinet) {
        super(clinet);
    }
    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            logUtils_1.LogUtils.log.info("====开始进行商户登录===");
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
        }
        catch (e) {
            logUtils_1.LogUtils.log.error(e);
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
            try {
                let ele = await this.client.$('//android.view.View[@content-desc="正在登陆,请稍后...."]');
                logUtils_1.LogUtils.log.info(await ele.getAttribute("content-desc"));
                let eleJudge = true;
                while (eleJudge) {
                    eleJudge = await this.client.isElementDisplayed(ele.elementId);
                }
            }
            catch (e) {
            }
            finally {
                try {
                    // await this.client.pause(1000);
                    // let timeoutMsg = await this.client.$('//android.view.View[@content-desc="登陆超时,请检查网络或稍后重试"]');
                    // if (this.client.isElementDisplayed(timeoutMsg.elementId)) {
                    //     await this.client.startActivity('net.ttoto.grandjoy.hbirdpos', 'net.ttoto.grandjoy.hbirdpos.MainActivity');
                    //     LogUtils.log.error("--------由于网络原因--设备重新启动了！！！！");
                    //     await this.loginProcess();
                    // }
                    let msg = await this.client.$('//android.view.View[@content-desc="货号:' +
                        globalUtil_1.GlobalUtil.getConfigMap().get("storeNumber") + '"]');
                    if (this.client.isElementDisplayed(msg.elementId)) {
                        console.log("============login finish=============" + new Date());
                        logUtils_1.LogUtils.log.info("====商户登录成功===");
                    }
                }
                catch (e) {
                    // 重新启动程序
                    await this.client.startActivity('net.ttoto.grandjoy.hbirdpos', 'net.ttoto.grandjoy.hbirdpos.MainActivity');
                    logUtils_1.LogUtils.log.error("----------设备重新启动了！！！！");
                    await this.loginProcess();
                }
            }
        }
        catch (e) {
            logUtils_1.LogUtils.log.error(e);
        }
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
            logUtils_1.LogUtils.log.info("====开始进行商户登录===");
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[2]');
        }
        catch (e) {
            logUtils_1.LogUtils.log.error(e);
        }
    }
    async loginProcess() {
        try {
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[2]');
            await this.usernameText.clearValue();
            await this.client.pause(1000);
            await this.usernameText.setValue(this.username);
            await this.client.pause(1000);
            await this.passwordText.setValue(this.password);
            await this.client.pause(1000);
            this.client.setImplicitTimeout(10000);
            await this.client.touchAction([{
                    action: 'tap',
                    x: 950,
                    y: 670
                }]);
            // 缓冲
            await this.client.$('//android.view.View[@content-desc="会员"]');
            console.log("============login finish=============" + new Date());
            logUtils_1.LogUtils.log.info("====商户登录成功===");
        }
        catch (e) {
            logUtils_1.LogUtils.log.error(e);
        }
    }
}
exports.Device_Elo = Device_Elo;
