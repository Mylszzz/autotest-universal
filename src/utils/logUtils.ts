import {getLogger, Logger, Log4js, configure} from "log4js";

// configure("../logConfig.json");
configure({
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
        },
        login: {
            type: "dateFile",
            filename: "log/login",
            pattern: "yyyy-MM-dd.log",
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {
            appenders: ["test","console"],
            level: "info"
        },
        saleOrder: {
            appenders: ["sale"],
            level: "info"
        }
    }
});
export class LogUtils{

    static log = getLogger('test');
    static loginLog = getLogger('loginActivity');
    static saleLog = getLogger('saleOrder');
    static refundLog = getLogger('refund');
    static search = getLogger('search');
}

export const logger = getLogger("ZM_TEST");
