import {DeviceName} from "../static/deviceName";
import {Screen} from "./screen";
import {Search} from "./search";
import * as wdio from "webdriverio";
import {ButtonXPaths_A8,ButtonXPaths_Elo} from "../static/buttonXPaths";
import {CommonXpath} from "../static/commonXpath";

/**
 * 取消退货
 */

export class CancelReturns {
    client:wdio.BrowserObject;
    backBtnXPath:string = ButtonXPaths_A8.BACK;  //

    protected constructor (client:wdio.BrowserObject, backBtnXPath?:string) {
        this.client = client;
        if (backBtnXPath != undefined) {  //
            this.backBtnXPath = backBtnXPath;
        }
    }

    /**
     * orderType:any ：选择订单类型
     * orderState:any ：选择订单状态
     */
    public async cancelReturns(){
        await new Search(this.client).search();
         const orderType:any = ['一般销售单'];
         const orderState:any = ['已完成'];
        await new Screen(this.client).screenNo(new Date().toLocaleDateString(),orderType, orderState);
         await this.client.pause(3000);
        let close = await this.client.$(CommonXpath.CLOSE);
        await close.click();
        let sel = await this.client.$(CommonXpath.ORDER);
        await sel.click();
        let returns = await this.client.$(CommonXpath.RETURNS);
        await returns.click();
        let cancel = await this.client.$(CommonXpath.CANCEL);
        await cancel.click();
        let back = await this.client.$(this.backBtnXPath);
        await back.click();
    }

}

/**
 * a8 直接继承
 */
export class CancelReturns_A8 extends CancelReturns {
    private static instance:CancelReturns;

    public static getInstance(client:wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new CancelReturns_A8(client);
        }
        return this.instance;
    }
}

/**
 * elo 需要更改xpath控件
 */
export class CancelReturns_ELO extends CancelReturns {
    private static instance:CancelReturns_ELO;

    private constructor (client:wdio.BrowserObject, backBtnXPath = ButtonXPaths_Elo.BACK
                       ) {
        super(client, backBtnXPath);
    }

    public static getInstance(client:wdio.BrowserObject) {
        if (null == this.instance) {
            this.instance = new CancelReturns_ELO(client);
        }
        return this.instance;
    }
}
