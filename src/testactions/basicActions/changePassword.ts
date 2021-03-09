import * as wdio from 'webdriverio';
import {LogUtils} from "../../utils/logUtils";
import {GlobalUtil} from "../../utils/globalUtil";
import {runTimeSettings} from "../../static/settings";
import {ButtonXPaths_A8} from "../../static/buttonXPaths";


/**
 * 修改密码的抽象类
 * 需要实现2个抽象方法
 * 具体子类应该使用单例设计模式
 */
export abstract class ChangePassword {

    protected client: wdio.BrowserObject;
    public oldPasswordText: any;  // 旧密码输入框实例
    public newPasswordText: any; //新密码输入框
    public confirmPasswordText: any; //确认密码输入框
    public oldPassword: string | undefined;  // 旧密码
    public newPassword: string | undefined;  // 新密码
    protected constructor(client: wdio.BrowserObject) {
        this.client = client;
        this.oldPassword = GlobalUtil.getConfigMap().get("password");  // 从map中得到旧密码
        this.newPassword = GlobalUtil.getConfigMap().get("newPassword");  // 从map中得到新密码

    }


}

 /**
 * A8
 */
export class ChangePassword_A8 extends ChangePassword {
    private static instance: ChangePassword_A8;

    private constructor(client: wdio.BrowserObject) {
        super(client)
    }

    public static getInstance(client: wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new ChangePassword_A8(client);
        }
        return this.instance;
    }

    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            let menu = await this.client.$(ButtonXPaths_A8.MENU);
            await menu.click();
            await this.client.pause(2000);
            //  点击查询
            let chooseBackGood = await this.client.$('//android.widget.Button[@content-desc="lock 修改密码"]');
            await chooseBackGood.click();
            LogUtils.loginLog.info("****开始进行密码修改****");
            this.oldPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View/android.view.View[2]/android.widget.EditText');
            this.newPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View/android.view.View[4]/android.widget.EditText');
            this.confirmPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View/android.view.View[6]/android.widget.EditText');
        } catch (e) {
            LogUtils.loginLog.error(e);
        }
    }

    async changePasswordProcess() {
        try {
            await this.getDeviceConfig();
            await this.client.pause(runTimeSettings.generalPauseTime);
            await this.oldPasswordText.setValue(this.oldPassword);
            await this.client.pause(runTimeSettings.generalPauseTime);
            await this.newPasswordText.setValue(this.newPassword);
            await this.client.pause(runTimeSettings.generalPauseTime);
            await this.confirmPasswordText.setValue(this.newPassword);
            await this.client.pause(runTimeSettings.generalPauseTime);
            let loginBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await this.client.pause(runTimeSettings.generalPauseTime);
            await loginBtn.click();
        } catch (e) {

        } finally {
            try {
                let msg = await this.client.$('//android.view.View[@content-desc="修改成功"]');
                if (await msg.isDisplayed()) {
                    let determine = await this.client.$('//android.widget.Button[@content-desc="确定"]');
                    await determine.click();
                    let PasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
                    await PasswordText.setValue(<string>this.newPassword);
                    let loginBtn = await this.client.$('//android.widget.Button[@content-desc="登录"]');
                    await this.client.pause(runTimeSettings.generalPauseTime);
                    await loginBtn.click();
                } else {
                    await this.client.setImplicitTimeout(10000);  // 10秒Timeout
                }
            } catch (e) {

                    LogUtils.loginLog.error(e.toString())
                }

            }
        }


    }




/**
 * Elo
 */
export class ChangePassword_Elo extends ChangePassword {
    private static instance: ChangePassword_Elo;

    private constructor(client: wdio.BrowserObject) {
        super(client)
    }

    public static getInstance(client: wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new ChangePassword_Elo(client);
        }
        return this.instance;
    }

    async getDeviceConfig() {
        await this.client.pause(15000);
        try {
            LogUtils.loginLog.info("****开始进行密码修改****");
            this.oldPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View/android.view.View[2]/android.widget.EditText');
            this.newPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View/android.view.View[3]/android.widget.EditText');
            this.confirmPasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[1]/android.view.View/android.view.View[4]/android.widget.EditText');
        } catch (e) {
            LogUtils.loginLog.error(e);
        }
    }

    async changePasswordProcess() {
        try {
            await this.oldPasswordText.setValue(this.oldPassword);
            await this.newPasswordText.setValue(this.newPassword);
            await this.confirmPasswordText.setValue(this.newPassword);
            await this.client.pause(runTimeSettings.generalPauseTime);
            let loginBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await this.client.pause(runTimeSettings.generalPauseTime);
            await loginBtn.click();
        } catch (e) {

        } finally {
            try {
                let msg = await this.client.$('//android.view.View[@content-desc="修改成功"]');
                if (await msg.isDisplayed()) {
                    let determine = await this.client.$('//android.widget.Button[@content-desc="确定"]');
                    await determine.click();
                    let PasswordText = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.view.View[7]/android.widget.EditText');
                    await PasswordText.setValue(<string>this.newPassword);
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
                }
            } catch (e) {
                LogUtils.loginLog.error(e);
            }
        }

    }
}


