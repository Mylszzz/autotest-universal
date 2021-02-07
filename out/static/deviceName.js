"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceNameEnum = exports.DeviceName = void 0;
// const deviceName:string = 'a8';
const deviceName = 'elo';
class DeviceName {
    static getDeviceName() {
        return deviceName;
    }
}
exports.DeviceName = DeviceName;
var DeviceNameEnum;
(function (DeviceNameEnum) {
    DeviceNameEnum[DeviceNameEnum["a8"] = 0] = "a8";
    DeviceNameEnum[DeviceNameEnum["elo"] = 1] = "elo";
})(DeviceNameEnum = exports.DeviceNameEnum || (exports.DeviceNameEnum = {}));
