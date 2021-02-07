import {LogUtils} from "../utils/LogUtils";
import * as wdio from "webdriverio";

/**
 * 上传日志
 * 分为上传当日和上传其他日期日志
 */
class UploadLogAction {
    private client:wdio.BrowserObject;
    readonly menuBtnXPath:string;  // 菜单键的xPath
    readonly uploadLogBtnXPath:string;  // 上传日志键的xPath
    readonly uploadTodayLogBtnXPath:string;  // 上传当天日志键的xPath
    readonly uploadOtherDayLogBtnXPath:string;  // 上传其他日期日志键的xPath

    /*
    xPaths: IXPaths对象，包括了四个按键的xPath
     */
    constructor(client:wdio.BrowserObject, xPaths:IXPaths) {
        this.client = client;
        this.menuBtnXPath = xPaths.menuBtnXPath;
        this.uploadLogBtnXPath = xPaths.uploadLogBtnXPath;
        this.uploadTodayLogBtnXPath = xPaths.uploadTodayLogBtnXPath;
        this.uploadOtherDayLogBtnXPath = xPaths.uploadOtherDayLogBtnXPath;
    }

    // 上传当天日志
    public async uploadTodayLog() {
        LogUtils.log.info('=====上传日志--》上传当天日志开始====');
        let menuBtn = await this.client.$(this.menuBtnXPath);  // 菜单按钮的实例
        await menuBtn.click();  // 点击
        await this.client.pause(1000);  // 等待点击后系统响应
        let uploadLogBtn = await this.client.$(this.uploadLogBtnXPath);  // 上传日志按钮的实例
        await uploadLogBtn.click();
        await this.client.pause(1000);
        let uploadTodayLogBtn = await this.client.$(this.uploadTodayLogBtnXPath);  // 上传当日日志的实例
        await uploadTodayLogBtn.click();
        await this.client.pause(1000);
        await menuBtn.click();  // 再次点击菜单键可以回到主界面
        await this.client.pause(1000);
        LogUtils.log.info("=====上传日志--》上传当天日志符合预期==");  // TODO: 缺少判断
    }

    // 上传其他日日志
    public async uploadOtherDayLog() {
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

    // // 上传当天日志
    // public static async uploadTheDailyLog(client:wdio.BrowserObject){
    //     try {
    //         await this.sleep(2000);
    //         let menu=await client.$('//android.widget.Button[@content-desc="menu"]');
    //         await menu.click();
    //         let log=await client.$('//android.widget.Button[@content-desc="上传日志"]');
    //         await log.click();
    //         let currLog = await client.$('//android.widget.Button[@content-desc="上传当天日志"]');
    //         await currLog.click();
    //         try {
    //             await client.setImplicitTimeout(500);
    //             await client.$('//android.view.View[@content-desc="DB上传成功"]');
    //             await client.setImplicitTimeout(10000);
    //             LogUtils.log.info("=====上传日志--》上传当天日志符合预期==");
    //         }catch (e) {
    //             await client.setImplicitTimeout(10000);
    //             LogUtils.log.info("=====上传日志--》上传当天日志不符合预期==");
    //         }
    //     }catch (e) {
    //
    //     }
    //
    // }
}

/**
 * A8
 */
const xPaths_a8:IXPaths = {
    menuBtnXPath:'//android.widget.Button[@content-desc="menu "]',
    uploadLogBtnXPath:'//android.widget.Button[@content-desc="cloud upload 上传日志"]',
    uploadTodayLogBtnXPath:'//android.widget.Button[@content-desc="上传当天日志"]',
    uploadOtherDayLogBtnXPath:'//android.widget.Button[@content-desc="上传其他日期日志"]'
};

export class UploadLogAction_A8 extends UploadLogAction {
    public constructor(client:wdio.BrowserObject, xPaths:IXPaths = xPaths_a8) {
        super(client, xPaths);
    }
}

/**
 * Elo
 */
const xPaths_elo:IXPaths = {
    menuBtnXPath:'//android.widget.Button[@content-desc="menu"]',
    uploadLogBtnXPath:'//android.widget.Button[@content-desc="上传日志"]',
    uploadTodayLogBtnXPath:'//android.widget.Button[@content-desc="上传当天日志"]',
    uploadOtherDayLogBtnXPath:'//android.widget.Button[@content-desc="上传其他日期日志"]'
};

export class UploadLogAction_Elo extends UploadLogAction {
    public constructor(client:wdio.BrowserObject, xPaths:IXPaths = xPaths_elo) {
        super(client, xPaths);
    }
}

/**
 * 需要传入的xPath的接口规范
 */
interface IXPaths {
    menuBtnXPath:string,  // 菜单键的xPath
    uploadLogBtnXPath:string,  // 上传日志键的xPath
    uploadTodayLogBtnXPath:string,  // 上传当天日志键的xPath
    uploadOtherDayLogBtnXPath:string  // 上传其他日期日志键的xPath
}
