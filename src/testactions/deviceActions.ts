import {Device_A8, Device_Elo, Login} from "./login/loginUtil";
import {LogoutAction_A8, LogoutAction_Elo} from "./basicActions/logoutAction";
import {RefreshAction_A8, RefreshAction_Elo} from "./basicActions/refreshAction";
import {UploadLogAction_A8, UploadLogAction_Elo} from "./basicActions/uploadLogAction";
import {VipLogin_A8, VipLogin_Elo} from "./sale/loginVip";
import {ISaleData, SaleAction_A8, SaleAction_Elo} from "./sale/saleAction";
import {DeviceName} from "../static/deviceName";
import {CancelReturns_A8, CancelReturns_ELO} from "./refund/cancelReturns";
import {CsvGenerator} from "./sale/csvGenerator";


/****************************************************************
 *   此文件提供了各种不同模块可以直接调用的静态方法                      *
 *   在此文件中完成了对设备名的判断, 因而可以在需要的地方直接调用          *
 *   在扩展此项目时, 如需添加新设备, 请在需要的模块下添加对新设备的支持     *
 *   包括的模块有:                                                *
 *   1. 登录 2. 退出 3. 刷新店铺 4. 取消退货 5. 上传日志 6. 登录VIP    *
 *   7. 获取SaleAction实例                                       *
 ***************************************************************/

const deviceName: string = DeviceName.getDeviceName();  // a8或者elo

/**
 * 用于直接调用登录的静态方法
 * 懒汉式单例模式
 */
export class LoginAction {
    private static device_instance: Login;

    private constructor() {
    }

    // main中需要调用的方法
    static async login(client: any) {
        if (deviceName == 'a8' && null == this.device_instance) {
            this.device_instance = Device_A8.getInstance(client);
        } else if (deviceName == 'elo' && this.device_instance == null) {
            this.device_instance = Device_Elo.getInstance(client);
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
    private static instance: LogoutAction_A8 | LogoutAction_Elo;

    private constructor() {
    }

    // 退出登录
    static async accountLogout(client: any) {
        if (deviceName == 'a8' && null == this.instance) {
            this.instance = LogoutAction_A8.getInstance(client);
        } else if (deviceName == 'elo' && null == this.instance) {
            this.instance = LogoutAction_Elo.getInstance(client);
        }
        await client.setImplicitTimeout(10000);
        await this.instance.accountLogout();
    }

    // 退出程序
    static async sysLogout(client: any) {
        if (deviceName == 'a8' && null == this.instance) {
            this.instance = LogoutAction_A8.getInstance(client);
        } else if (deviceName == 'elo' && null == this.instance) {
            this.instance = LogoutAction_Elo.getInstance(client);
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
    private static instance: RefreshAction_A8 | RefreshAction_Elo;

    private constructor() {
    }

    static async refreshAction(client: any) {
        if (deviceName == 'a8' && null == this.instance) {  // 如果设备名字为A8并且实例还未创建
            this.instance = RefreshAction_A8.getInstance(client);  // 创建用于刷新的A8实例
        } else if (deviceName == 'elo' && null == this.instance) {
            this.instance = RefreshAction_Elo.getInstance(client);
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
    private static instance: CancelReturns_A8 | CancelReturns_ELO;

    private constructor() {
    }

    static async refreshAction(client: any) {
        if (deviceName == 'a8' && null == this.instance) {  // 如果设备名字为A8并且实例还未创建
            this.instance = CancelReturns_A8.getInstance(client);  // 创建用于刷新的A8实例
        } else if (deviceName == 'elo' && null == this.instance) {
            this.instance = CancelReturns_ELO.getInstance(client);
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
    private static instance: UploadLogAction_A8 | UploadLogAction_Elo;

    private constructor() {
    }

    // 上传当日日志的方法
    static async uploadTodayLogAction(client: any) {
        if (deviceName == 'a8' && null == this.instance) {
            this.instance = UploadLogAction_A8.getInstance(client);
        } else if (deviceName == 'elo' && null == this.instance) {
            this.instance = UploadLogAction_Elo.getInstance(client);
        }
        await client.setImplicitTimeout(10000);  // 设定Timeout为10秒
        await this.instance.uploadTodayLog();
    }

    // 上传非当日日志的方法
    static async uploadOtherDayLogAction(client: any) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = UploadLogAction_A8.getInstance(client);
        } else if (deviceName == 'elo' && this.instance == null) {
            this.instance = UploadLogAction_Elo.getInstance(client);
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
    private static instance: VipLogin_A8 | VipLogin_Elo;

    private constructor() {
    }

    public static async vipLogin(client: any) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = VipLogin_A8.getInstance(client);
        } else if (deviceName == 'elo' && this.instance == null) {
            this.instance = VipLogin_Elo.getInstance(client);
        }
        await this.instance.vipLogin();
    }
}

/**
 * 直接获取 SaleAction 实例的静态方法
 */
export class SaleActionInstance {
    private constructor() {
    }

    public static getSaleActionInstance(saleData: ISaleData, client: any, csvGenerator: CsvGenerator): SaleAction_A8 | SaleAction_Elo {
        if (deviceName == 'a8') {
            return new SaleAction_A8(saleData, client, csvGenerator);
        } else if (deviceName == 'elo') {
            return new SaleAction_Elo(saleData, client, csvGenerator);
        } else {  // 需要默认返回
            return new SaleAction_A8(saleData, client, csvGenerator);
        }
    }
}
