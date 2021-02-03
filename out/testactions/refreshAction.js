"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshAction_Elo = exports.RefreshAction_A8 = void 0;
const LogUtils_1 = require("../utils/LogUtils");
class RefreshAction {
    constructor(client) {
        this.client = client;
    }
    async refresh() {
        let menuBtn = await this.client.$('//android.widget.Button[@content-desc="menu"]');
        await menuBtn.click();
        await this.client.pause(1000);
        let refreshBtn = await this.client.$('//android.widget.Button[@content-desc="刷新店铺"]');
        await refreshBtn.click();
        await this.client.pause(1000);
        LogUtils_1.LogUtils.log.info("=====刷新店铺符====");
    }
}
class RefreshAction_A8 extends RefreshAction {
}
exports.RefreshAction_A8 = RefreshAction_A8;
class RefreshAction_Elo extends RefreshAction {
}
exports.RefreshAction_Elo = RefreshAction_Elo;
