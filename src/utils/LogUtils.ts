import {getLogger, configure} from "log4js";

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

    static log=getLogger('test');
    static saleLog=getLogger('saleOrder');
}
