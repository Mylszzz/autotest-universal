"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadLogAction = exports.RefreshAction = exports.LogoutAction = exports.LoginAction = void 0;
const loginUtil_1 = require("./login/loginUtil");
const logoutAction_1 = require("./logoutAction");
const refreshAction_1 = require("./refreshAction");
const uploadLogAction_1 = require("./uploadLogAction");
const deviceName_1 = require("../static/deviceName");
const deviceName = deviceName_1.DeviceName.getDeviceName(); // a8或者elo
/**
 * 用于直接调用登录的静态方法
 * 懒汉式单例模式
 */
class LoginAction {
    constructor() { }
    // main中需要调用的方法
    static async login(client) {
        if (deviceName == 'a8' && this.device_instance == null) {
            this.device_instance = new loginUtil_1.Device_A8(client);
        }
        else if (deviceName == 'elo' && this.device_instance == null) {
            this.device_instance = new loginUtil_1.Device_Elo(client);
        }
        await client.setImplicitTimeout(15000); // 15秒Timeout
        await this.device_instance.getDeviceConfig();
        client.pause(1000);
        await this.device_instance.loginProcess();
        client.pause(1000);
    }
}
exports.LoginAction = LoginAction;
/**
 * 用于直接调用退出的静态方法
 * 分别为退出登录和退出程序
 * 懒汉式单例模式
 */
class LogoutAction {
    constructor() { }
    // 退出登录
    static async accountLogout(client) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = new logoutAction_1.LogoutAction_A8(client);
        }
        else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new logoutAction_1.LogoutAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await this.instance.accountLogout();
    }
    // 退出程序
    static async sysLogout(client) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = new logoutAction_1.LogoutAction_A8(client);
        }
        else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new logoutAction_1.LogoutAction_Elo(client);
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
    constructor() { }
    static async refreshAction(client) {
        if (deviceName == 'a8' && this.instance == null) { // 如果设备名字为A8并且实例还未创建
            this.instance = new refreshAction_1.RefreshAction_A8(client); // 创建用于刷新的A8实例
        }
        else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new refreshAction_1.RefreshAction_Elo(client);
        }
        await client.setImplicitTimeout(10000); // 设定Timeout为10秒
        await this.instance.refresh();
    }
}
exports.RefreshAction = RefreshAction;
/**
 * 用于直接调用上传日志的静态方法
 * 分为上传当日日志和上传其他日期日志
 * 懒汉式单例模式
 */
class UploadLogAction {
    constructor() { }
    // 上传当日日志的方法
    static async uploadTodayLogAction(client) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = new uploadLogAction_1.UploadLogAction_A8(client);
        }
        else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new uploadLogAction_1.UploadLogAction_Elo(client);
        }
        await client.setImplicitTimeout(10000); // 设定Timeout为10秒
        await this.instance.uploadTodayLog();
    }
    // 上传非当日日志的方法
    static async uploadOtherDayLogAction(client) {
        if (deviceName == 'a8' && this.instance == null) {
            this.instance = new uploadLogAction_1.UploadLogAction_A8(client);
        }
        else if (deviceName == 'elo' && this.instance == null) {
            this.instance = new uploadLogAction_1.UploadLogAction_Elo(client);
        }
        await client.setImplicitTimeout(10000); // 设定Timeout为10秒
        await this.instance.uploadOtherDayLog();
    }
}
exports.UploadLogAction = UploadLogAction;
