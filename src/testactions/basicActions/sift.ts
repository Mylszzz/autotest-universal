import {Search} from "./search";
import {DateUtil} from "../../utils/dateUtil";
import {LogUtils} from "../../utils/logUtils";
import * as wdio from "webdriverio";
import {ButtonXPaths_A8, ButtonXPaths_Elo} from "../../static/buttonXPaths";
import {CommonXpath} from "../../static/commonXpath";

/**
 * 选择筛选条件的基类
 */
export class Sift {
    client: wdio.BrowserObject;
    funnelBtnXPath: string = ButtonXPaths_A8.FUNNEL;  //

    public constructor(client: wdio.BrowserObject, funnelBtnXPath?: string) {
        this.client = client;
        if (funnelBtnXPath != undefined) {  //
            this.funnelBtnXPath = funnelBtnXPath;
        }
    }

    /**
     * 选择筛选条件
     * @param date 日期
     * @param orderType 订单类型
     * @param orderState 订单状态
     */
    public async siftType(date: string, orderType: any, orderState: any) {
        await new Search(this.client).search();
        //点击筛选
        let ccBtn = await this.client.$(this.funnelBtnXPath);
        await ccBtn.click();
        //选择日期
        await DateUtil.selectDate(this.client, date);
        //选择条件
        // 清空默认的订单类型
        let chooseAll_1 = await this.client.$(CommonXpath.CHECKBOX1);
        await chooseAll_1.click();
        await chooseAll_1.click();
        // 清空默认的订单状态
        let chooseAll_2 = await this.client.$(CommonXpath.CHECKBOX2);
        await chooseAll_2.click();
        await chooseAll_2.click();

        // 点击选择订单类型
        for (let i = 0; i < orderType.length; i++) {
            let oneOfOrderType = await this.client.$('//android.widget.CheckBox[@content-desc="' + orderType[i] + '"]');
            await oneOfOrderType.click();
        }
        // 点击选择订单状态
        for (let i = 0; i < orderState.length; i++) {
            let oneOfOrderState = await this.client.$('//android.widget.CheckBox[@content-desc="' + orderState[i] + '"]');
            await oneOfOrderState.click();
        }
        //完成
        let ok = await this.client.$(CommonXpath.OK);
        await ok.click();
    }

    /**
     * 重置筛选条件
     *
     */
    public async refSift() {
        await new Search(this.client).search();
        //点击筛选
        let ccBtn = await this.client.$(this.funnelBtnXPath);
        await ccBtn.click();
        //重置
        let ok = await this.client.$(CommonXpath.RESETTING);
        await ok.click();
        //重置后的条件判断，是否符合条件
        let generalSalesOrderCheck = await this.client.$('//android.widget.CheckBox[@content-desc="一般销售单"]');
        let isGeneralSalesOrderCheck = await generalSalesOrderCheck.getAttribute('checked');
        if (isGeneralSalesOrderCheck) {
            let completed = await this.client.$('//android.widget.CheckBox[@content-desc="已完成"]');
            let isCompleted = await completed.getAttribute('checked');
            if (isCompleted) {
                let complete = await this.client.$(CommonXpath.OK);
                await complete.click();
                LogUtils.search.info("=====订单查询--》重置筛选条件符合预期==");
            } else {
                LogUtils.search.info("=====订单查询--》重置筛选条件不符预期==");
            }
        } else {
            LogUtils.search.info("=====订单查询--》重置筛选条件不符预期==");
        }
    }
}


/**
 * A8直接继承
 */
export class Sift_A8 extends Sift {

}


/**
 * Elo需要更改控件
 */
export class Sift_elo extends Sift {
    public constructor(client: wdio.BrowserObject, funnelBtnXPath = ButtonXPaths_Elo.FUNNEL) {
        super(client, funnelBtnXPath);
    }
}
