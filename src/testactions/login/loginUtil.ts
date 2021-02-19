import * as wdio from 'webdriverio';
import {LogUtils} from "../../utils/logUtils";
import {GlobalUtil} from "../../utils/globalUtil";
import {BasicException} from "../../utils/exceptions";


/**
 * device 的抽象类
 * 不同的机器继承次方法需要readUtils.ts中更新机器的配置信息
 * 需要实现2个抽象方法
 */
export abstract class Device {
    public client: wdio.BrowserObject;
    public usernameText: any;  // 用户名输入框实例
    public passwordText: any;
    public username: string | undefined;  // 用户名
    public password: string | undefined;  // 密码
    protected constructor(client: wdio.BrowserObject) {
        this.client = client;
        this.username = GlobalUtil.getConfigMap().get("username");  // 从map中得到用户名
        // if (this.username == "" || this.username == undefined) {
        //     GlobalUtil.init();
        // }
        this.password = GlobalUtil.getConfigMap().get("password");  // 从map中得到密码

    }

    abstract getDeviceConfig(): any;  // 根据不同的机器型号得到控件实例和账号密码

    abstract loginProcess(): any;  // 执行登录操作

    abstract reboot(): any;  // 重启程序
}


export class Device_A8 extends Device {
    constructor(client: wdio.BrowserObject) {
        super(client)
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
            await this.usernameText.clearValue();  //
            await this.client.pause(1000);
            await this.usernameText.setValue(this.username);
            await this.client.pause(1000);
            await this.passwordText.setValue(this.password);
            await this.client.pause(1000);
            let loginBtn = await this.client.$('//android.widget.Button[@content-desc="登录"]');
            await this.client.pause(1000);
            await loginBtn.click();
        } catch (e) {

        } finally {
            try {
                console.log("1:"+ new Date());
                let msg = await this.client.$('//android.view.View[@content-desc="货号:' +
                    GlobalUtil.getConfigMap().get("storeNumber") + '"]');
                console.log("2:"+ new Date());
                await this.client.setImplicitTimeout(100);  // 15秒Timeout
                if (await msg.isDisplayed()) {
                    await this.client.setImplicitTimeout(15000);  // 15秒Timeout
                    console.log("============login finish=============" + new Date());
                    LogUtils.log.info("====商户登录成功===");
                } else {
                    await this.client.setImplicitTimeout(15000);  // 15秒Timeout
                    console.log("3:"+ new Date());
                    throw new BasicException();
                }
            } catch (e) {
                if (e instanceof BasicException) {
                    console.error(e);
                    await this.reboot();
                }

            }
        }


    }

    async reboot() {
        await this.client.startActivity('net.ttoto.grandjoy.hbirdpos', 'net.ttoto.grandjoy.hbirdpos.MainActivity');
        LogUtils.log.error("----------设备重新启动了！！！！");
        await this.loginProcess();
    }
}

export class Device_Elo extends Device {
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
                    action: 'tap',
                    x: 950,
                    y: 670
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

    async reboot() {

    }
}
