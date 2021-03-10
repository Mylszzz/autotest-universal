import {SaleAction_A8, SaleAction_Elo} from "./saleAction";
import {CsvGenerator} from "./csvGenerator";
import {Tools} from "../../utils/tools";
import {LogUtils} from "../../utils/logUtils";
import {SaleDataPreparation, SingleSaleDataPreparation} from "./saleDataPreparation";
import {LoginAction, SaleActionInstance} from "../deviceActions";
import {ScreenShotUtil} from "../../utils/screenShotUtil";

/**
 * 销售测试用例执行的入口类
 * 执行销售测试脚本按照步骤:1.调用salePreparation(), 2. 调用saleMainLoop()
 * 对于拓展的支持:请在saleMainLoop()中加上新的机器类型判断
 * 对于dataPreparationInstance和csvGenerator都是单例模式
 */
export class SaleMainLoop {
    private static dataPreparationInstance: SaleDataPreparation;
    private static csvGenerator: CsvGenerator;
    private static fileName: string = 'unknown';  // 保存测试输出的csv文件名

    private static dataInstance: SingleSaleDataPreparation;  // 单次销售测试用例的数据准备实例
    private static saleInstance: SaleAction_A8 | SaleAction_Elo;  // 单次销售测试用例执行的实例

    private static client: any;
    private static title: string[];
    private static rows: string[];


    private constructor() {
    }

    /**
     * 对于整个销售测试的准备，包括初始化csvGenerator, fileName和对应机器的SaleDataPreparation的实例
     * @param client
     */
    public static async salePreparation(client: any) {
        if (null == this.dataPreparationInstance) {
            this.dataPreparationInstance = SaleDataPreparation.getInstance();
            this.dataPreparationInstance.readFile();
        }


        this.title = this.dataPreparationInstance.getTitle();
        this.rows = this.dataPreparationInstance.getRows();

        this.fileName = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" +
            new Date().getDate() + "-" + Tools.guid() + ".csv";


        if (this.csvGenerator == null) {
            this.csvGenerator = new CsvGenerator(this.dataPreparationInstance.getCsvHeader(), this.fileName, this.rows);
        }

        this.client = client;
        await this.client.setImplicitTimeout(15000);  // 15秒Timeout
    }

    /**
     * 销售测试的主循环
     */
    public static async saleMainLoop() {
        // csv的最后一行会有一个空行，所以少循环一行
        for (let i = 1; i < this.rows.length - 1; i++) {
            this.dataInstance = await new SingleSaleDataPreparation(i, this.title, this.rows[i]);

            LogUtils.saleLog.info('******开始测试第【' + i.toString() + '】单销售测试用例******');

            LogUtils.saleLog.info(this.dataInstance.getSaleData());
            this.saleInstance = SaleActionInstance.getSaleActionInstance(this.dataInstance.getSaleData(),
                this.client, this.csvGenerator);

            try {
                await this.saleInstance.saleAction();
            } catch (e) {
                // let exceptionHandler = AutoTestException.getExceptionHandler(e);
                // await exceptionHandler(this.client);
                await ScreenShotUtil.takeScreenShot(this.client, '第【' + i.toString() + '】单销售测试用例出错');
                /*
                打印错误日志到csv
                 */
                await this.saleInstance.updateAdditionalContent(e.toString().replace(/,/g, ''));
                await this.saleInstance.generateCsv();

                await LoginAction.reboot();
            }
        }
        await this.client.setImplicitTimeout(10000);  // 10秒Timeout
    }

    /**
     * 返回销售输出csv文件名
     */
    public static getFileName(): string {
        return this.fileName;
    }


}
