import {VipLoginAction} from "../deviceActions";
import {AutoTestException} from "../../utils/exceptions";
import {LogUtils} from "../../utils/logUtils";
import {GlobalUtil} from "../../utils/globalUtil";
import {TouchMethod} from "../../utils/touchMethod";
import {InputCoordinates} from "../../static/inputCoordinates";
import {CsvGenerator} from "./csvGenerator";
import {ISaleCsv} from "./csvGenerator";
import {generalSettings} from "../../static/settings";
import {runTimeSettings} from "../../static/settings";
import {ValidateOrderInfo} from "../orderInfo/validateOrderInfo";

const PAYMETHODS_COUNT_PER_PAGE = 6;


/**
 * 销售脚本的抽象类，用于单条销售测试用例的脚本执行
 * 添加新设备请继承此类
 * 实现了ISaleData接口，用于规范单次销售需要的数据
 * 实现了ISaleForCsv接口，用于输出csv文件需要的数据
 */
abstract class SaleAction implements ISaleData, ISaleCsv, IRefundable {
    seqNum: number;
    paymentInfoMap: Map<string, string>;
    saleOptionsInfoMap: Map<string, string>;
    price: number;

    protected supportedPayMethods: string[] = [];  // 该机器支持的支付方式的合集
    protected client: any;
    protected csvGenerator: CsvGenerator;
    protected cancelable: boolean = false;  // 是否取消交易

    saleTime: string = 'unknown';
    saleOrderNo: string = 'unknown';
    priceForCsv: string = 'unknown';

    refundable: boolean = false;  // 是否需要退货
    orderNoForRefund: string = 'unknown';  // 订单号


    protected constructor(saleData: ISaleData, client: any, csvGenerator: CsvGenerator) {
        this.client = client;
        this.seqNum = saleData.seqNum;
        this.paymentInfoMap = saleData.paymentInfoMap;
        this.saleOptionsInfoMap = saleData.saleOptionsInfoMap;
        this.price = saleData.price;
        this.priceForCsv = saleData.price.toString();
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
            if (generalSettings.enableVipLoginModule) {
                await VipLoginAction.vipLogin(this.client);
            }
        } catch (e) {
            console.error(e);
            throw new AutoTestException('A9999', '登录vip失败').toString();
        } finally {
            await this.saleMainScript();
        }
    }

    /**
     * 点击“确定”按键并等待响应
     * @returns {Promise<void>}
     */
    protected async clickOnConfirm() {
        let confirm = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await confirm.click();
        await this.client.pause(runTimeSettings.generalPauseTime);
    }

    /**
     * 从输入vip手机号完成后到销售完成的脚本
     */
    abstract saleMainScript(): any;

    /**
     * 记录销售信息到csv文档
     */
    protected generateCsv(): void {
        let saleDate: ISaleCsv = {
            saleTime: this.saleTime,
            saleOrderNo: this.saleOrderNo,
            priceForCsv: this.priceForCsv
        };
        this.csvGenerator.printCsv(saleDate, this.seqNum);
    }

    /**
     * 判断是否需要退货，并更新到成员变量: isRefundable
     */
    protected processIsRefundable(): void {
        try {
            // @ts-ignore
            this.refundable = (this.saleOptionsInfoMap.get('退货').toUpperCase() == 'Y' && (this.saleOptionsInfoMap.get('取消交易').toUpperCase() == 'N'));
        } catch (e) {
            throw new AutoTestException('A9999', '测试用例输入退货/取消交易字段有误').toString();
        }
    }

    /**
     * 判断是否需要取消交易，并更新到成员变量: isCancelable
     */
    protected processIsCancelable(): void {
        try {
            // @ts-ignore
            this.cancelable = (this.saleOptionsInfoMap.get('取消交易').toUpperCase() == 'Y');
        } catch (e) {
            throw new AutoTestException('A9999', '测试用例输入退货/取消交易字段有误').toString();
        }
    }

    /**
     * 从POS机界面中获取订单号，保存在成员变量saleOrderNo和orderNoForRefund中
     * 二者是相同变量，来自不同数据接口
     * @returns {Promise<void>}
     */
    protected async obtainOrderNo() {
        let orderNoText = await this.client.$('//android.view.View[@content-desc="订单号"]/following-sibling::android.view.View');
        this.saleOrderNo = await orderNoText.getAttribute('content-desc');
        this.orderNoForRefund = this.saleOrderNo;
    }

    getRefundable(): boolean {
        return this.refundable;
    }

    getOrderNo(): string {
        return this.orderNoForRefund;
    }
}


