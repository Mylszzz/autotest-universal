import {LogUtils} from "../utils/LogUtils";
import * as wdio from "webdriverio";

class RefreshAction {
    client:wdio.BrowserObject;
    constructor (client:wdio.BrowserObject) {
        this.client = client;
    }

    public async refresh() {
        let menuBtn = await this.client.$('//android.widget.Button[@content-desc="menu"]');
        await menuBtn.click();
        await this.client.pause(1000);
        let refreshBtn = await this.client.$('//android.widget.Button[@content-desc="刷新店铺"]');
        await refreshBtn.click();
        await this.client.pause(1000);
        LogUtils.log.info("=====刷新店铺符====");
    }
}

export class RefreshAction_A8 extends RefreshAction {}

export class RefreshAction_Elo extends RefreshAction {}
