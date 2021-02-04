import {LogUtils} from "../utils/LogUtils";
import * as wdio from "webdriverio";

class UploadLogAction {
    client:wdio.BrowserObject;

    constructor(client:wdio.BrowserObject) {
        this.client = client;
    }

    // 上传当天日志
    public async uploadTodayLog() {
        let menuBtn = await this.client.$('//android.widget.Button[@content-desc="menu"]');
        await menuBtn.click();
        await this.client.pause(1000);
        let uploadLogBtn = await this.client.$('//android.widget.Button[@content-desc="上传日志"]');
        await uploadLogBtn.click();
        await this.client.pause(1000);
        let uploadTodayLogBtn = await this.client.$('//android.widget.Button[@content-desc="上传当天日志"]');
        await uploadTodayLogBtn.click();
        await this.client.pause(1000);
        LogUtils.log.info("=====上传日志--》上传当天日志符合预期==");  // TODO: 缺少判断
    }

    // 上传其他日日志
    public async uploadOtherDayLog() {
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

export class UploadLogAction_A8 extends UploadLogAction {}
export class UploadLogAction_Elo extends UploadLogAction {}
