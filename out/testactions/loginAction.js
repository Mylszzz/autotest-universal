"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAction = void 0;
const LogUtils_1 = require("../utils/LogUtils");
const GlobalUtil_1 = require("../utils/GlobalUtil");
const deviceName = "a8"; // TODO:需要定义全项目公用变量
class LoginAction {
    static async Login(client) {
        await client.pause(15000);
        try {
            LogUtils_1.LogUtils.log.info("====开始进行商户登录===");
            // let crossStoreLogin:String = map.get("crossStoreLogin");
            // if (!crossStoreLogin) {
            let user = GlobalUtil_1.GlobalUtil.map.get("username");
            if (user == "" || user == undefined) {
                GlobalUtil_1.GlobalUtil.init();
                try {
                    LogUtils_1.LogUtils.log.info("====开始进行商户登录===");
                    let usernameText, passwordText; //
                    let username, password;
                    // 判断机器类型，分别获得不同控件实例和账号密码
                    if (deviceName == 'a8') {
                        usernameText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
                        passwordText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
                        username = "ht202011190002802"; // TODO
                        password = "Pp88888888"; // TODO
                    }
                    else if (deviceName == 'elo') {
                        usernameText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
                        passwordText = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[2]');
                        username = "";
                        password = "";
                    }
                    await usernameText.clearValue();
                    await client.pause(1000); //
                    await usernameText.setValue(username);
                    await client.pause(1000);
                    await passwordText.setValue(password);
                    await client.pause(1000);
                    //登录按钮
                    if (deviceName == 'a8') {
                        let loginBtn = await client.$('//android.widget.Button[@content-desc="登录"]');
                        await client.pause(1000);
                        await loginBtn.click();
                    }
                    try {
                        let ele = await client.$('//android.view.View[@content-desc="正在登陆,请稍后...."]');
                        LogUtils_1.LogUtils.log.info(await ele.getAttribute("content-desc"));
                        let eleJudge = true;
                        while (eleJudge) {
                            eleJudge = await client.isElementDisplayed(ele.elementId);
                        }
                    }
                    catch (e) {
                    }
                    finally {
                        try {
                            await client.pause(1000);
                            // let name = await client.$('//android.view.View[@content-desc="货号:' + Message.storeNumber + '"]');
                            // if (!await client.isElementDisplayed(name.elementId)){
                            //     throw new Error('错误');
                            // }
                            //  LogUtils.log.info('登陆成功---');
                        }
                        catch (e) {
                            // await client.startActivity(Message.appPackageName,Message.appActivityName);
                            // LogUtils.log.error("--------由于网络原因--设备重新启动了！！！！")
                            // await LoginAction.Login(client);
                        }
                    }
                }
                catch (e) {
                    // await client.startActivity(Message.appPackageName,Message.appActivityName);
                    // console.log("-----------------登陆程序出错--重新启动了！！！！");
                    // await LoginAction.Login(client);
                }
                LogUtils_1.LogUtils.log.info("===获取配置得到的商户账号：" + user);
                let password = GlobalUtil_1.GlobalUtil.map.get("password");
                LogUtils_1.LogUtils.log.info("===获取配置得到的商户密码：" + password);
                await this.sleep(2000);
                console.log("===============Login ===========" + new Date());
                let username = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
                await username.clearValue();
                await username.setValue(user);
                let pwd = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
                await pwd.clearValue();
                await pwd.setValue(password);
                // await TouchAction.touchAction(950, 670);绝对位置
                //登录按钮
                let loginBtn = await client.$('//android.widget.Button[@content-desc="登录"]');
                await client.pause(1000);
                await loginBtn.click();
                console.log("============login funish=============" + new Date());
                LogUtils_1.LogUtils.log.info("====商户登录成功===");
            }
            try {
            }
            catch (e) {
                await ScreenShotUtil.takeScreenShot(client, "登录失败");
                LogUtils_1.LogUtils.log.info("=====商户登录失败，账号密码配置出错或账户被停用。");
            }
        }
        finally {
        }
    }
    static async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, ms);
        });
    }
}
exports.LoginAction = LoginAction;
