import * as wdio from 'webdriverio';
import {LogUtils} from "../utils/logUtils";
import {Position} from "../utils/position";
import {ButtonXPaths_A8, ButtonXPaths_Elo} from "../static/buttonXPaths";


/**
 * 用于退出的接口
 * 需要实现退出登录和退出程序两个不同的方法
 */
interface ILogout {
    client:wdio.BrowserObject;
    accountLogout():any;  // 退出登录
    sysLogout():any;  // 退出程序
}


/**
 * A8
 */
export class LogoutAction_A8 implements ILogout {
    client:wdio.BrowserObject;

    public constructor(client:wdio.BrowserObject) {
        this.client = client;
    }

    // 退出登录
    public async accountLogout() {
        let menuBtn=await this.client.$(ButtonXPaths_A8.MENU);
        await menuBtn.click();
        await this.client.pause(1000);
        let accountLogoutBtn=await this.client.$(ButtonXPaths_A8.ACCOUNTLOGOUT);
        await accountLogoutBtn.click();
        await this.client.pause(1000);
        let confirmBtn=await this.client.$(ButtonXPaths_A8.CONFIRM);
        await confirmBtn.click();
        LogUtils.log.info("=====账号登出--》手动登出符合预期==");
        await this.client.pause(5000);
    }

    public async sysLogout() {
        let menu=await this.client.$(ButtonXPaths_A8.MENU);
        await menu.click();
        await this.client.pause(1000);
        let sysLogout=await this.client.$(ButtonXPaths_A8.SYSTEMLOGOUT);
        await sysLogout.click();
        LogUtils.log.info("=====账号登出--》手动登出符合预期==");
        await this.client.pause(5000);
    }
}


/**
 * Elo
 */
export class LogoutAction_Elo implements ILogout {
    client:wdio.BrowserObject;

    public constructor(client:wdio.BrowserObject) {
        this.client = client;
    }

    // 退出登录
    public async accountLogout() {
        let contactBtn = await this.client.$(ButtonXPaths_Elo.CONTACT);
        await contactBtn.click();
        await this.client.pause(500);
        // 以坐标形式点击退出账号按钮
        await this.client.touchAction([
            {
                action: 'tap',
                x: Position.exit_account[0].x,
                y: Position.exit_account[0].y,
            },
        ]);
        await this.client.touchAction([
            {
                action: 'tap',
                x: Position.exit_account[1].x,
                y: Position.exit_account[1].y,
            },
        ]);
        try {
            await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            LogUtils.log.info("=====账号登出--》手动登出符合预期==");
            await this.client.pause(5000);
        }catch (e) {
            LogUtils.log.info("=====账号登出--》手动登出不符合预期==");
        }
    }

    // 退出系统
    public async sysLogout() {
        let menu=await this.client.$(ButtonXPaths_Elo.MENU);
        await menu.click();
        await this.client.pause(1000);
        let sysLogout=await this.client.$(ButtonXPaths_Elo.SYSTEMLOGOUT);
        await sysLogout.click();
        await this.client.pause(5000);
    }

}
