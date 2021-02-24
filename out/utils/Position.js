"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
class Position {
}
exports.Position = Position;
// 支付供应商位置，从左往右，从上往下
Position.pay = [
    { x: 484, y: 165 },
    { x: 879, y: 165 },
    { x: 480, y: 311 },
    { x: 879, y: 311 },
    { x: 480, y: 445 },
    { x: 879, y: 453 },
];
// 退出账号关联坐标
Position.exit_account = [
    { x: 1693, y: 230 },
    { x: 948, y: 933 },
    { x: 948, y: 1025 },
];
// 关机按钮坐标
Position.shut_down = { x: 1805, y: 227 };