/**
 * A8
 */
class SaleAction_A8 extends SaleAction {

    public constructor(saleData: ISaleData, client: any, csvGenerator: CsvGenerator) {
        super(saleData, client, csvGenerator);

        this.processIsRefundable();  // 判断是否需要退货
        this.processIsCancelable();  // 判断是否需要取消
    }

    /**
     * 登录VIP后开始执行销售流程脚本
     * @returns {Promise<void>}
     */
    async saleMainScript() {
        try {
            LogUtils.saleLog.info("***********开始执行支付脚本***********");
            let configMap: Map<string, string> = GlobalUtil.getConfigMap();
            let toSale = await this.client.$('//android.view.View[@content-desc="货号:' +
                configMap.get('storeNumber') + '"]');
            await toSale.click();
            await this.client.pause(runTimeSettings.generalPauseTime);

            /*
            调用触摸方法输入价格A8输入价格时使用A8通用坐标Map
             */
            let touchFun = TouchMethod.getTouchMethod();
            await touchFun(this.client, this.price.toString(), InputCoordinates.getCoordMap());

            await this.clickOnConfirm();

            //去结算
            let pay = await this.client.$('//android.widget.Button[@content-desc="去结算"]');
            await pay.click();
            await this.client.pause(2000);

            //获取订单号
            await this.obtainOrderNo();

            // 获取支持的支付方式到supportedPayMethods
            await this.processPayMethods();

            let paymentSeq = 1;
            // [支付方式名字, 金额]
            for (let [key, value] of this.paymentInfoMap) {
                await this.payMethodLoop(key, value, paymentSeq == this.paymentInfoMap.size);
                if (this.cancelable) {
                    break;
                }
                paymentSeq++;
            }

            this.saleTime = new Date().toLocaleDateString();

            /*
            销售完成，打印csv
             */
            LogUtils.saleLog.info('******销售完成，打印输出到csv文件******');
            this.generateCsv();
            LogUtils.saleLog.info('**********************************');

        } catch (e) {
            LogUtils.saleLog.error(e);  // TODO

        }
    }

    /**
     * 所有使用了的支付方式的循环
     * 需要判断支付方式是否在当前页面上
     * @returns {Promise<void>}
     */
    private async payMethodLoop(key: string, value: string, isLast: boolean) {
        let index = this.supportedPayMethods.indexOf(key);  // 需要使用的支付方式在支付列表的第几个
        let payMethodBtn: any;
        let scroll_times: number = 0;
        try {
            if (index == -1) {
                throw new AutoTestException('A9999', '该支付方式不存在');
            } else if (index + 1 <= PAYMETHODS_COUNT_PER_PAGE) {
                payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' + key + '"]');
            } else {
                scroll_times = Math.floor((index + 1) / PAYMETHODS_COUNT_PER_PAGE);
                await this.scrollDown(scroll_times);
                payMethodBtn = await this.client.$('//android.widget.Button[@content-desc="' +
                    this.supportedPayMethods[(index % PAYMETHODS_COUNT_PER_PAGE)] + '"]');
            }
            LogUtils.saleLog.info(key + ": 需要支付" + value + "元!");

            await this.clickOnPayMethod(payMethodBtn, value);
            await this.client.pause(runTimeSettings.generalPauseTime);

            await this.scrollUp(scroll_times);  // 滑回去

            // TODO: 只做了在第一种支付方式完成后取消
            if (this.cancelable) {
                await this.cancelSale();
            } else if (isLast) {
                /*
                最后一单应该打印销售信息csv
                 */
                LogUtils.saleLog.info('*******打印POS机显示的销售信息********');
                await ValidateOrderInfo.saveOrderInfoToCsv(this.client);
                LogUtils.saleLog.info('********打印POS机销售信息完成*********');

                await this.client.pause(runTimeSettings.longPauseTime);  // 打印订单
                await this.clickOnConfirm();

                await this.client.pause(runTimeSettings.longPauseTime);  // 打印订单

                //完成
                let complete = await this.client.$('//android.widget.Button[@content-desc="完成"]');
                await complete.click();
            }
        } catch (e) {
            LogUtils.saleLog.error(e.toString());
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
            await this.client.pause(runTimeSettings.generalPauseTime);
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
     * 获得支持的支付方式的名字
     */
    async processPayMethods() {
        let num: number = 0;
        let tabName = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=1]');
        let firstName = await tabName.getAttribute('content-desc');
        let name = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=last()]');
        let lastName = await name.getAttribute('content-desc');
        while (firstName !== lastName) {
            num++;
            let tabName = await this.client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[2]/android.view.View[10]/android.widget.Button[position()=' + num + ']');
            firstName = await tabName.getAttribute("content-desc");
            this.supportedPayMethods.push(firstName);
        }
    }

