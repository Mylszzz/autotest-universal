import {PhoneNum} from "../phoneNum";
import {LogUtils} from "../../utils/logUtils";
import * as wdio from "webdriverio";
import {CommonXpath} from "../../static/commonXpath";
import {ButtonXPaths_A8, ButtonXPaths_Elo} from "../../static/buttonXPaths";
import {runTimeSettings} from "../../static/settings";


/**
 * 查询操作的基类
 */
export class Search {
    client: wdio.BrowserObject;
    menuBtnXPath: string = ButtonXPaths_A8.MENU;  //
    searchBtnXPath: string = ButtonXPaths_A8.SEARCH;

    public constructor(client: wdio.BrowserObject, menuBtnXPath?: string, searchBtnXPath?: string) {
        this.client = client;
        if (menuBtnXPath != undefined) {  //
            this.menuBtnXPath = menuBtnXPath;
        }
        if (searchBtnXPath != undefined) {
            this.searchBtnXPath = searchBtnXPath;
        }
    }

    /**
     * 进入查询/退货页面
     */
    public async search() {
        let menu = await this.client.$(this.menuBtnXPath);
        await menu.click();
        await this.client.pause(2000);
        //  点击查询
        let chooseBackGood = await this.client.$(this.searchBtnXPath);
        await chooseBackGood.click();
        // await this.client.pause(2000);
    }

    /**
     * 查询具体的订单
     * @param {string} num: 订单号，或者会员号
     * @returns {Promise<void>}
     */
    public async searchNum(num: string) {
        //  查询订单号或会员号
        let codeNoText = await this.client.$(CommonXpath.ORDERTEXT);
        await codeNoText.click();
        await this.client.pause(runTimeSettings.generalPauseTime);
        await PhoneNum.phoneNum(this.client, num);
        await this.client.pause(1000);
        try {
            let ok = await this.client.$(CommonXpath.DETERMINE);
            await ok.click();
            await this.client.pause(runTimeSettings.generalPauseTime);
            //查询订单号
            if (num.length > 15) {
                let codeNo = await this.client.$('//android.view.View[@content-desc=' + num + ']');
                await codeNo.click();
                await this.client.pause(1000);
            }
            //查询会员号
            else {

            }
            LogUtils.search.info("=====" + num + "查询符合预期==");
            LogUtils.search.info("=====查询结束====");

        } catch (e) {
            LogUtils.search.info("=====" + num + "查询无结果==");
            LogUtils.search.info("=====查询结束====");

        }
    }

    /**
     * 扫码查询订单
     */
    public async searchOrder() {
        //手动扫码
        let qr = await this.client.$(CommonXpath.QR);
        await qr.click();
        await this.client.pause(10000);
        try {
            let theTopOrder = await this.client.$(CommonXpath.ORDER);
            await theTopOrder.click();
            await this.client.pause(runTimeSettings.generalPauseTime);

            LogUtils.search.info("=====查询符合预期==");
            LogUtils.search.info("=====查询结束====");

        } catch (e) {
            LogUtils.search.info("=====查询无结果==");
            LogUtils.search.info("=====查询结束====");

        }

    }


}

/**
 * a8
 */
export class Search_a8 extends Search {
}

/**
 * elo
 */
export class Search_elo extends Search {
    public constructor(client: wdio.BrowserObject, menuBtnXPath = ButtonXPaths_Elo.MENU,
                       searchBtnXPath = ButtonXPaths_Elo.SEARCH) {
        super(client, menuBtnXPath, searchBtnXPath);
    }
}
