"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePwd = exports.SaleActionInstance = exports.SearchAction = exports.VipLoginAction = exports.UploadLogAction = exports.CancelReturns = exports.RefreshAction = exports.LogoutAction = exports.LoginAction = void 0;
const loginUtil_1 = require("./login/loginUtil");
const logoutAction_1 = require("./basicActions/logoutAction");
const refreshAction_1 = require("./basicActions/refreshAction");
const uploadLogAction_1 = require("./basicActions/uploadLogAction");
const loginVip_1 = require("./sale/loginVip");
const saleAction_1 = require("./sale/saleAction");
const deviceName_1 = require("../static/deviceName");
const cancelReturns_1 = require("./refund/cancelReturns");
const changePassword_1 = require("./basicActions/changePassword");
const searchAction_1 = require("./basicActions/searchAction");
/****************************************************************
 *   此文件提供了各种不同模块可以直接调用的静态方法                      *
 *   在此文件中完成了对设备名的判断, 因而可以在需要的地方直接调用          *
 *   在扩展此项目时, 如需添加新设备, 请在需要的模块下添加对新设备的支持     *
 *   包括的模块有:                                                *
 *   1. 登录 2. 退出 3. 刷新店铺 4. 取消退货 5. 上传日志 6. 登录VIP    *
 *   7. 获取SaleAction实例                                       *
 ***************************************************************/
/**
 * 用于直接调用登录的静态方法
 * 懒汉式单例模式
 */
class LoginAction {
    constructor() {
    }
    // main中需要调用的方法
    static async login(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && null == this.device_instance) {
            this.device_instance = loginUtil_1.Device_A8.getInstance(client);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && this.device_instance == null) {
            this.device_instance = loginUtil_1.Device_Elo.getInstance(client);
        }
        await client.setImplicitTimeout(10000); // 10秒Timeout
        await this.device_instance.getDeviceConfig();
        await client.pause(1000);
        try {
            await this.device_instance.loginProcess();
            await client.pause(1000);
        }
        catch (e) {
            await this.device_instance.reboot();
        }
    }
    // TODO
    static async reboot() {
        await this.device_instance.reboot();
    }
}
exports.LoginAction = LoginAction;
/**
 * 用于直接调用退出的静态方法
 * 分别为退出登录和退出程序
 * 懒汉式单例模式
 */
class LogoutAction {
    constructor() {
    }
    // 退出登录
    static async accountLogout(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && null == this.instance) {
            this.instance = logoutAction_1.LogoutAction_A8.getInstance(client);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && null == this.instance) {
            this.instance = logoutAction_1.LogoutAction_Elo.getInstance(client);
        }
        await client.setImplicitTimeout(10000);
        await this.instance.accountLogout();
    }
    // 退出程序
    static async sysLogout(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && null == this.instance) {
            this.instance = logoutAction_1.LogoutAction_A8.getInstance(client);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && null == this.instance) {
            this.instance = logoutAction_1.LogoutAction_Elo.getInstance(client);
        }
        await client.setImplicitTimeout(10000);
        await this.instance.sysLogout();
    }
}
exports.LogoutAction = LogoutAction;
/**
 * 用于直接调用刷新店铺的静态方法
 * 懒汉式单例模式
 */
class RefreshAction {
    constructor() {
    }
    static async refreshAction(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && null == this.instance) { // 如果设备名字为A8并且实例还未创建
            this.instance = refreshAction_1.RefreshAction_A8.getInstance(client); // 创建用于刷新的A8实例
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && null == this.instance) {
            this.instance = refreshAction_1.RefreshAction_Elo.getInstance(client);
        }
        await client.setImplicitTimeout(10000); // 设定Timeout为10秒
        await this.instance.refresh();
    }
}
exports.RefreshAction = RefreshAction;
/**
 * 用于取消退货
 * 懒汉式单例模式
 */