    /**
     * 向下滑动
     * TODO: 坐标要保存在静态库中
     * @returns {Promise<void>}
     */
    private async scrollDown(times: number) {
        for (let i = 0; i < times; i++) {
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
            await this.client.pause(runTimeSettings.shortPauseTime);
        }
    }

    /**
     * 向上滑动
     * @returns {Promise<void>}
     */
    private async scrollUp(times: number) {
        for (let i = 0; i < times; i++) {
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
            await this.client.pause(runTimeSettings.shortPauseTime);
        }
    }

    /**
     * 取消交易的脚本
     * @returns {Promise<void>}
     */
    private async cancelSale() {
        try {
            let cancel = await this.client.$('//android.widget.Button[@content-desc="取消交易"]');
            await cancel.click();
            await this.client.pause(runTimeSettings.generalPauseTime);
            let confirm = await this.client.$('//android.widget.Button[@content-desc="确定"]');
            await confirm.click();
            await this.client.pause(runTimeSettings.generalPauseTime);
            let confirm2 = await this.client.$('//android.widget.Button[@content-desc="确认"]');
            await confirm2.click();
            await this.client.pause(runTimeSettings.longPauseTime);
            LogUtils.saleLog.info('**************已取消交易**************');
        } catch (e) {
            LogUtils.saleLog.error(new AutoTestException('A9999', '取消交易失败').toString());
        }
    }
}


/**
 * Elo
 */
class SaleAction_Elo extends SaleAction {

    public constructor(saleData: ISaleData, client: any, csvGenerator: CsvGenerator) {
        super(saleData, client, csvGenerator);

        this.processIsRefundable();  // 判断是否需要退货
        this.processIsCancelable();  // 判断是否需要取消
    }

    /**
     * 登录VIP后开始执行销售流程脚本
     * @returns {Promise<void>}
     */
    async saleMainScript() {
        try {
            LogUtils.saleLog.info("***********开始执行支付脚本***********");
            let sale = await this.client.$('//android.widget.Button[@content-desc="去销售"]');
            await sale.click();
            // await this.client.pause(runTimeSettings.generalPauseTime);

            // 缓冲
            await this.client.$('//android.widget.Button[@content-desc="search"]');

            /*
            调用触摸方法输入价格,Elo输入价格时使用Elo通用坐标Map
             */
            let touchFun = TouchMethod.getTouchMethod();
            await touchFun(this.client, this.price.toString(), InputCoordinates.getCoordMap());

            // 确定
            await this.clickOnConfirm();

            // 去结算
            let settlement = await this.client.$('//android.widget.Button[@content-desc="去结算"]');
            await settlement.click();

            // 获取订单号
            await this.obtainOrderNo();

            // 获取支持的支付方式
            // 获取支持的支付方式到supportedPayMethods
            await this.processPayMethods();

            let paymentSeq = 1;
            // [支付方式名字, 金额]
            for (let [key, value] of this.paymentInfoMap) {
                await this.payMethodLoop(key, value, paymentSeq == this.paymentInfoMap.size);
                if (this.cancelable) {
                    break;
                }
                paymentSeq++;
            }

            this.saleTime = new Date().toLocaleDateString();

            /*
            销售完成，打印csv
             */
            LogUtils.saleLog.info('******销售完成，打印输出到csv文件******');
            this.generateCsv();
            LogUtils.saleLog.info('**********************************');


        } catch (e) {

        }
    }

