import * as wdio from 'webdriverio';
import {Options} from 'webdriver';
import {DeviceName} from "./entity/deviceName";

// const chromedriverpath = path.join(__dirname,'../app/chromedriver')

const deviceName:string = DeviceName.getDeviceName();  // a8或者elo


export class SingleDriver{
    private static client:wdio.BrowserObject;

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

    /*
    Elo 的配置
     */
    public static config_elo:Options = {

        hostname:'127.0.0.1',
        port:4723,
          path:'/wd/hub',
        logLevel:'info',
        capabilities:{
            automationName:'uiautomator2',
            platformName:'android',
           // chromedriverExecutable:chromedriverpath,
            platformVersion:'7.1.2',
            deviceName:'192.168.102.3:5555',
            unicodeKeyboard:true,
            skipDeviceInitialization:true,
            skipServerInstallation:true,
            noReset:true,
            appPackage:'cn.com.crland.impos',
            appActivity:'cn.com.crland.impos.MainActivity',
            newCommandTimeout:24*3600,
        }
    };

    /*
    * 1.声明一个空的变量 client
      2.提供静态方法，如果 clietn 为 null，就创建一个新的 client 对象并返回
      3.每次创建的是返回的都是同一个实例。
    * */

    public static async createClient():Promise<wdio.BrowserObject>{
        if (!this.client){
            if (deviceName == 'a8') {
                this.client = await wdio.remote(this.config);
            } else if (deviceName == 'elo') {
                this.client = await wdio.remote(this.config_elo);
            }

        }
        return this.client;
    }
}
