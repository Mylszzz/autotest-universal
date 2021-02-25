"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleMainLoop = void 0;
const saleAction_1 = require("./saleAction");
const deviceName_1 = require("../../static/deviceName");
const csvGenerator_1 = require("./csvGenerator");
const tools_1 = require("../../utils/tools");
class SaleMainLoop {
    constructor() { }
    static async salePreparation(client) {
        if (this.csvGenerator == null) {
            this.csvGenerator = new csvGenerator_1.CsvGenerator(this.fileName);
        }
        if (this.fileName = '') {
            this.fileName = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" +
                new Date().getDate() + "-" + tools_1.Tools.guid() + ".csv";
        }
        if (deviceName_1.DeviceName.getDeviceName() == 'a8' && this.instance == null) {
            this.instance = new saleAction_1.SaleAction_A8(client, this.csvGenerator);
        }
        else if (deviceName_1.DeviceName.getDeviceName() == 'elo' && this.instance == null) {
            this.instance = new saleAction_1.SaleAction_Elo(client, this.csvGenerator);
        }
    }
    saleMainLoop() {
    }
}
exports.SaleMainLoop = SaleMainLoop;
SaleMainLoop.fileName = ''; // 保存测试输出的csv文件名
