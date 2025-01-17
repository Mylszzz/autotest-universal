"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshAction_Elo = exports.RefreshAction_A8 = void 0;
const logUtils_1 = require("../../utils/logUtils");
const buttonXPaths_1 = require("../../static/buttonXPaths");
const settings_1 = require("../../static/settings");
/**
 * 刷新店铺的基类
 * 继承时: 参考RefreshAction_A8{}，子类需要使用单例模式，通过super()传入按键xpath
 */
class RefreshAction {
    /*
    传入参数：client: webdriverio.BrowserObject, menuBtnXPath:菜单键的xPath, refreshBtnXPath:刷新店铺键的xPath
     */
    constructor(client, menuBtnXPath, refreshBtnXPath) {
        this.menuBtnXPath = buttonXPaths_1.ButtonXPaths_Elo.MENU; // 菜单键的默认xPath
        this.refreshBtnXPath = buttonXPaths_1.ButtonXPaths_Elo.REFRESH; // 刷新店铺键的默认xPath
        this.client = client;
        if (menuBtnXPath != undefined) { //如果传入参数，则修改menu button的xPath
            this.menuBtnXPath = menuBtnXPath;
        }
        if (refreshBtnXPath != undefined) { //如果传入参数，则修改refresh button的xPath
            this.refreshBtnXPath = refreshBtnXPath;
        }
    }
    // 刷新店铺的流程
    async refresh() {
        logUtils_1.LogUtils.log.info("=====开始执行刷新店铺====");
        await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
        let menuBtn = await this.client.$(this.menuBtnXPath);
        await menuBtn.click();
        await this.client.pause(settings_1.runTimeSettings.generalPauseTime);
        let refreshBtn = await this.client.$(this.refreshBtnXPath);
        await refreshBtn.click();
        await this.client.pause(5000); // 刷新店铺要等比较久
        logUtils_1.LogUtils.log.info("=====刷新店铺符合预期====");
    }
}
/**
 * A8的菜单键和刷新店铺键的xPath与父类中默认的不同，需要修改
 * 单例模式
 */
const menuBtnXPath_A8 = buttonXPaths_1.ButtonXPaths_A8.MENU;
const refreshBtnXPath_A8 = buttonXPaths_1.ButtonXPaths_A8.REFRESH;
class RefreshAction_A8 extends RefreshAction {
    constructor(client, menuBtnXPath = menuBtnXPath_A8, refreshBtnXPath = refreshBtnXPath_A8) {
        super(client, menuBtnXPath, refreshBtnXPath);
    }
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new RefreshAction_A8(client);
        }
        return this.instance;
    }
}
exports.RefreshAction_A8 = RefreshAction_A8;
/**
 * Elo可以直接继承
 */
class RefreshAction_Elo extends RefreshAction {
    static getInstance(client) {
        if (null == this.instance) {
            this.instance = new RefreshAction_Elo(client);
        }
        return this.instance;
    }
}
exports.RefreshAction_Elo = RefreshAction_Elo;
