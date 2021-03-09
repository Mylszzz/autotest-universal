"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleMainLoop = void 0;
const csvGenerator_1 = require("./csvGenerator");
const tools_1 = require("../../utils/tools");
const logUtils_1 = require("../../utils/logUtils");
const saleDataPreparation_1 = require("./saleDataPreparation");
const deviceActions_1 = require("../deviceActions");
const screenShotUtil_1 = require("../../utils/screenShotUtil");
/**
 * 销售测试用例执行的入口类
 * 执行销售测试脚本按照步骤:1.调用salePreparation(), 2. 调用saleMainLoop()
 * 对于拓展的支持:请在saleMainLoop()中加上新的机器类型判断
 * 对于dataPreparationInstance和csvGenerator都是单例模式
 */
class SaleMainLoop {
    constructor() {
    }
    /**
     * 对于整个销售测试的准备，包括初始化csvGenerator, fileName和对应机器的SaleDataPreparation的实例
     * @param client
     */
    static async salePreparation(client) {
        if (null == this.dataPreparationInstance) {
            this.dataPreparationInstance = saleDataPreparation_1.SaleDataPreparation.getInstance();
            this.dataPreparationInstance.readFile();
        }
        this.title = this.dataPreparationInstance.getTitle();
        this.rows = this.dataPreparationInstance.getRows();
        this.fileName = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" +
            new Date().getDate() + "-" + tools_1.Tools.guid() + ".csv";
        if (this.csvGenerator == null) {
            this.csvGenerator = new csvGenerator_1.CsvGenerator(this.dataPreparationInstance.getCsvHeader(), this.fileName, this.rows);
        }
        this.client = client;
        await this.client.setImplicitTimeout(15000); // 15秒Timeout
    }
    /**
     * 销售测试的主循环
     */
    static async saleMainLoop() {
        // csv的最后一行会有一个空行，所以少循环一行
        for (let i = 1; i < this.rows.length - 1; i++) {
            this.dataInstance = await new saleDataPreparation_1.SingleSaleDataPreparation(i, this.title, this.rows[i]);
            logUtils_1.LogUtils.saleLog.info('******开始测试第【' + i.toString() + '】单销售测试用例******');
            logUtils_1.LogUtils.saleLog.info(this.dataInstance.getSaleData());
            this.saleInstance = deviceActions_1.SaleActionInstance.getSaleActionInstance(this.dataInstance.getSaleData(), this.client, this.csvGenerator);
            try {
                await this.saleInstance.saleAction();
            }
            catch (e) {
                // let exceptionHandler = AutoTestException.getExceptionHandler(e);
                // await exceptionHandler(this.client);
                await screenShotUtil_1.ScreenShotUtil.takeScreenShot(this.client, '第【' + i.toString() + '】单销售测试用例出错');
                await deviceActions_1.LoginAction.reboot();
            }
        }
        await this.client.setImplicitTimeout(10000); // 10秒Timeout
    }
    /**
     * 返回销售输出csv文件名
     */
    static getFileName() {
        return this.fileName;
    }
}
exports.SaleMainLoop = SaleMainLoop;
SaleMainLoop.fileName = 'unknown'; // 保存测试输出的csv文件名
