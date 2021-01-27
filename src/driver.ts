import * as wdio from 'webdriverio';
import {Options} from 'webdriver';

// const chromedriverpath = path.join(__dirname,'../app/chromedriver')

export class SingleDriver{
    private static client:wdio.BrowserObject;

    public static config:Options = {

        hostname:'127.0.0.1',
        port:4723,
        path: '/wd/hub',
        logLevel:'error',
        capabilities:{
            automationName:'uiautomator2',
            platformName:'android',
            // chromedriverExecutable:chromedriverpath,
            platformVersion:'5.1.1',
            deviceName:'192.168.102.7:5555',
            // unicodeKeyboard:true,
            skipDeviceInitialization:true,
            skipServerInstallation:true,
            noReset:true,
            fullReset: false,
            appPackage: 'net.ttoto.grandjoy.hbirdpos',
            appActivity: 'net.ttoto.grandjoy.hbirdpos.MainActivity',
            newCommandTimeout:24*3600,
            // logFile:'C://Users//13527//Desktop//appium//log.txt'
            // app:'C:/Users/ttebduser/Desktop/app_hk716_202011122139.apk'
        }
    };

    /*
    * 1.声明一个空的变量 client
      2.提供静态方法，如果 clietn 为 null，就创建一个新的 client 对象并返回
      3.每次创建的是返回的都是同一个实例。
    * */

    public static async createClient():Promise<wdio.BrowserObject>{
        if (!this.client){
            this.client = await wdio.remote(this.config);
        }
        return this.client;
    }
}
