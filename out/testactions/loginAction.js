"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device_Elo = exports.Device_A8 = void 0;
const LogUtils_1 = require("../utils/LogUtils");
const GlobalUtil_1 = require("../utils/GlobalUtil");
const deviceName_1 = require("../static/deviceName");
const deviceName = deviceName_1.DeviceName.getDeviceName();
/**
 * device 的抽象类
 * 不同的机器继承次方法需要readUtils.ts中更新机器的配置信息
 * 需要实现2个抽象方法
 */
class Device {
    constructor(client) {
        this.client = client;
        this.username = GlobalUtil_1.GlobalUtil.map.get("username"); // 从map中得到用户名
        if (this.username == "" || this.username == undefined) {
            GlobalUtil_1.GlobalUtil.init();
        }
        this.password = GlobalUtil_1.GlobalUtil.map.get("password"); // 从map中得到用户名
    }
}
class Device_A8 extends Device {
    constructor(clinet) {
        super(clinet);
    }
    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            LogUtils_1.LogUtils.log.info("====开始进行商户登录===");
            // this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
            // this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
            this.usernameText = await this.client.$('//android.widget.EditText[@content-desc="tht202011190002807"]');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[7]/android.widget.EditText');
        }
        catch (e) {
            LogUtils_1.LogUtils.log.error(e);
        }
    }
    async loginProcess() {
        try {
            // await this.usernameText.clearValue();
            // await this.client.pause(1000);
            // await this.usernameText.setValue(this.username);
            // await this.client.pause(1000);
            await this.passwordText.setValue(this.password);
            await this.client.pause(1000);
            let loginBtn = await this.client.$('//android.widget.Button[@content-desc="登录"]');
            await this.client.pause(1000);
            await loginBtn.click();
            let ele = await this.client.$('//android.view.View[@content-desc="正在登陆,请稍后...."]');
            LogUtils_1.LogUtils.log.info(await ele.getAttribute("content-desc"));
            let eleJudge = true;
            while (eleJudge) {
                eleJudge = await this.client.isElementDisplayed(ele.elementId);
            }
            console.log("============login funish=============" + new Date());
            LogUtils_1.LogUtils.log.info("====商户登录成功===");
        }
        catch (e) {
            LogUtils_1.LogUtils.log.error(e);
        }
        finally {
            try {
                await this.client.pause(1000);
                // let name = await this.client.$('//android.view.View[@content-desc="货号:' + Message.storeNumber + '"]');
                // if (!await this.client.isElementDisplayed(name.elementId)){
                //     throw new Error('错误');
                // }
                LogUtils_1.LogUtils.log.info('登陆成功---');
            }
            catch (e) {
                // await this.client.startActivity(Message.appPackageName,Message.appActivityName);
                // LogUtils.log.error("--------由于网络原因--设备重新启动了！！！！")
                // await this.loginProcess();
            }
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
            LogUtils_1.LogUtils.log.info("====开始进行商户登录===");
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[2]');
        }
        catch (e) {
            LogUtils_1.LogUtils.log.error(e);
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
            console.log("============login funish=============" + new Date());
            LogUtils_1.LogUtils.log.info("====商户登录成功===");
        }
        catch (e) {
            LogUtils_1.LogUtils.log.error(e);
        }
    }
}
exports.Device_Elo = Device_Elo;
