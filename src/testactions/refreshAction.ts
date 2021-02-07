import {LogUtils} from "../utils/LogUtils";
import * as wdio from "webdriverio";

/**
 * 刷新店铺
 */
class RefreshAction {
    client:wdio.BrowserObject;
    menuBtnXPath:string = '//android.widget.Button[@content-desc="menu"]';  // 菜单键的默认xPath
    refreshBtnXPath:string = '//android.widget.Button[@content-desc="刷新店铺"]';  // 刷新店铺键的默认xPath
    /*
    传入参数：client: webdriverio.BrowserObject, menuBtnXPath:菜单键的xPath, refreshBtnXPath:刷新店铺键的xPath
     */
    public constructor (client:wdio.BrowserObject, menuBtnXPath?:string, refreshBtnXPath?:string) {
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
        let menuBtn = await this.client.$(this.menuBtnXPath);
        await menuBtn.click();
        await this.client.pause(1000);
        let refreshBtn = await this.client.$(this.refreshBtnXPath);
        await refreshBtn.click();
        await this.client.pause(1000);
        await menuBtn.click();
        await this.client.pause(1000);
        LogUtils.log.info("=====刷新店铺符合预期====");
    }
}

/**
 * A8的菜单键和刷新店铺键的xPath与父类中默认的不同，需要修改
 */
const menuBtnXPath_A8 = '//android.widget.Button[@content-desc="menu "]';
const refreshBtnXPath_A8 = '//android.widget.Button[@content-desc="refresh circle 刷新店铺"]';
export class RefreshAction_A8 extends RefreshAction {
    public constructor (client:wdio.BrowserObject, menuBtnXPath = menuBtnXPath_A8,
                        refreshBtnXPath = refreshBtnXPath_A8) {
        super(client, menuBtnXPath, refreshBtnXPath);
    }
}

/**
 * Elo可以直接继承
 */
export class RefreshAction_Elo extends RefreshAction {}
