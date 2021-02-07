import * as wdio from 'webdriverio';
import {LogUtils} from "../../utils/LogUtils";
import {GlobalUtil} from "../../utils/GlobalUtil";
import {ScreenShotUtil} from "../../utils/ScreenShotUtil";


/**
 * device 的抽象类
 * 不同的机器继承次方法需要readUtils.ts中更新机器的配置信息
 * 需要实现2个抽象方法
 */
export abstract class Device {
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
            // this.usernameText = await this.client.$('//android.widget.EditText[@content-desc="tht202011190002807"]');
            // this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[7]/android.widget.EditText');
        } catch (e) {
            LogUtils.log.error(e);
        }
    }

    async loginProcess() {
        try {
            await this.usernameText.clearValue();  //
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
                LogUtils.log.info(await ele.getAttribute("content-desc"));
                let eleJudge:boolean = true;
                while (eleJudge){
                    eleJudge = await this.client.isElementDisplayed(ele.elementId);
                }
            } catch (e) {

            } finally {
                try {
                    await this.client.pause(1000);
                    await this.client.$('//android.view.View[@content-desc="货号:' + GlobalUtil.map.get("storeNumber") + '"]');
                    console.log("============login finish=============" + new Date());
                    LogUtils.log.info("====商户登录成功===");
                } catch (e) {
                    // 重新启动程序
                    await this.client.startActivity(this.client.getCurrentPackage, this.client.getCurrentActivity);
                    LogUtils.log.error("--------由于网络原因--设备重新启动了！！！！");
                    await this.loginProcess();
                }
            }

        } catch (e) {
            LogUtils.log.error(e);
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

            console.log("============login finish=============" + new Date());
            LogUtils.log.info("====商户登录成功===");
        } catch (e) {
            LogUtils.log.error(e);
        }
    }
}
