"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceName = void 0;
class DeviceName {
    static getDeviceName() {
        return this.deviceName;
    }
    static setDeviceName(deviceName) {
        this.deviceName = deviceName;
    }
}
exports.DeviceName = DeviceName;
DeviceName.deviceName = '';
