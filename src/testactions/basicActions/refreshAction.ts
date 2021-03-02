import {LogUtils} from "../../utils/logUtils";
import * as wdio from "webdriverio";
import {ButtonXPaths_A8, ButtonXPaths_Elo} from "../../static/buttonXPaths";

/**
 * 刷新店铺的基类
 * 继承时: 参考RefreshAction_A8{}，子类需要使用单例模式，通过super()传入按键xpath
 */
class RefreshAction {
    client: wdio.BrowserObject;
    menuBtnXPath: string = ButtonXPaths_Elo.MENU;  // 菜单键的默认xPath
    refreshBtnXPath: string = ButtonXPaths_Elo.REFRESH;  // 刷新店铺键的默认xPath
    /*
    传入参数：client: webdriverio.BrowserObject, menuBtnXPath:菜单键的xPath, refreshBtnXPath:刷新店铺键的xPath
     */
    protected constructor(client: wdio.BrowserObject, menuBtnXPath?: string, refreshBtnXPath?: string) {
        this.client = client;
        if (menuBtnXPath != undefined) {  //如果传入参数，则修改menu button的xPath
            this.menuBtnXPath = menuBtnXPath;
        }
        if (refreshBtnXPath != undefined) {  //如果传入参数，则修改refresh button的xPath
            this.refreshBtnXPath = refreshBtnXPath;
        }
    }

    // 刷新店铺的流程
    public async refresh() {
        LogUtils.log.info("=====开始执行刷新店铺====");
        await this.client.pause(1000);
        let menuBtn = await this.client.$(this.menuBtnXPath);
        await menuBtn.click();
        await this.client.pause(1000);
        let refreshBtn = await this.client.$(this.refreshBtnXPath);
        await refreshBtn.click();
        await this.client.pause(5000);  // 刷新店铺要等比较久
        LogUtils.log.info("=====刷新店铺符合预期====");
    }
}

/**
 * A8的菜单键和刷新店铺键的xPath与父类中默认的不同，需要修改
 * 单例模式
 */
const menuBtnXPath_A8 = ButtonXPaths_A8.MENU;
const refreshBtnXPath_A8 = ButtonXPaths_A8.REFRESH;

export class RefreshAction_A8 extends RefreshAction {
    private static instance: RefreshAction_A8;

    private constructor(client: wdio.BrowserObject, menuBtnXPath = menuBtnXPath_A8,
                        refreshBtnXPath = refreshBtnXPath_A8) {
        super(client, menuBtnXPath, refreshBtnXPath);
    }

    public static getInstance(client: wdio.BrowserObject): RefreshAction {
        if (null == this.instance) {
            this.instance = new RefreshAction_A8(client);
        }
        return this.instance;
    }
}

/**
 * Elo可以直接继承
 */
export class RefreshAction_Elo extends RefreshAction {
    private static instance: RefreshAction_Elo;

    public static getInstance(client: wdio.BrowserObject): RefreshAction {
        if (null == this.instance) {
            this.instance = new RefreshAction_Elo(client);
        }
        return this.instance;
    }
}
