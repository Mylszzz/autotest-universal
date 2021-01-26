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
class SingleDriver {
    static async createClient() {
        if (!this.client) {
            this.client = await wdio.remote(this.config);
        }
        return this.client;
    }
}
exports.SingleDriver = SingleDriver;
/*
Elo 的配置
 */
// public static config:Options = {
//
//     hostname:'127.0.0.1',
//     port:4723,
//       path:'/wd/hub',
//     logLevel:'info',
//     capabilities:{
//         automationName:'uiautomator2',
//         platformName:'android',
//        // chromedriverExecutable:chromedriverpath,
//         platformVersion:'7.1.2',
//         deviceName:'192.168.102.3:5555',
//         unicodeKeyboard:true,
//         skipDeviceInitialization:true,
//         skipServerInstallation:true,
//         noReset:true,
//         appPackage:'cn.com.crland.impos',
//         appActivity:'cn.com.crland.impos.MainActivity',
//         newCommandTimeout:24*3600,
//     }
// };
/*
A8 的配置
 */
SingleDriver.config = {
    hostname: '127.0.0.1',
    port: 4723,
    path: '/wd/hub',
    logLevel: 'error',
    capabilities: {
        automationName: 'uiautomator2',
        platformName: 'android',
        platformVersion: '5.1.1',
        deviceName: '192.168.102.7:5555',
        skipDeviceInitialization: true,
        skipServerInstallation: true,
        noReset: true,
        fullReset: false,
        appPackage: 'net.ttoto.grandjoy.hbirdpos',
        appActivity: 'net.ttoto.grandjoy.hbirdpos.MainActivity',
        newCommandTimeout: 24 * 3600,
    }
};
