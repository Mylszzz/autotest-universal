"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAction = void 0;
const loginUtil_1 = require("./loginUtil");
const deviceName_1 = require("../../static/deviceName");
const deviceName = deviceName_1.DeviceName.getDeviceName(); // a8或者elo
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
