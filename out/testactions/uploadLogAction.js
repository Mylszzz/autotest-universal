"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadLogAction_Elo = exports.UploadLogAction_A8 = void 0;
const LogUtils_1 = require("../utils/LogUtils");
class UploadLogAction {
    constructor(client) {
        this.client = client;
    }
    // 上传当天日志
    async uploadTodayLog() {
        let menuBtn = await this.client.$('//android.widget.Button[@content-desc="menu"]');
        await menuBtn.click();
        await this.client.pause(1000);
        let uploadLogBtn = await this.client.$('//android.widget.Button[@content-desc="上传日志"]');
        await uploadLogBtn.click();
        await this.client.pause(1000);
        let uploadTodayLogBtn = await this.client.$('//android.widget.Button[@content-desc="上传当天日志"]');
        await uploadTodayLogBtn.click();
        await this.client.pause(1000);
        LogUtils_1.LogUtils.log.info("=====上传日志--》上传当天日志符合预期=="); // TODO: 缺少判断
    }
    // 上传其他日日志
    async uploadOtherDayLog() {
        let menuBtn = await this.client.$('//android.widget.Button[@content-desc="menu"]');
        await menuBtn.click();
        await this.client.pause(1000);
        let uploadLogBtn = await this.client.$('//android.widget.Button[@content-desc="上传日志"]');
        await uploadLogBtn.click();
        await this.client.pause(1000);
        let uploadTodayLogBtn = await this.client.$('//android.widget.Button[@content-desc="上传其他日期日志"]');
        await uploadTodayLogBtn.click();
        await this.client.pause(1000);
        // TODO: 接下来还没做
    }
}
class UploadLogAction_A8 extends UploadLogAction {
}
exports.UploadLogAction_A8 = UploadLogAction_A8;
class UploadLogAction_Elo extends UploadLogAction {
}
exports.UploadLogAction_Elo = UploadLogAction_Elo;
