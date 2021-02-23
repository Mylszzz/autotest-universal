import {SingleDriver} from "../driver";
import {Position} from "../utils/Position";
import {ReadUtils} from "../utils/ReadUtils";
import {GlobalUtil} from "../utils/GlobalUtil";

export class TouchAction{
    //价格输入按键
     static ArrPath = [
        { x: 90, y: 830 }, //1
        { x: 270, y: 830 },//2
        { x: 450, y: 830 },
        { x: 90, y: 960 },
        { x: 270, y: 960 },
        { x: 450, y: 960 },
        { x: 90, y: 1080 },
        { x: 270, y: 1080 },
        { x: 450, y: 1080 },//9
        { x: 360, y: 1212 }, //0
         {x:90,y:1220}// .
    ];
     //退货密码输入按键
    static ArrPathGood = [
        {x: 744, y: 595}, //1
        {x: 888, y: 595},//2
        {x: 1031, y: 595},//3
        {x: 744, y: 705},//4
        {x: 888, y: 705},//5
        {x: 1031, y: 705},//6
        {x: 744, y: 815},//7
        {x: 888, y: 815},//8
        {x: 1031, y: 815},//9
        {x: 956, y: 922}, //0
    ];

    //输入手机号
    public static async phoneNum(client:any,num:string){
        for (let i =0;i<num.length;i++){
            let phoneNumber = await client.$('//android.webkit.WebView[@content-desc="Ionic App"]/android.view.View[8]/android.widget.EditText');

            await phoneNumber.clearValue();
            await client.pause(1000);
            await phoneNumber.setValue(GlobalUtil.map.get('vipPhone'));

            await client.pause(1000);
            let confirm = await client.$('//android.widget.Button[@content-desc="确定"]');
            await confirm.click();
            await client.pause(3000);
        }
    }

    public static async touchAction(x:number,y:number){
    let client =await SingleDriver.createClient();
        client.setImplicitTimeout(10000);
        await client.touchAction([{
            action:'tap',
            x:x,
            y:y
        }]
        );
        //await browser.touchUp(x,y);
    }

    /**
     * 输入退款密码
     * @author Daniel_Li
     * @param client
     * @param s1
     */
    public static async touchPasswordAction(client:WebdriverIOAsync.BrowserObject,s1: string) {
        let strings = Object.keys(s1);
        strings.forEach(s=>{
            console.log(s1.charAt(Number.parseInt(s)));
            let a=s1.charAt(Number.parseInt(s));
            if (a=="0"){
                 this.touchAction(Position.returnAuthorization[9].x,Position.returnAuthorization[9].y);
            }else if (a=="."){
                this.touchAction(Position.returnAuthorization[10].x,Position.returnAuthorization[10].y);
            }else {
                let num:number=Number.parseInt(a);
                this.touchAction(Position.returnAuthorization[num-1].x,Position.returnAuthorization[num-1].y);
            }
        });
    }

    /**
     * 输入价格
     * @author Daniel_Li
     * @param client
     * @param s
     */
    public static async touchPriceAction(client:WebdriverIOAsync.BrowserObject,s:string){
       // await client.setImplicitTimeout(2000);

        let strings =await Object.keys(s);
        for (let str of strings) {

            console.log("=====输入数字："+s.charAt(Number.parseInt(str)));
            if (s.charAt(Number.parseInt(str))=="0"){
               await client.touchAction([{
                        action:'tap',
                        x:Position.NumberPath[9].x,
                        y:Position.NumberPath[9].y
                    }]
                );
            }else if (s.charAt(Number.parseInt(str))=="."){
              await  client.touchAction([{
                        action:'tap',
                        x:Position.NumberPath[10].x,
                        y:Position.NumberPath[10].y
                    }]
                );
            }else {
                let num:number= Number.parseInt(s.charAt(Number.parseInt(str)));
              await  client.touchAction([{
                        action:'tap',
                        x:Position.NumberPath[num-1].x,
                        y:Position.NumberPath[num-1].y
                    }]
                );
            }
        }
    }

    /**
     * 点击支付供应商
     * @param client
     * @param num
     */
    public static async clickPay(client:any,num:number){
        await client.touchAction([
            {
                action: 'tap',
                x: Position.pay[num-1].x,
                y: Position.pay[num-1].y
            }
        ]);
    }
}