    /**
     * 所有使用了的支付方式的循环
     * 需要判断支付方式是否在当前页面上
     * @returns {Promise<void>}
     */
    private async payMethodLoop(key: string, value: string, isLast: boolean) {
        LogUtils.saleLog.warn(this.supportedPayMethods);
        let index = this.supportedPayMethods.indexOf(key);  // 需要使用的支付方式在支付列表的第几个
        let payMethodBtn: any;
        let scroll_times: number = 0;
        let editTextTempList = await this.client.$$('//android.view.View[@resource-id="scrollMe2"]/android.view.EditText');

        try {
            if (index == -1) {
                throw new AutoTestException('A9999', '该支付方式不存在');
            } else if (index/2 + 1 <= PAYMETHODS_COUNT_PER_PAGE) {
                payMethodBtn = editTextTempList[index/2];
            } else {
                scroll_times = Math.floor((index/2 + 1) / PAYMETHODS_COUNT_PER_PAGE);
                await this.scrollDown(scroll_times);
                payMethodBtn = editTextTempList[index/2 % PAYMETHODS_COUNT_PER_PAGE];
            }
            LogUtils.saleLog.info(key + ": 需要支付" + value + "元!");

            let editText0 = editTextTempList[0];
            await editText0.click();
            await this.client.pause(2000);

            await this.clickOnPayMethod(payMethodBtn, value);
            await this.client.pause(runTimeSettings.generalPauseTime);

            await this.scrollUp(scroll_times);  // 滑回去

            // TODO
            if (this.cancelable) {
                // await this.cancelSale();
            } else if (isLast) {
                /*
                最后一单应该打印销售信息csv TODO
                 */
                // LogUtils.saleLog.info('*******打印POS机显示的销售信息********');
                // await ValidateOrderInfo.saveOrderInfoToCsv(this.client);
                // LogUtils.saleLog.info('********打印POS机销售信息完成*********');

                await this.client.pause(runTimeSettings.longPauseTime);  // 打印订单

                await this.client.pause(runTimeSettings.longPauseTime);  // 打印订单

                //完成
                let complete = await this.client.$('//android.widget.Button[@content-desc="完成"]');
                await complete.click();
            }
        } catch (e) {
            LogUtils.saleLog.error(e.toString());
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
            await this.client.pause(runTimeSettings.generalPauseTime);
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

    private async processPayMethods() {
        let tempViewList = this.client.$$('//android.view.View[@resource-id="scrollMe2"]/android.view.View');
        for (let i = 0; i < tempViewList.length; i += 2) {
            this.supportedPayMethods.push(tempViewList[i].getAttribute('content-desc'));
        }

        LogUtils.saleLog.warn(this.supportedPayMethods);
    }

    /**
     * 向下滑动
     * TODO: 坐标要保存在静态库中
     * @returns {Promise<void>}
     */
    private async scrollDown(times: number) {
        let downArrow = await this.client.$('//android.widget.Button[@content-desc="arrow dropdown"]');
        await downArrow.click();
        await this.client.pause(1000);
    }

    /**
     * 向上滑动
     * @returns {Promise<void>}
     */
    private async scrollUp(times: number) {
        let downUp = await this.client.$('//android.widget.Button[@content-desc="arrow dropup"]');
        await downUp.click();
        await this.client.pause(1000);
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


/**
 * 销售中的退货接口
 * 用于支持订单退货
 */
interface IRefundable {
    refundable: boolean;  // 是否需要退货
    orderNoForRefund: string;  // 订单号

    getRefundable(): boolean;  //
    getOrderNo(): string;  // 获得订单号，用于退货
}

export {ISaleData, SaleAction_A8, SaleAction_Elo}
