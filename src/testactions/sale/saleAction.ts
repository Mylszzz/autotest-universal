import {VipLoginAction} from "../deviceActions";
import {BasicException} from "../../utils/exceptions";
import {LogUtils} from "../../utils/logUtils";
import {GlobalUtil} from "../../utils/globalUtil";
import {TouchMethod} from "../../utils/touchMethod";
import {InputCoordinates} from "../../static/inputCoordinates";
import {CsvGenerator} from "./csvGenerator";

abstract class SaleAction implements ISaleData {
    seqNum:number;
    paymentInfoMap:Map<string, string>;
    saleOptionsInfoMap:Map<string, string>;
    price:string;

    client:any;
    csvGenerator:CsvGenerator;


    protected constructor(saleData:ISaleData, client:any, csvGenerator:CsvGenerator) {
        this.client = client;
        this.seqNum = saleData.seqNum;
        this.paymentInfoMap = saleData.paymentInfoMap;
        this.saleOptionsInfoMap = saleData.saleOptionsInfoMap;
        this.price = saleData.price;
        this.csvGenerator = csvGenerator;
    }

    /**
     * 销售脚本
     * @returns {Promise<void>}
     */
    public async saleAction() {
        LogUtils.saleLog.info('====开始测试第【' + this.seqNum.toString() +'】单销售测试用例');
        try {
            await VipLoginAction.vipLogin(this.client);
        } catch (e) {
            throw new BasicException('A9999', '登录vip失败').toString();
        }
        await this.saleActionStep2();
    }

    /**
     * 从输入vip手机号完成后到销售完成的脚本
     */
    abstract saleActionStep2():any;

    /**
     * 记录销售信息到csv文档
     */
    abstract generateCsv():void;
}

/**
 * A8
 */
export class SaleAction_A8 extends SaleAction {

    public constructor(saleData:ISaleData, client:any, csvGenerator:CsvGenerator){
        super(saleData,client, csvGenerator);
    }

    async saleActionStep2() {
        try {
            let configMap:Map = GlobalUtil.getConfigMap();
            let toSale = await this.client.$('//android.view.View[@content-desc="货号:'+
                configMap.get('storeNumber')+'"]');
            await toSale.click();
            await this.client.pause(1000);

            // 调用触摸方法输入价格
            let touchFun = TouchMethod.getTouchMethod();
            // A8输入价格时使用A8通用坐标Map
            await touchFun(this.client, this.price, InputCoordinates.getCoordMap());
            await this.client.pause(2000);
            //去结算
            let pay = await this.client.$('//android.widget.Button[@content-desc="去结算"]');
            await pay.click();
            await this.client.pause(2000);
            //选择现金支付
            let cash = await this.client.$('//android.widget.Button[@content-desc="现金"]');
            await cash.click();
            await this.client.pause(1000);
            //确定
            let confirm2 = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await this.client.pause(1000);
            await confirm2.click();
            //打印订单
            await this.client.pause(10000);
            //完成
            let complete = await this.client.$('//android.widget.Button[@content-desc="完成"]');
            await complete.click();
        }catch (e) {

        }
    }

    public generateCsv() {
        // this.csvGenerator.printCsv(, this.seqNum);
    }
}

/**
 * Elo
 */
export class SaleAction_Elo extends SaleAction {

    public constructor(saleData:ISaleData, client:any, csvGenerator:CsvGenerator){
        super(saleData,client, csvGenerator);
    }

    public async saleActionStep2() {

    }

    public generateCsv() {
        // this.csvGenerator.printCsv(, this.seqNum);
    }
}

/**
 * 单次销售活动所需的数据
 */
export interface ISaleData {
    seqNum:number;  // 序号（全部测试用例中的第几单)
    paymentInfoMap:Map<string, string>;  // Example: {'现金'=>'2','春风里礼券'=>'1'}
    saleOptionsInfoMap:Map<string, string>;  // Example: {'取消交易'=>'N','退货'=>'N'}
    price:string;  // 总价
}
