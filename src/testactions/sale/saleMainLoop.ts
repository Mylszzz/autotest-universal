import {SaleAction_A8, SaleAction_Elo} from "./saleAction";
import {CsvGenerator} from "./csvGenerator";
import {Tools} from "../../utils/tools";
import {LogUtils} from "../../utils/logUtils";
import {SaleDataPreparation, SingleSaleDataPreparation} from "./saleDataPreparation";
import {SaleActionInstance} from "../deviceActions";

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

            await this.saleInstance.saleAction();
        }
    }


}