class CancelReturns {
    constructor() {
    }
    static async refreshAction(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && null == this.instance) { // 如果设备名字为A8并且实例还未创建
            this.instance = cancelReturns_1.CancelReturns_A8.getInstance(client); // 创建用于刷新的A8实例
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && null == this.instance) {
            this.instance = cancelReturns_1.CancelReturns_ELO.getInstance(client);
        }
        await client.setImplicitTimeout(10000); // 设定Timeout为10秒
        await this.instance.cancelReturns();
    }
}
exports.CancelReturns = CancelReturns;
/**
 * 用于直接调用上传日志的静态方法
 * 分为上传当日日志和上传其他日期日志
 * 懒汉式单例模式
 */
class UploadLogAction {
    constructor() {
    }
    // 上传当日日志的方法
    static async uploadTodayLogAction(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && null == this.instance) {
            this.instance = uploadLogAction_1.UploadLogAction_A8.getInstance(client);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && null == this.instance) {
            this.instance = uploadLogAction_1.UploadLogAction_Elo.getInstance(client);
        }
        await client.setImplicitTimeout(10000); // 设定Timeout为10秒
        await this.instance.uploadTodayLog();
    }
    // 上传非当日日志的方法
    static async uploadOtherDayLogAction(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && this.instance == null) {
            this.instance = uploadLogAction_1.UploadLogAction_A8.getInstance(client);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && this.instance == null) {
            this.instance = uploadLogAction_1.UploadLogAction_Elo.getInstance(client);
        }
        await client.setImplicitTimeout(10000); // 设定Timeout为10秒
        await this.instance.uploadOtherDayLog();
    }
}
exports.UploadLogAction = UploadLogAction;
/**
 * 用于直接调用登录VIP的静态方法
 * 懒汉式单例模式
 */
class VipLoginAction {
    constructor() {
    }
    static async vipLogin(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && this.instance == null) {
            this.instance = loginVip_1.VipLogin_A8.getInstance(client);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && this.instance == null) {
            this.instance = loginVip_1.VipLogin_Elo.getInstance(client);
        }
        await this.instance.vipLogin();
    }
}
exports.VipLoginAction = VipLoginAction;
/**
 * 用于直接调用查订单的静态方法
 * 分为扫码查询和查询订单号
 * 懒汉式单例模式
 */
class SearchAction {
    constructor() {
    }
    // 扫码查订单方法
    static async searchScreenAction(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && null == this.instance) {
            this.instance = searchAction_1.SearchAction_A8.getInstance(client);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && null == this.instance) {
            this.instance = searchAction_1.SearchAction_ELO.getInstance(client);
        }
        await client.setImplicitTimeout(10000); // 设定Timeout为10秒
        await this.instance.searchScreenAction();
    }
    // 查询订单号的方法
    static async searchNumAction(client, number) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && this.instance == null) {
            this.instance = searchAction_1.SearchAction_A8.getInstance(client);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && this.instance == null) {
            this.instance = searchAction_1.SearchAction_ELO.getInstance(client);
        }
        await client.setImplicitTimeout(10000); // 设定Timeout为10秒
        await this.instance.searchNum(number);
    }
}
exports.SearchAction = SearchAction;
/**
 * 直接获取 SaleAction 实例的静态方法
 */
class SaleActionInstance {
    constructor() {
    }
    static getSaleActionInstance(saleData, client, csvGenerator) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8') {
            return new saleAction_1.SaleAction_A8(saleData, client, csvGenerator);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo') {
            return new saleAction_1.SaleAction_Elo(saleData, client, csvGenerator);
        }
        else { // 需要默认返回
            return new saleAction_1.SaleAction_A8(saleData, client, csvGenerator);
        }
    }
}
exports.SaleActionInstance = SaleActionInstance;
/**
 * 用于直接调用修改密码的静态方法
 */
class ChangePwd {
    constructor() {
    }
    static async changePwd(client) {
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && this.instance == null) {
            this.instance = changePassword_1.ChangePassword_A8.getInstance(client);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && this.instance == null) {
            this.instance = changePassword_1.ChangePassword_Elo.getInstance(client);
        }
        await this.instance.changePasswordProcess();
    }
}
exports.ChangePwd = ChangePwd;
