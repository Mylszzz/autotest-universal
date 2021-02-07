"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadLogAction_Elo = exports.UploadLogAction_A8 = void 0;
const LogUtils_1 = require("../utils/LogUtils");
/**
 * 上传日志
 * 分为上传当日和上传其他日期日志
 */
class UploadLogAction {
    constructor(client, xPaths) {
        this.client = client;
        this.menuBtnXPath = xPaths.menuBtnXPath;
        this.uploadLogBtnXPath = xPaths.uploadLogBtnXPath;
        this.uploadTodayLogBtnXPath = xPaths.uploadTodayLogBtnXPath;
        this.uploadOtherDayLogBtnXPath = xPaths.uploadOtherDayLogBtnXPath;
    }
    // 上传当天日志
    async uploadTodayLog() {
        LogUtils_1.LogUtils.log.info('=====上传日志--》上传当天日志开始====');
        let menuBtn = await this.client.$(this.menuBtnXPath); // 菜单按钮的实例
        await menuBtn.click(); // 点击
        await this.client.pause(1000); // 等待点击后系统响应
        let uploadLogBtn = await this.client.$(this.uploadLogBtnXPath); // 上传日志按钮的实例
        await uploadLogBtn.click();
        await this.client.pause(1000);
        let uploadTodayLogBtn = await this.client.$(this.uploadTodayLogBtnXPath); // 上传当日日志的实例
        await uploadTodayLogBtn.click();
        await this.client.pause(1000);
        await menuBtn.click(); // 再次点击菜单键可以回到主界面
        await this.client.pause(1000);
        LogUtils_1.LogUtils.log.info("=====上传日志--》上传当天日志符合预期=="); // TODO: 缺少判断
    }
    // 上传其他日日志
    async uploadOtherDayLog() {
        let menuBtn = await this.client.$(this.menuBtnXPath);
        await menuBtn.click();
        await this.client.pause(1000);
        let uploadLogBtn = await this.client.$(this.uploadLogBtnXPath);
        await uploadLogBtn.click();
        await this.client.pause(1000);
        let uploadOtherDayLogBtn = await this.client.$(this.uploadOtherDayLogBtnXPath);
        await uploadOtherDayLogBtn.click();
        await this.client.pause(1000);
        // TODO: 接下来还没做
    }
}
/**
 * A8
 */
const xPaths_a8 = {
    menuBtnXPath: '//android.widget.Button[@content-desc="menu "]',
    uploadLogBtnXPath: '//android.widget.Button[@content-desc="cloud upload 上传日志"]',
    uploadTodayLogBtnXPath: '//android.widget.Button[@content-desc="上传当天日志"]',
    uploadOtherDayLogBtnXPath: '//android.widget.Button[@content-desc="上传其他日期日志"]'
};
class UploadLogAction_A8 extends UploadLogAction {
    constructor(client, xPaths = xPaths_a8) {
        super(client, xPaths);
    }
}
exports.UploadLogAction_A8 = UploadLogAction_A8;
/**
 * Elo
 */
const xPaths_elo = {
    menuBtnXPath: '//android.widget.Button[@content-desc="menu"]',
    uploadLogBtnXPath: '//android.widget.Button[@content-desc="上传日志"]',
    uploadTodayLogBtnXPath: '//android.widget.Button[@content-desc="上传当天日志"]',
    uploadOtherDayLogBtnXPath: '//android.widget.Button[@content-desc="上传其他日期日志"]'
};
class UploadLogAction_Elo extends UploadLogAction {
    constructor(client, xPaths = xPaths_elo) {
        super(client, xPaths);
    }
}
exports.UploadLogAction_Elo = UploadLogAction_Elo;
