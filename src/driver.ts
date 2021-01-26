import * as wdio from 'webdriverio';
import {Options} from 'webdriver';


export class SingleDriver{
    private static client:wdio.BrowserObject;

    /*
    Elo 的配置
     */
    // public static config:Options = {
    //
    //     hostname:'127.0.0.1',
    //     port:4723,
    //       path:'/wd/hub',
    //     logLevel:'info',
    //     capabilities:{
    //         automationName:'uiautomator2',
    //         platformName:'android',
    //        // chromedriverExecutable:chromedriverpath,
    //         platformVersion:'7.1.2',
    //         deviceName:'192.168.102.3:5555',
    //         unicodeKeyboard:true,
    //         skipDeviceInitialization:true,
    //         skipServerInstallation:true,
    //         noReset:true,
    //         appPackage:'cn.com.crland.impos',
    //         appActivity:'cn.com.crland.impos.MainActivity',
    //         newCommandTimeout:24*3600,
    //     }
    // };

    /*
    A8 的配置
     */
    public static config:Options = {

        hostname:'127.0.0.1',
        port:4723,
        path: '/wd/hub',
        logLevel:'error',
        capabilities:{
            automationName:'uiautomator2',
            platformName:'android',
            platformVersion:'5.1.1',
            deviceName:'192.168.102.7:5555',
            skipDeviceInitialization:true,
            skipServerInstallation:true,
            noReset:true,
            fullReset: false,
            appPackage: 'net.ttoto.grandjoy.hbirdpos',
            appActivity: 'net.ttoto.grandjoy.hbirdpos.MainActivity',
            newCommandTimeout:24*3600,
        }
    };

    public static async createClient():Promise<wdio.BrowserObject>{
        if (!this.client){
            this.client = await wdio.remote(this.config);
        }
        return this.client;
    }
}
