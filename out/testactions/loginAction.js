"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device_Elo = exports.Device_A8 = void 0;
const LogUtils_1 = require("../utils/LogUtils");
const GlobalUtil_1 = require("../utils/GlobalUtil");
const deviceName_1 = require("../static/deviceName");
const deviceName = deviceName_1.DeviceName.getDeviceName();
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
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
        }
        catch (e) {
            LogUtils_1.LogUtils.log.error(e);
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
// export class LoginAction {
//
//     public static async Login(client: WebdriverIO.BrowserObject) {
//         await client.pause(15000);
//
//             try {
//                 LogUtils.log.info("====开始进行商户登录===");
//                 let usernameText, passwordText;  //
//                 let user:string|undefined, password:string|undefined;
//                 // 判断机器类型，分别获得不同控件实例和账号密码
//                 if (deviceName == 'a8') {
//                     usernameText =  await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
//                     passwordText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
//                     user = GlobalUtil.map.get("username");
//                     if (user == "" || user == undefined) {
//                         GlobalUtil.init();
//                     }
//                         LogUtils.log.info("===获取配置得到的商户账号：" + user);
//                         password = GlobalUtil.map.get("password");
//                         LogUtils.log.info("===获取配置得到的商户密码：" + password);
//                         console.log("===============Login ===========" + new Date());
//                 }
//                 else if (deviceName == 'elo') {
//                     usernameText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
//                     passwordText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[2]');
//                     user = "";
//                     password = "";
//                 }
//                 await usernameText.clearValue();
//                 await client.pause(1000);//
//                 await usernameText.setValue(user);
//                 await client.pause(1000);
//                 await passwordText.setValue(password);
//                 await client.pause(1000);
//                 //登录按钮
//                 if (deviceName == 'a8') {
//                     let loginBtn = await client.$('//android.widget.Button[@content-desc="登录"]');
//                     await client.pause(1000);
//                     await loginBtn.click();
//                 }
//
//                 try {
//                     let ele = await client.$('//android.view.View[@content-desc="正在登陆,请稍后...."]');
//                     LogUtils.log.info(await ele.getAttribute("content-desc"));
//                     let eleJudge:boolean = true;
//                     while (eleJudge){
//                         eleJudge = await client.isElementDisplayed(ele.elementId);
//                     }
//                 }catch (e){
//
//                 }finally {
//                     try {
//                        await client.pause(1000);
//
//                     }catch (e){
//                         LogUtils.log.info("--------由于网络原因--设备重新启动了！！！！")
//                         await LoginAction.Login();
//                     }
//                 }
//
//             }catch (e) {
//                 // await client.startActivity(Message.appPackageName,Message.appActivityName);
//                 // console.log("-----------------登陆程序出错--重新启动了！！！！");
//                 // await LoginAction.Login(client);
//                 await ScreenShotUtil.takeScreenShot(client, "登录失败");
//                 LogUtils.log.info("=====商户登录失败，账号密码配置出错或账户被停用。");
//             }
//
//             console.log("============login funish=============" + new Date());
//             LogUtils.log.info("====商户登录成功===");
//         }
//
//     }
