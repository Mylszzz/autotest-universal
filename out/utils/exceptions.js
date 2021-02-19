"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicException = void 0;
const ExceptionCode = {
    LOGIN_FAILURE: 'A0001',
    UNKNOWN_EXCEPTION: 'A9999',
};
class BasicException extends Error {
    constructor(code = 'A9999', detail = '') {
        super();
        this.code = '';
        this.msg = '';
        this.detail = '';
        this.map = new Map();
        this.detail = detail;
    }
    // 获取错误状态码
    getCode() {
        return this.code;
    }
    //获取错误码中文描述
    getMsg() {
        return this.msg;
    }
    //获取错误明细(错误明细是抛出错误时手动传入的)
    getDetail() {
        return this.detail;
    }
    toString() {
        return this.getCode();
    }
}
exports.BasicException = BasicException;
