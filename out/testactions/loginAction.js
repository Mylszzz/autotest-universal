"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAction = void 0;
const LogUtils_1 = require("../utils/LogUtils");
const GlobalUtil_1 = require("../utils/GlobalUtil");
const ScreenShotUtil_1 = require("../utils/ScreenShotUtil");
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
        catch (e) {
            await ScreenShotUtil_1.ScreenShotUtil.takeScreenShot(client, "登录失败");
            LogUtils_1.LogUtils.log.info("=====商户登录失败，账号密码配置出错或账户被停用。");
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
