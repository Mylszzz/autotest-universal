
import {LogUtils} from "../utils/LogUtils";
import {GlobalUtil} from "../utils/GlobalUtil";
import {ScreenShotUtil} from "../utils/ScreenShotUtil";

export class LoginAction {

    public static async Login(client: WebdriverIO.BrowserObject) {
        await client.pause(15000);
        try {
            LogUtils.log.info("====开始进行商户登录===");
            // let crossStoreLogin:String = map.get("crossStoreLogin");
            // if (!crossStoreLogin) {
            let user: string = GlobalUtil.map.get("username");
            if (user == "" || user == undefined) {
                GlobalUtil.init();
            }
            LogUtils.log.info("===获取配置得到的商户账号：" + user);
            let password: string = GlobalUtil.map.get("password");
            LogUtils.log.info("===获取配置得到的商户密码：" + password);
            await this.sleep(2000)
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
            LogUtils.log.info("====商户登录成功===");
        }
        catch (e) {
            await ScreenShotUtil.takeScreenShot(client, "登录失败");
            LogUtils.log.info("=====商户登录失败，账号密码配置出错或账户被停用。");
        }
    }


    public static async sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, ms)
        });

    }
}

