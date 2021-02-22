"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogUtils = void 0;
const log4js_1 = require("log4js");
// configure("../logConfig.json");
log4js_1.configure({
    appenders: {
        console: { type: 'stdout', layout: { type: 'colored' } },
        test: {
            type: "dateFile",
            filename: "log/test",
            pattern: "yyyy-MM-dd.log",
            alwaysIncludePattern: true
        },
        sale: {
            type: "dateFile",
            filename: "log/sale/order",
            pattern: "yyyy-MM-dd.log",
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {
            appenders: ["test", "console"],
            level: "info"
        },
        saleOrder: {
            appenders: ["sale"],
            level: "info"
        }
    }
});
class LogUtils {
}
exports.LogUtils = LogUtils;
LogUtils.log = log4js_1.getLogger('test');
LogUtils.saleLog = log4js_1.getLogger('saleOrder');
LogUtils.search = log4js_1.getLogger('search');
LogUtils.refundLog = log4js_1.getLogger('refund');
exports.logger = log4js_1.getLogger("ZM_TEST");
