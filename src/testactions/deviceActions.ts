import {Device_A8, Device_Elo} from "./login/loginUtil";
import {LogoutAction_A8, LogoutAction_Elo} from "./logoutAction";
import {RefreshAction_A8, RefreshAction_Elo} from "./refreshAction";
import {UploadLogAction_A8, UploadLogAction_Elo} from "./uploadLogAction";
import {DeviceName} from "../static/deviceName";


const deviceName:string = DeviceName.getDeviceName();  // a8或者elo

/**
 * 用于直接调用登录的静态方法
 */
export class LoginAction {

    static async login(client:any) {
        let device:any;
        if (deviceName == 'a8') {
            device = new Device_A8(client);
        } else if (deviceName == 'elo') {
            device = new Device_Elo(client);
        }
        await client.setImplicitTimeout(20000);
        await device.getDeviceConfig();
        client.pause(1000);
        await device.loginProcess();
        client.pause(1000);
    }
}

/**
 * 用于直接调用退出的静态方法
 * 分别为退出登录和退出程序
 */
export class LogoutAction {

    static async accountLogout(client:any) {
        let device:any;
        if (deviceName == 'a8') {
            device = new LogoutAction_A8(client);
        } else if (deviceName == 'elo') {
            device = new LogoutAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.accountLogout()
    }

    static async sysLogout(client:any) {
        let device:any;
        if (deviceName == 'a8') {
            device = new LogoutAction_A8(client);
        } else if (deviceName == 'elo') {
            device = new LogoutAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.sysLogout()
    }
}

/**
 * 用于直接调用刷新店铺的静态方法
 */
export class RefreshAction {

    static async refreshAction(client:any) {
        let device:any;
        if (deviceName == 'a8') {
            device = new RefreshAction_A8(client);
        } else if (deviceName == 'elo') {
            device = new RefreshAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.refresh();
    }
}

/**
 * 用于直接调用上传日志的静态方法
 * 分为上传当日日志和上传其他日期日志
 */
export class UploadLogAction {

    static async uploadTodayLogAction(client:any) {
        let device:any;
        if (deviceName == 'a8') {
            device = new UploadLogAction_A8(client);
        } else if (deviceName == 'elo') {
            device = new UploadLogAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.uploadTodayLog();
    }

    static async uploadOtherDayLogAction(client:any) {
        let device:any;
        if (deviceName == 'a8') {
            device = new UploadLogAction_A8(client);
        } else if (deviceName == 'elo') {
            device = new UploadLogAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.uploadOtherDayLog();
    }
}