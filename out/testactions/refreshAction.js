"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshAction_Elo = exports.RefreshAction_A8 = void 0;
const LogUtils_1 = require("../utils/LogUtils");
/**
 * 刷新店铺
 */
class RefreshAction {
    constructor(client, menuBtnXPath, refreshBtnXPath) {
        this.menuBtnXPath = '//android.widget.Button[@content-desc="menu"]'; // 菜单键的默认xPath
        this.refreshBtnXPath = '//android.widget.Button[@content-desc="刷新店铺"]'; // 刷新店铺键的默认xPath
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
        let menuBtn = await this.client.$(this.menuBtnXPath);
        await menuBtn.click();
        await this.client.pause(1000);
        let refreshBtn = await this.client.$(this.refreshBtnXPath);
        await refreshBtn.click();
        await this.client.pause(1000);
        await menuBtn.click();
        await this.client.pause(1000);
        LogUtils_1.LogUtils.log.info("=====刷新店铺符合预期====");
    }
}
/**
 * A8的菜单键和刷新店铺键的xPath与父类中默认的不同，需要修改
 */
const menuBtnXPath_A8 = '//android.widget.Button[@content-desc="menu "]';
const refreshBtnXPath_A8 = '//android.widget.Button[@content-desc="refresh circle 刷新店铺"]';
class RefreshAction_A8 extends RefreshAction {
    constructor(client, menuBtnXPath = menuBtnXPath_A8, refreshBtnXPath = refreshBtnXPath_A8) {
        super(client, menuBtnXPath, refreshBtnXPath);
    }
}
exports.RefreshAction_A8 = RefreshAction_A8;
/**
 * Elo可以直接继承
 */
class RefreshAction_Elo extends RefreshAction {
}
exports.RefreshAction_Elo = RefreshAction_Elo;
