import {VipLoginAction} from "../deviceActions";
import {AutoTestException} from "../../utils/exceptions";
import {LogUtils} from "../../utils/logUtils";
import {GlobalUtil} from "../../utils/globalUtil";
import {TouchMethod} from "../../utils/touchMethod";
import {InputCoordinates} from "../../static/inputCoordinates";
import {CsvGenerator} from "./csvGenerator";
import {PayMethods} from "./payMethods";

const MAX_SCROLL_TIMES_A8 = 1;  // TODO: Make it global
const PAYMETHODS_COUNT_PER_PAGE = 6;


/**
 * 销售脚本的抽象类，用于单条销售测试用例的脚本执行
 * 添加新设备是继承此类
 * 实现了ISaleData接口，用于规范单次销售需要的数据
 */
abstract class SaleAction implements ISaleData {
    seqNum: number;
    paymentInfoMap: Map<string, string>;
    saleOptionsInfoMap: Map<string, string>;
    price: number;
    supportedPayMethods:string[] = [];

    client: any;
    csvGenerator: CsvGenerator;


    protected constructor(saleData: ISaleData, client: any, csvGenerator: CsvGenerator) {
        this.client = client;
        this.seqNum = saleData.seqNum;
        this.paymentInfoMap = saleData.paymentInfoMap;
        this.saleOptionsInfoMap = saleData.saleOptionsInfoMap;
        this.price = saleData.price;
        this.csvGenerator = csvGenerator;
    }

    /**
     * 销售脚本,先登录vip
     * 无论成功与否应调用后面的销售脚本 saleActionStep2()
     * TODO：如果号码未注册
     * @returns {Promise<void>}
     */
    public async saleAction() {
        try {
            await VipLoginAction.vipLogin(this.client);
        } catch (e) {
            console.error(e);
            throw new AutoTestException('A9999', '登录vip失败').toString();
        } finally {
            await this.saleActionStep2();
        }
    }

    /**
     * 点击“确定”按键并等待响应
     * @returns {Promise<void>}
     */
    protected async clickOnConfirm() {
        let confirm = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await confirm.click();
        await this.client.pause(1000);
    }

    /**
     * 从输入vip手机号完成后到销售完成的脚本
     */
    abstract saleActionStep2(): any;

    /**
     * 记录销售信息到csv文档
     */
    abstract generateCsv(): void;
}


/**
 * A8
 */
class SaleAction_A8 extends SaleAction {

    public constructor(saleData: ISaleData, client: any, csvGenerator: CsvGenerator) {
        super(saleData, client, csvGenerator);
    }

    /**
     * 登录VIP后开始执行销售流程脚本
     * @returns {Promise<void>}
     */
    async saleActionStep2() {
        try {
            LogUtils.saleLog.info("********开始执行支付脚本********");
            let configMap: Map<string, string> = GlobalUtil.getConfigMap();
            let toSale = await this.client.$('//android.view.View[@content-desc="货号:' +
                configMap.get('storeNumber') + '"]');
            await toSale.click();
            await this.client.pause(1000);

            // 调用触摸方法输入价格
            let touchFun = TouchMethod.getTouchMethod();
            // A8输入价格时使用A8通用坐标Map
            await touchFun(this.client, this.price.toString(), InputCoordinates.getCoordMap());

            await this.clickOnConfirm();

            //去结算
            let pay = await this.client.$('//android.widget.Button[@content-desc="去结算"]');
            await pay.click();
            await this.client.pause(2000);

            this.supportedPayMethods = await PayMethods.getSupportedPayMethods(this.client);

            await this.payMethodLoop();

            // 打印订单
            await this.client.pause(8000);
            let confirm2 = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await confirm2.click();
            // 打印订单
            await this.client.pause(8000);
            //完成
            let complete = await this.client.$('//android.widget.Button[@content-desc="完成"]');
            await complete.click();
        } catch (e) {
            LogUtils.saleLog.error(e);  // TODO

        }
    }

