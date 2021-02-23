"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadLogAction_Elo = exports.UploadLogAction_A8 = void 0;
const logUtils_1 = require("../../utils/logUtils");
const buttonXPaths_1 = require("../../static/buttonXPaths");
/**
 * 上传日志
 * 分为上传当日和上传其他日期日志
 */
class UploadLogAction {
    /*
    xPaths: IXPaths对象，包括了四个按键的xPath
     */
    constructor(client, xPaths) {
        this.client = client;
        this.menuBtnXPath = xPaths.menuBtnXPath;
        this.uploadLogBtnXPath = xPaths.uploadLogBtnXPath;
        this.uploadTodayLogBtnXPath = xPaths.uploadTodayLogBtnXPath;
        this.uploadOtherDayLogBtnXPath = xPaths.uploadOtherDayLogBtnXPath;
    }
    // 上传当天日志
    async uploadTodayLog() {
        logUtils_1.LogUtils.log.info('=====上传日志--》上传当天日志开始====');
        let menuBtn = await this.client.$(this.menuBtnXPath); // 菜单按钮的实例
        await menuBtn.click(); // 点击
        await this.client.pause(1000); // 等待点击后系统响应
        let uploadLogBtn = await this.client.$(this.uploadLogBtnXPath); // 上传日志按钮的实例
        await uploadLogBtn.click();
        await this.client.pause(1000);
        let uploadTodayLogBtn = await this.client.$(this.uploadTodayLogBtnXPath); // 上传当日日志的实例
        await uploadTodayLogBtn.click();
        logUtils_1.LogUtils.log.info("=====上传日志--》上传当天日志符合预期=="); // TODO: 缺少判断
        await this.client.pause(5000); // 需要等比较久
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
    menuBtnXPath: buttonXPaths_1.ButtonXPaths_A8.MENU,
    uploadLogBtnXPath: buttonXPaths_1.ButtonXPaths_A8.UPLOADLOG,
    uploadTodayLogBtnXPath: buttonXPaths_1.ButtonXPaths_A8.UPLOADTODAYLOG,
    uploadOtherDayLogBtnXPath: buttonXPaths_1.ButtonXPaths_A8.UPLOADOTHERDAYLOG
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
    menuBtnXPath: buttonXPaths_1.ButtonXPaths_Elo.MENU,
    uploadLogBtnXPath: buttonXPaths_1.ButtonXPaths_Elo.UPLOADLOG,
    uploadTodayLogBtnXPath: buttonXPaths_1.ButtonXPaths_Elo.UPLOADTODAYLOG,
    uploadOtherDayLogBtnXPath: buttonXPaths_1.ButtonXPaths_Elo.UPLOADOTHERDAYLOG
};
class UploadLogAction_Elo extends UploadLogAction {
    constructor(client, xPaths = xPaths_elo) {
        super(client, xPaths);
    }
}
exports.UploadLogAction_Elo = UploadLogAction_Elo;
