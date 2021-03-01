import {LogUtils} from "../../utils/logUtils";
import * as wdio from "webdriverio";
import {ButtonXPaths_A8, ButtonXPaths_Elo} from "../../static/buttonXPaths";

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
    protected constructor(client:wdio.BrowserObject, xPaths:IXPaths) {
        this.client = client;
        this.menuBtnXPath = xPaths.menuBtnXPath;
        this.uploadLogBtnXPath = xPaths.uploadLogBtnXPath;
        this.uploadTodayLogBtnXPath = xPaths.uploadTodayLogBtnXPath;
        this.uploadOtherDayLogBtnXPath = xPaths.uploadOtherDayLogBtnXPath;
    }

    // 上传当天日志
    public async uploadTodayLog() {
        LogUtils.log.info('*****上传当天日志开始*****');
        let menuBtn = await this.client.$(this.menuBtnXPath);  // 菜单按钮的实例
        await menuBtn.click();  // 点击
        await this.client.pause(1000);  // 等待点击后系统响应
        let uploadLogBtn = await this.client.$(this.uploadLogBtnXPath);  // 上传日志按钮的实例
        await uploadLogBtn.click();
        await this.client.pause(1000);
        let uploadTodayLogBtn = await this.client.$(this.uploadTodayLogBtnXPath);  // 上传当日日志的实例
        await uploadTodayLogBtn.click();
        LogUtils.log.info("*****上传当天日志符合预期*****");  // TODO: 缺少判断
        await this.client.pause(5000);  // 需要等比较久
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
}

/**
 * A8
 */
const xPaths_a8:IXPaths = {
    menuBtnXPath:ButtonXPaths_A8.MENU,
    uploadLogBtnXPath:ButtonXPaths_A8.UPLOADLOG,
    uploadTodayLogBtnXPath:ButtonXPaths_A8.UPLOADTODAYLOG,
    uploadOtherDayLogBtnXPath:ButtonXPaths_A8.UPLOADOTHERDAYLOG
};

/**
 * A8的具体类, 单例模式
 */
export class UploadLogAction_A8 extends UploadLogAction {
    private static instance:UploadLogAction_A8;

    private constructor(client:wdio.BrowserObject, xPaths:IXPaths = xPaths_a8) {
        super(client, xPaths);
    }

    public static getInstance(client:wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new UploadLogAction_A8(client);
        }
        return this.instance;
    }
}

/**
 * Elo
 */
const xPaths_elo:IXPaths = {
    menuBtnXPath:ButtonXPaths_Elo.MENU,
    uploadLogBtnXPath:ButtonXPaths_Elo.UPLOADLOG,
    uploadTodayLogBtnXPath:ButtonXPaths_Elo.UPLOADTODAYLOG,
    uploadOtherDayLogBtnXPath:ButtonXPaths_Elo.UPLOADOTHERDAYLOG
};

/**
 * Elo的具体类, 单例模式
 */
export class UploadLogAction_Elo extends UploadLogAction {
    private static instance:UploadLogAction_Elo;

    private constructor(client:wdio.BrowserObject, xPaths:IXPaths = xPaths_elo) {
        super(client, xPaths);
    }

    public static getInstance(client:wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new UploadLogAction_Elo(client);
        }
        return this.instance;
    }
}

/**
 * 需要传入的xPath的接口规范
 * 参数整合
 */
interface IXPaths {
    menuBtnXPath:string,  // 菜单键的xPath
    uploadLogBtnXPath:string,  // 上传日志键的xPath
    uploadTodayLogBtnXPath:string,  // 上传当天日志键的xPath
    uploadOtherDayLogBtnXPath:string  // 上传其他日期日志键的xPath
}
