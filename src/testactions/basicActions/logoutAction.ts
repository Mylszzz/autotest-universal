import * as wdio from 'webdriverio';
import {LogUtils} from "../../utils/logUtils";
import {Position} from "../../utils/position";
import {InputCoordinates_Elo} from "../../static/inputCoordinates";
import {ButtonXPaths_A8, ButtonXPaths_Elo} from "../../static/buttonXPaths";


/**
 * 用于退出的接口
 * 需要实现退出登录和退出程序两个不同的方法
 */
interface ILogout {
    client: wdio.BrowserObject;

    accountLogout(): any;  // 退出登录
    sysLogout(): any;  // 退出程序
}


/**
 * A8的退出脚本具体类
 * 单例模式
 */
export class LogoutAction_A8 implements ILogout {
    client: wdio.BrowserObject;
    private static instance: LogoutAction_A8;

    private constructor(client: wdio.BrowserObject) {
        this.client = client;
    }

    /**
     * 获得LogoutAction_A8的唯一实例
     * @param {WebdriverIO.BrowserObject} client
     * @returns {LogoutAction_A8}
     */
    public static getInstance(client: wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new LogoutAction_A8(client);
        }
        return this.instance;
    }

    // 退出登录
    public async accountLogout() {
        let menuBtn = await this.client.$(ButtonXPaths_A8.MENU);
        await menuBtn.click();
        await this.client.pause(1000);
        let accountLogoutBtn = await this.client.$(ButtonXPaths_A8.ACCOUNTLOGOUT);
        await accountLogoutBtn.click();
        await this.client.pause(1000);
        let confirmBtn = await this.client.$(ButtonXPaths_A8.CONFIRM);
        await confirmBtn.click();
        LogUtils.log.info("******账号登出--》手动登出符合预期******");
        await this.client.pause(5000);
    }

    // 退出系统
    public async sysLogout() {
        let menu = await this.client.$(ButtonXPaths_A8.MENU);
        await menu.click();
        await this.client.pause(1000);
        let sysLogout = await this.client.$(ButtonXPaths_A8.SYSTEMLOGOUT);
        await sysLogout.click();
        LogUtils.log.info("******账号登出--》手动登出符合预期******");
        await this.client.pause(5000);
    }
}


/**
 * Elo
 */
export class LogoutAction_Elo implements ILogout {
    client: wdio.BrowserObject;
    private static instance: LogoutAction_Elo;

    private constructor(client: wdio.BrowserObject) {
        this.client = client;
    }

    /**
     * 获得LogoutAction_A8的唯一实例
     * @param {WebdriverIO.BrowserObject} client
     * @returns {LogoutAction_A8}
     */
    public static getInstance(client: wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new LogoutAction_Elo(client);
        }
        return this.instance;
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
                x: InputCoordinates_Elo.getExitAccountCoor()[0].x,
                y: InputCoordinates_Elo.getExitAccountCoor()[0].y,
            },
        ]);
        await this.client.touchAction([
            {
                action: 'tap',
                x: InputCoordinates_Elo.getExitAccountCoor()[1].x,
                y: InputCoordinates_Elo.getExitAccountCoor()[1].y,
            },
        ]);
        try {
            await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View/android.widget.EditText[1]');
            LogUtils.log.info("******账号登出--》手动登出符合预期******");
            await this.client.pause(5000);
        } catch (e) {
            LogUtils.log.info("******账号登出--》手动登出不符合预期******");
        }
    }

    // 退出系统
    public async sysLogout() {
        let menuBtn = await this.client.$(ButtonXPaths_Elo.MENU);
        await menuBtn.click();
        await this.client.pause(1000);
        let sysLogoutBtn = await this.client.$(ButtonXPaths_Elo.SYSTEMLOGOUT);
        await sysLogoutBtn.click();
        await this.client.pause(5000);
    }

}
