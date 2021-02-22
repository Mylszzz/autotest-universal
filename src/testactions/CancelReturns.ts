import {DeviceName} from "../static/deviceName";
import {Screen} from "./screen";
import {Search} from "./search";
import * as wdio from "webdriverio";
import {OrderXpath_a8, OrderXpath_elo} from "../static/OrderXpath";
import {CommonXpath} from "../static/commonXpath";


export class CancelReturns {
    client:wdio.BrowserObject;
    backBtnXPath:string = OrderXpath_a8.back;  //

    public constructor (client:wdio.BrowserObject, backBtnXPath?:string) {
        this.client = client;
        if (backBtnXPath != undefined) {  //
            this.backBtnXPath = backBtnXPath;
        }
    }
    public async cancelReturns(){
        await new Search(this.client).search();
         const orderType:any = ['一般销售单'];
         const orderState:any = ['已完成','已部分退'];
        await new Screen(this.client).screenNo(new Date().toLocaleDateString(),orderType, orderState);
         await this.client.pause(3000);
        let close = await this.client.$(CommonXpath.close);
        await close.click();
        let sel = await this.client.$(CommonXpath.order);
        await sel.click();
        let returns = await this.client.$(CommonXpath.returns);
        await returns.click();
        let cancel = await this.client.$(CommonXpath.cancel);
        await cancel.click();
        let back = await this.client.$(this.backBtnXPath);
        await back.click();
    }

}

export class CancelReturns_A8 extends CancelReturns {

}

const backBtnXPath_ELO = OrderXpath_elo.back;
export class CancelReturns_ELO extends CancelReturns {
    public constructor (client:wdio.BrowserObject, backBtnXPath = backBtnXPath_ELO
                       ) {
        super(client, backBtnXPath);
    }
}
