"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTimeSettings = exports.generalSettings = void 0;
/**
 * 通用设置：脚本是否运行下列模块
 * true：运行
 * false：不运行
 */
exports.generalSettings = {
    enableLoginModule: true,
    enableVipLoginModule: true,
    enableSaleModule: true,
    enableRefundModule: true,
    enableUploadLogModule: false,
    enableRefreshModule: false,
    enableLogoutModule: false,
    enableCancelReturnsModule: false,
    enableChangePwdModule: false,
    enableSaleSummary: false,
};
exports.runTimeSettings = {
    generalPauseTime: 1000,
    longPauseTime: 5000,
    shortPauseTime: 500,
};