    /**
     * 所有支付方式的循环
     * @returns {Promise<void>}
     */
    private async payMethodLoop() {

        // [支付方式名字, 金额]
        for (let [key, value] of this.paymentInfoMap) {
            let index = this.supportedPayMethods.indexOf(key);  // 需要使用的支付方式在支付列表的第几个
            let payMethodBtn: any;
            let scroll_times: number = 0;
            try {
                if (index == -1) {
                    throw new AutoTestException('A9999', '该支付方式不存在');
                } else if (index + 1 <= PAYMETHODS_COUNT_PER_PAGE) {
                    payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' + key + '"]');
                } else {
                    scroll_times = Math.floor((index + 1)/PAYMETHODS_COUNT_PER_PAGE);
                    await this.scrollDown(scroll_times);
                    payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' +
                        this.supportedPayMethods[(index % PAYMETHODS_COUNT_PER_PAGE)] + '"]');
                }
                LogUtils.saleLog.info(key + ": 需要支付" + value + "元!");

                await this.clickOnPayMethod(payMethodBtn, value);
                await this.client.pause(1000);

                await this.scrollUp(scroll_times);  // 滑回去

            } catch (e) {
                LogUtils.saleLog.error(e.toString());
            }
        }
    }

    /**
     * 点击支付方式, 若支付方式不在当前页则调用滑动方法找到该支付方式
     * @param payMethodBtn: 该支付方式按键的实例
     * @param {string} amount: 该支付方式的金额
     * @returns {Promise<void>}
     */
    private async clickOnPayMethod(payMethodBtn: any, amount: string) {
        try {
            await payMethodBtn.click();
            await this.client.pause(1000);
            /*
            如果可以点击确定键，则需要输入金额并点击
             */

            let touchMethod = TouchMethod.getTouchMethod();
            await touchMethod(this.client, amount, InputCoordinates.getCoordMap());

            await this.clickOnConfirm();

        } catch (e) {
            LogUtils.saleLog.error(e.toString());
            LogUtils.saleLog.warn('支付失败');
        }
    }


    /**
     * 向下滑动
     * @returns {Promise<void>}
     */
    private async scrollDown(times: number) {
        for (let i=0; i<times; i++) {
            LogUtils.saleLog.info('向下滑动一次！');
            await this.client.touchAction([
                {action: 'press', x: 354, y: 900},
                {action: 'moveTo', x: 354, y: 687},
                {action: 'release'}
            ]);
            await this.client.touchAction([
                {action: 'press', x: 354, y: 900},
                {action: 'moveTo', x: 354, y: 687},
                {action: 'release'}
            ]);
            await this.client.pause(500);
        }
    }

    /**
     * 向上滑动
     * @returns {Promise<void>}
     */
    private async scrollUp(times: number) {
        for (let i=0; i<times; i++) {
            LogUtils.saleLog.info('向下滑动一次！');
            await this.client.touchAction([
                {action: 'press', x: 354, y: 687},
                {action: 'moveTo', x: 354, y: 900},
                {action: 'release'}
            ]);
            await this.client.touchAction([
                {action: 'press', x: 354, y: 687},
                {action: 'moveTo', x: 354, y: 900},
                {action: 'release'}
            ]);
            await this.client.pause(500);
        }
    }

    public generateCsv() {
        // this.csvGenerator.printCsv(, this.seqNum);
    }
}


/**
 * Elo
 */
class SaleAction_Elo extends SaleAction {

    public constructor(saleData: ISaleData, client: any, csvGenerator: CsvGenerator) {
        super(saleData, client, csvGenerator);
    }

    public async saleActionStep2() {

    }

    /**
     * 所有支付方式的循环
     * @returns {Promise<void>}
     */
    private async payMethodLoop() {
        let scrollTimes: number = 0;  // 已经滑动的次数
        // [支付方式名字, 金额]
        for (let [key, value] of this.paymentInfoMap) {
            let payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' + key + '"]');
            LogUtils.saleLog.info(key + ": 需要支付" + value + "元!");

            await this.clickOnPayMethod(payMethodBtn, scrollTimes, value);
            await this.client.pause(1000);

            scrollTimes = 0;
        }
    }

    private async clickOnPayMethod(payMethodBtn: any, scrollTimes: number, amount: string) {
        try {
            await payMethodBtn.click();
            await this.client.pause(1000);
            /*
            如果可以点击确定键，则需要输入金额并点击
             */
            if (await this.payMethodDisplayed()) {
                let touchMethod = TouchMethod.getTouchMethod();
                await touchMethod(this.client, amount, InputCoordinates.getCoordMap());

                await this.clickOnConfirm();
            } else if (scrollTimes < MAX_SCROLL_TIMES_A8) {
                LogUtils.saleLog.info('支付方式不在本页');
                await this.scrollDown();

                scrollTimes++;
                await this.clickOnPayMethod(payMethodBtn, scrollTimes, amount);
            } else {
                throw new AutoTestException('A9999');   // TODO
            }
        } catch (e) {
            LogUtils.saleLog.error(e.toString());
            LogUtils.saleLog.warn('未找到支付方式');
        }
    }

    /**
     * 通过判断点击后是否出现'确定'按钮
     * 判断该支付方式是否在页面上显示
     * @returns {boolean}
     */
    private async payMethodDisplayed() {
        this.client.setImplicitTimeout(500);
        let confirmBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        let isDisplayed = await confirmBtn.isDisplayed();
        this.client.setImplicitTimeout(10000);
        return isDisplayed;
    }

    /**
     * 向下滑动
     * @returns {Promise<void>}
     */
    private async scrollDown() {
        LogUtils.saleLog.info('向下滑动一次！');

    }

    public generateCsv() {
        // this.csvGenerator.printCsv(, this.seqNum);
    }
}

/**
 * 单次销售活动所需的数据
 */
interface ISaleData {
    seqNum: number;  // 序号（全部测试用例中的第几单)
    paymentInfoMap: Map<string, string>;  // Example: {'现金'=>'2','春风里礼券'=>'1'}
    saleOptionsInfoMap: Map<string, string>;  // Example: {'取消交易'=>'N','退货'=>'N'}
    price: number;  // 总价
}

export {ISaleData, SaleAction_A8, SaleAction_Elo}
