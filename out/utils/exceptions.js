"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleException = exports.SiftException = exports.SearchException = exports.RefunException = exports.LoginException = exports.AutoTestException = void 0;
/**
 * 自定义基本异常类
 */
const deviceActions_1 = require("../testactions/deviceActions");
class AutoTestException extends Error {
    /**
     * 构造函数，如果子类继承了该基类，请在子类构造器中依次执行super()、this.appendMap(map)、this.check(code,detail
     * @param {string} code 错误代码
     * @param {string} detail  错误详情
     */
    constructor(code = 'A9999', detail = '') {
        super();
        this.code = ''; // 错误代码
        this.msg = '';
        this.detail = '';
        this.map = new Map([
            ['A0001', '未找到相关控件'],
            ['A0002', '输入数据异常'],
            ['A9999', '未知错误'],
        ]);
        this.detail = detail;
    }
    /**
     * 追加错误码Map,用于子类继承基类后,在构造器中执行super()后调用
     * @param map
     */
    appendMap(map) {
        this.map = new Map([...this.map, ...map]);
    }
    /**
     * 检查错误码是否存在,存在提取错误状态码明细并赋值,如果不存在,则为未处理的错误。如果是子类，请在构造器中执行super()、super.appendMap(map)后调用
     * @param code 业务状态码
     * @param detail 错误明细
     */
    check(code = 'A9999', detail = '') {
        this.detail = detail;
        if (this.map.has(code)) {
            this.code = code;
            this.msg = this.map.get(code);
        }
        else {
            this.code = 'A9999'; // 未知错误
            this.msg = this.map.get(code);
        }
    }
    // 获取错误状态码
    getCode() {
        return this.code;
    }
    // 获取错误码描述
    getMsg() {
        return this.msg;
    }
    // 获取错误明细(错误明细是抛出错误时手动传入的)
    getDetail() {
        return this.detail;
    }
    toString() {
        return `code:${this.code}, msg:${this.msg}, detail:${this.detail}`; // 拼接字符串
    }
    /*
    返回异常的错误处理
     */
    static getExceptionHandler(exception) {
        switch (exception) {
            default:
                return (deviceActions_1.LoginAction.reboot);
        }
    }
}
exports.AutoTestException = AutoTestException;
/**
 * 登录中的异常
 */
class LoginException extends AutoTestException {
    constructor(code = 'A9999', detail = '') {
        super(code, detail);
        super.appendMap(new Map([
            ['L0001', '系统登录错误'],
            ['L0002', 'VIP登录错误']
        ]));
        this.check(code, detail);
    }
}
exports.LoginException = LoginException;
class RefunException extends AutoTestException {
    constructor(code = 'A9999', detail = '') {
        super(code, detail);
        super.appendMap(new Map([
            ['R0001', '密码输入错误'],
            ['R0002', '退货失败'],
        ]));
        this.check(code, detail);
    }
}
exports.RefunException = RefunException;
class SearchException extends AutoTestException {
    constructor(code = 'A9999', detail = '') {
        super(code, detail);
        super.appendMap(new Map([
            ['S0001', '查询错误'],
        ]));
        this.check(code, detail);
    }
}
exports.SearchException = SearchException;
class SiftException extends AutoTestException {
    constructor(code = 'A9999', detail = '') {
        super(code, detail);
        super.appendMap(new Map([
            ['S0002', '筛选错误'],
        ]));
        this.check(code, detail);
    }
}
exports.SiftException = SiftException;
class SaleException extends AutoTestException {
    constructor(code = 'A9999', detail = '') {
        super(code, detail);
        super.appendMap(new Map([
            ['S0003', '支付错误'],
            ['S0004', '输入错误'],
            ['S0005', '销售脚本出错'],
            ['S0006', '取消交易出错'],
            ['S0007', '销售方式循环异常'],
        ]));
        this.check(code, detail);
    }
}
exports.SaleException = SaleException;
