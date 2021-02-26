"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleMainLoop = void 0;
const saleAction_1 = require("./saleAction");
const deviceName_1 = require("../../static/deviceName");
const csvGenerator_1 = require("./csvGenerator");
const tools_1 = require("../../utils/tools");
const logUtils_1 = require("../../utils/logUtils");
const saleDataPreparation_1 = require("./saleDataPreparation");
/**
 * 销售测试用例执行的入口类
 * 执行销售测试脚本按照步骤:1.调用salePreparation(), 2. 调用saleMainLoop()
 * 对于拓展的支持:请在saleMainLoop()中加上新的机器类型判断
 * 对于dataPreparationInstance和csvGenerator都是单例模式
 */
class SaleMainLoop {
    constructor() { }
    /**
     * 对于整个销售测试的准备，包括初始化csvGenerator, fileName和对应机器的SaleDataPreparation的实例
     * @param client
     */
    static salePreparation(client) {
        if (this.dataPreparationInstance == null) {
            this.dataPreparationInstance = new saleDataPreparation_1.SaleDataPreparation();
            this.dataPreparationInstance.readFile();
        }
        if (this.csvGenerator == null) {
            this.csvGenerator = new csvGenerator_1.CsvGenerator(this.dataPreparationInstance.getCsvHeader(), this.fileName);
        }
        if (this.fileName = '') {
            this.fileName = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" +
                new Date().getDate() + "-" + tools_1.Tools.guid() + ".csv";
        }
        this.title = this.dataPreparationInstance.getTitle();
        this.rows = this.dataPreparationInstance.getRows();
    }
    /**
     * 销售测试的主循环
     */
    static async saleMainLoop() {
        // 最后一行会有一个空行
        for (let i = 1; i <= this.rows.length - 1; i++) {
            this.dataInstance = await new saleDataPreparation_1.SingleSaleDataPreparation(i, this.title, this.rows[i]);
            if (deviceName_1.DeviceName.getDeviceName() == 'a8') {
                logUtils_1.LogUtils.saleLog.info(this.dataInstance.getSaleData());
                this.saleInstance = await new saleAction_1.SaleAction_A8(this.dataInstance.getSaleData(), this.client, this.csvGenerator);
            }
            else if (deviceName_1.DeviceName.getDeviceName() == 'elo') {
                this.saleInstance = await new saleAction_1.SaleAction_Elo(this.dataInstance.getSaleData(), this.client, this.csvGenerator);
            }
            await this.saleInstance.saleAction();
        }
    }
}
exports.SaleMainLoop = SaleMainLoop;
SaleMainLoop.fileName = ''; // 保存测试输出的csv文件名
