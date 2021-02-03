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
 */
class LoginAction {
    static async login(client) {
        let device;
        if (deviceName == 'a8') {
            device = new loginUtil_1.Device_A8(client);
        }
        else if (deviceName == 'elo') {
            device = new loginUtil_1.Device_Elo(client);
        }
        await client.setImplicitTimeout(20000);
        await device.getDeviceConfig();
        client.pause(1000);
        await device.loginProcess();
        client.pause(1000);
    }
}
exports.LoginAction = LoginAction;
/**
 * 用于直接调用退出的静态方法
 * 分别为退出登录和退出程序
 */
class LogoutAction {
    static async accountLogout(client) {
        let device;
        if (deviceName == 'a8') {
            device = new logoutAction_1.LogoutAction_A8(client);
        }
        else if (deviceName == 'elo') {
            device = new logoutAction_1.LogoutAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.accountLogout();
    }
    static async sysLogout(client) {
        let device;
        if (deviceName == 'a8') {
            device = new logoutAction_1.LogoutAction_A8(client);
        }
        else if (deviceName == 'elo') {
            device = new logoutAction_1.LogoutAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.sysLogout();
    }
}
exports.LogoutAction = LogoutAction;
/**
 * 用于直接调用刷新店铺的静态方法
 */
class RefreshAction {
    static async refreshAction(client) {
        let device;
        if (deviceName == 'a8') {
            device = new refreshAction_1.RefreshAction_A8(client);
        }
        else if (deviceName == 'elo') {
            device = new refreshAction_1.RefreshAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.refresh();
    }
}
exports.RefreshAction = RefreshAction;
/**
 * 用于直接调用上传日志的静态方法
 * 分为上传当日日志和上传其他日期日志
 */
class UploadLogAction {
    static async uploadTodayLogAction(client) {
        let device;
        if (deviceName == 'a8') {
            device = new uploadLogAction_1.UploadLogAction_A8(client);
        }
        else if (deviceName == 'elo') {
            device = new uploadLogAction_1.UploadLogAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.uploadTodayLog();
    }
    static async uploadOtherDayLogAction(client) {
        let device;
        if (deviceName == 'a8') {
            device = new uploadLogAction_1.UploadLogAction_A8(client);
        }
        else if (deviceName == 'elo') {
            device = new uploadLogAction_1.UploadLogAction_Elo(client);
        }
        await client.setImplicitTimeout(10000);
        await device.uploadOtherDayLog();
    }
}
exports.UploadLogAction = UploadLogAction;
