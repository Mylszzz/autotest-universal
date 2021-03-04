import * as wdio from 'webdriverio';
import {LogUtils} from "../../utils/logUtils";
import {GlobalUtil} from "../../utils/globalUtil";
import {LoginException} from "../../utils/exceptions";
import {runTimeSettings} from "../../static/settings";


/**
 * 登录的抽象类
 * 继承此方法还需要考虑在globalUtils.ts中更新机器的配置信息
 * 需要实现3个抽象方法
 * 具体子类应该使用单例设计模式
 */
export abstract class Login {
    protected client: wdio.BrowserObject;
    public usernameText: any;  // 用户名输入框实例
    public passwordText: any;
    public username: string | undefined;  // 用户名
    public password: string | undefined;  // 密码
    protected constructor(client: wdio.BrowserObject) {
        this.client = client;
        this.username = GlobalUtil.getConfigMap().get("username");  // 从map中得到用户名
        this.password = GlobalUtil.getConfigMap().get("password");  // 从map中得到密码

    }

    abstract getDeviceConfig(): any;  // 根据不同的机器型号得到控件实例和账号密码

    abstract loginProcess(): any;  // 执行登录操作

    abstract reboot(): any;  // 重启程序
}


/**
 * A8
 */
export class Device_A8 extends Login {
    private static instance: Device_A8;

    private constructor(client: wdio.BrowserObject) {
        super(client)
    }

    public static getInstance(client: wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new Device_A8(client);
        }
        return this.instance;
    }

    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            LogUtils.loginLog.info("****开始进行商户登录****");
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[5]/android.widget.EditText');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
        } catch (e) {
            LogUtils.loginLog.error(e);
        }
    }

    async loginProcess() {
        try {
            await this.usernameText.clearValue();  //
            await this.client.pause(runTimeSettings.generalPauseTime);
            await this.usernameText.setValue(this.username);
            await this.client.pause(runTimeSettings.generalPauseTime);
            await this.passwordText.setValue(this.password);
            await this.client.pause(runTimeSettings.generalPauseTime);
            let loginBtn = await this.client.$('//android.widget.Button[@content-desc="登录"]');
            await this.client.pause(runTimeSettings.generalPauseTime);
            await loginBtn.click();
        } catch (e) {

        } finally {
            try {
                let msg = await this.client.$('//android.view.View[@content-desc="货号:' +
                    GlobalUtil.getConfigMap().get("storeNumber") + '"]');
                await this.client.setImplicitTimeout(100);  // 0.1秒Timeout
                if (await msg.isDisplayed()) {
                    await this.client.setImplicitTimeout(10000);  // 10秒Timeout
                    LogUtils.loginLog.info("*********商户登录成功*********" + new Date());
                } else {
                    await this.client.setImplicitTimeout(10000);  // 10秒Timeout
                    throw new LoginException('L0001', '登录失败！');
                }
            } catch (e) {
                if (e instanceof LoginException) {
                    LogUtils.loginLog.error(e.toString());
                    await this.reboot();
                } else {
                    LogUtils.loginLog.error(e.toString())
                }

            }
        }


    }

    async reboot() {
        await this.client.startActivity('net.ttoto.grandjoy.hbirdpos', 'net.ttoto.grandjoy.hbirdpos.MainActivity');
        LogUtils.loginLog.warn("******设备重新启动了！******");
        await this.loginProcess();
    }
}


/**
 * Elo
 */
export class Device_Elo extends Login {
    private static instance: Device_Elo;

    private constructor(client: wdio.BrowserObject) {
        super(client)
    }

    public static getInstance(client: wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new Device_Elo(client);
        }
        return this.instance;
    }

    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            LogUtils.loginLog.info("*********开始进行商户登录*********");
            this.usernameText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            this.passwordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[2]');
        } catch (e) {
            LogUtils.loginLog.error(e);
        }
    }

    async loginProcess() {
        try {
            await this.usernameText.clearValue();
            await this.client.pause(runTimeSettings.generalPauseTime);
            await this.usernameText.setValue(this.username);
            await this.client.pause(runTimeSettings.generalPauseTime);
            await this.passwordText.setValue(this.password);
            await this.client.pause(runTimeSettings.generalPauseTime);
            // 点击登录按钮
            await this.client.touchAction([{
                    action: 'tap',
                    x: 950,
                    y: 670
                }]
            );
            // 缓冲
            await this.client.$('//android.view.View[@content-desc="会员"]');
            LogUtils.loginLog.info("*********商户登录成功*********");
        } catch (e) {
            LogUtils.loginLog.error(e);
        }
    }

    async reboot() {
        //TODO

    }
}
