import {Device, Device_A8, Device_Elo} from "./login/loginUtil";
import {LogoutAction_A8, LogoutAction_Elo} from "./basicActions/logoutAction";
import {RefreshAction_A8, RefreshAction_Elo} from "./basicActions/refreshAction";
import {UploadLogAction_A8, UploadLogAction_Elo} from "./basicActions/uploadLogAction";
import {VipLogin_A8, VipLogin_Elo} from "./loginVip";
import {DeviceName} from "../static/deviceName";
import {CancelReturns_A8, CancelReturns_ELO} from "./CancelReturns";


const deviceName:string = DeviceName.getDeviceName();  // a8或者elo

/**
 * 用于直接调用登录的静态方法
 * 懒汉式单例模式
 */
export class LoginAction {
    private static device_instance:Device;
    private constructor() {}

    // main中需要调用的方法
    static async login(client:any) {
        if (deviceName == 'a8' && this.device_instance == null) {
            this.device_instance = new Device_A8(client);
        } else if (deviceName == 'elo' && this.device_instance == null) {
            this.device_instance = new Device_Elo(client);
        }
        await client.setImplicitTimeout(10000);  // 10秒Timeout
        await this.device_instance.getDeviceConfig();
        await client.pause(1000);
        try {
            await this.device_instance.loginProcess();
            await client.pause(1000);
        } catch (e) {
            await this.device_instance.reboot();
        }

    }
}

/**
 * 用于直接调用退出的静态方法
 * 分别为退出登录和退出程序
 * 懒汉式单例模式
 */
export class LogoutAction {
    private static instance:LogoutAction_A8|LogoutAction_Elo;
    private constructor() {}

    // 退出登录
    static async accountLogout(client:any) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = new LogoutAction_A8(client);
        } else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new LogoutAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await this.instance.accountLogout();
    }

    // 退出程序
    static async sysLogout(client:any) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = new LogoutAction_A8(client);
        } else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new LogoutAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await this.instance.sysLogout();
    }
}

/**
 * 用于直接调用刷新店铺的静态方法
 * 懒汉式单例模式
 */
export class RefreshAction {
    private static instance:RefreshAction_A8|RefreshAction_Elo;
    private constructor() {}

    static async refreshAction(client:any) {
        if (deviceName == 'a8' && this.instance == null) {  // 如果设备名字为A8并且实例还未创建
            this.instance = new RefreshAction_A8(client);  // 创建用于刷新的A8实例
        } else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new RefreshAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);  // 设定Timeout为10秒
        await this.instance.refresh();
    }
}

/**
 * 用于取消退货
 * 懒汉式单例模式
 */
export class CancelReturns {
    private static instance:CancelReturns_A8|CancelReturns_ELO;
    private constructor() {}

    static async refreshAction(client:any) {
        if (deviceName == 'a8' && this.instance == null) {  // 如果设备名字为A8并且实例还未创建
            this.instance = new CancelReturns_A8(client);  // 创建用于刷新的A8实例
        } else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new CancelReturns_ELO(client);
        }
        await client.setImplicitTimeout(10000);  // 设定Timeout为10秒
        await this.instance.cancelReturns();
    }
}

/**
 * 用于直接调用上传日志的静态方法
 * 分为上传当日日志和上传其他日期日志
 * 懒汉式单例模式
 */
export class UploadLogAction {
    private static instance:UploadLogAction_A8|UploadLogAction_Elo;
    private constructor() {}

    // 上传当日日志的方法
    static async uploadTodayLogAction(client:any) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = new UploadLogAction_A8(client);
        } else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new UploadLogAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);  // 设定Timeout为10秒
        await this.instance.uploadTodayLog();
    }

    // 上传非当日日志的方法
    static async uploadOtherDayLogAction(client:any) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = new UploadLogAction_A8(client);
        } else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new UploadLogAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);  // 设定Timeout为10秒
        await this.instance.uploadOtherDayLog();
    }
}

/**
 * 用于直接调用登录VIP的静态方法
 * 懒汉式单例模式
 */
export class VipLoginAction {
    private static instance:VipLogin_A8|VipLogin_Elo;
    private constructor(){}

    public static async vipLogin(client:any) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = new VipLogin_A8(client);
        } else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new VipLogin_Elo(client);
        }
        await this.instance.vipLogin();
    }
}
