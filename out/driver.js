"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleDriver = void 0;
const wdio = __importStar(require("webdriverio"));
const deviceName_1 = require("./static/deviceName");
const driverConfig_1 = require("./static/driverConfig");
class SingleDriver {
    /**
     * 1.声明一个空的变量 client
     * 2.提供静态方法，如果 clietn 为 null，就创建一个新的 client 对象并返回
     * 3.每次创建的是返回的都是同一个实例。
     */
    static async createClient() {
        if (!this.client) {
            if (deviceName_1.DeviceName.getDeviceName() == 'a8') {
                this.client = await wdio.remote(driverConfig_1.DriverConfig.config_a8);
            }
            else if (deviceName_1.DeviceName.getDeviceName() == 'elo') {
                this.client = await wdio.remote(driverConfig_1.DriverConfig.config_elo);
            }
        }
        return this.client;
    }
}
exports.SingleDriver = SingleDriver;
