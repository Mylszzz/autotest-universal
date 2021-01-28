import * as wdio from 'webdriverio';
import {LogUtils} from "../utils/LogUtils";
 import {GlobalUtil} from "../utils/GlobalUtil";
import {ScreenShotUtil} from "../utils/ScreenShotUtil";
import {DeviceName} from "../static/deviceName";

const deviceName:string = DeviceName.getDeviceName();


abstract class Device {
    public client: wdio.BrowserObject;
    public usernameText:any;  // 用户名输入框实例
    public passwordText:any;
    public username:string|undefined;  // 用户名
    public password:string|undefined;  // 密码
    constructor(client: wdio.BrowserObject) {
        this.client = client;
        this.username =  GlobalUtil.map.get("username");  // 从map中得到用户名
        if (this.username == "" || this.username == undefined) {
            GlobalUtil.init();
        }
        this.password = GlobalUtil.map.get("password");  // 从map中得到用户名

    }

    abstract getDeviceConfig():any;  // 根据不同的机器型号得到控件实例和账号密码

    abstract loginProcess():any;  // 执行登录操作
}


export class Device_A8 extends Device {
    constructor(clinet: wdio.BrowserObject) {
        super(clinet)
    }

    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            LogUtils.log.info("====开始进行商户登录===");
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
        } catch (e) {
            LogUtils.log.error(e);
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
            LogUtils.log.info(await ele.getAttribute("content-desc"));
            let eleJudge:boolean = true;
            while (eleJudge){
                eleJudge = await this.client.isElementDisplayed(ele.elementId);
            }
            console.log("============login funish=============" + new Date());
            LogUtils.log.info("====商户登录成功===");
        } catch (e) {
            LogUtils.log.error(e);
        } finally {
            try {
                await this.client.pause(1000);
                // let name = await this.client.$('//android.view.View[@content-desc="货号:' + Message.storeNumber + '"]');
                // if (!await this.client.isElementDisplayed(name.elementId)){
                //     throw new Error('错误');
                // }
                 LogUtils.log.info('登陆成功---');

            }catch (e){
                // await this.client.startActivity(Message.appPackageName,Message.appActivityName);
                // LogUtils.log.error("--------由于网络原因--设备重新启动了！！！！")
                // await this.loginProcess();
            }
        }
    }
}

export class Device_Elo extends Device{
    constructor(client: wdio.BrowserObject) {
        super(client)
    }

    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            LogUtils.log.info("====开始进行商户登录===");
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[2]');
        } catch (e) {
            LogUtils.log.error(e);
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
                    action:'tap',
                    x:950,
                    y:670
                }]
            );
            // 缓冲
            await this.client.$('//android.view.View[@content-desc="会员"]');

            console.log("============login funish=============" + new Date());
            LogUtils.log.info("====商户登录成功===");
        } catch (e) {
            LogUtils.log.error(e);
        }
    }
}
