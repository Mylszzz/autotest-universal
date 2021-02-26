import {TouchAction} from "./touchAction";
import {GlobalUtil} from "../utils/globalUtil";

/**
 * A8
 */
export class VipLogin_A8 implements VipLogin{
    client:any;
    phoneNum:string;
    public constructor(client:any) {
        this.client = client;
        this.phoneNum = <string>GlobalUtil.getConfigMap().get('vipPhone');
    }

    public async vipLogin() {
        let vipBtn= await this.client.$('//android.view.View[@content-desc="请点击登录会员号码"]');
        await vipBtn.click();
        //输入会员号码
        await TouchAction.phoneNum(this.client, this.phoneNum);
        await this.client.pause(1000);
        //点击确定
        let okBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await okBtn.click();
        await this.client.pause(3000);
    }
}

/**
 * ELO
 */
export class VipLogin_Elo implements VipLogin {
    client:any;
    phoneNum:string;

    public constructor(client:any) {
        this.client = client;
        this.phoneNum = <string>GlobalUtil.getConfigMap().get('vipPhone');
    }

    public async vipLogin() {
        //输入会员号码
        await TouchAction.phoneNum(this.client, this.phoneNum);
        await this.client.pause(1000);
        //点击确定
        let okBtn = await this.client.$('//android.widget.Button[@content-desc="确定"]');
        await okBtn.click();
        await this.client.pause(3000);
    }
}

interface VipLogin {
    client:any;
    phoneNum:string;
    vipLogin():void;
}