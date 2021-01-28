import {SingleDriver} from "../driver";
import {Position} from "../utils/Position";
import {LogUtils} from "../utils/LogUtils";

export class TouchAction{
    //价格输入按键
     static ArrPath = [

         { x: 78, y: 810 }, //1
         { x: 270, y: 787 },//2
         { x: 450, y: 829 },
         { x: 88, y: 957 },
         { x: 270, y: 954 },
         { x: 450, y: 954 },
         { x: 93, y: 1076 },
         { x: 270, y: 1038 },
         { x: 450, y: 1038 },//9
         { x : 364, y: 1206}, //0
         {  x: 84, y: 1194},//.
    ];
     //退货密码输入按键
    static ArrPathGood = [

        { x: 78, y: 810 }, //1
        { x: 270, y: 787 },//2
        { x: 450, y: 829 },
        { x: 88, y: 957 },
        { x: 270, y: 954 },
        { x: 450, y: 954 },
        { x: 93, y: 1076 },
        { x: 270, y: 1038 },
        { x: 450, y: 1038 },//9
        { x : 364, y: 1206}, //0
        {  x: 84, y: 1194},//.
    ];

    //输入手机号
    public static async phoneNum(client:any,num:string){
        await this.sleep(2000)
        for (let i =0;i<num.length;i++){
            let n = await client.$('//android.view.View[@content-desc="'+num.charAt(i)+'"]');
            await n.click();
        }
    }
    public static async sleep(ms: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('');
            }, ms)
        });

    }
    //点击绝对坐标控件
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
    public static async touchPasswordAction(client:WebdriverIO.BrowserObject,s1: string) {
        let strings = Object.keys(s1);
        strings.forEach(s=>{
            console.log(s1.charAt(Number.parseInt(s)));
            let a=s1.charAt(Number.parseInt(s));
            if (a=="0"){
                 this.touchAction(Position.returnAuthorization[9].x,Position.returnAuthorization[9].y);
            }
            else {
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
    public static async touchPriceAction(client:WebdriverIO.BrowserObject,s:string){
       // await client.setImplicitTimeout(2000);

        let strings =await Object.keys(s);
        let key:string = s.charAt(strings);
        for (let str of strings) {

            console.log("=====输入数字："+s.charAt(Number.parseInt(str)));
            if (s.charAt(Number.parseInt(str))=="0"){
               await client.touchAction([{
                        action:'tap',
                        x:this.ArrPath[9].x,
                        y:this.ArrPath[9].y
                    }]
                );
            }
            else if (key == '.'){
                await client.touchAction([
                    {
                        action: 'tap',
                        x: 84,
                        y: 1194
                    },
                ]);
                await client.pause(500);
            }
            else {
                let keydd:number = Number(key);
                await client.touchAction([
                    {
                        action: 'tap',
                        x: this.ArrPath[keydd-1].x,
                        y: this.ArrPath[keydd-1].y
                    },
                ]);
                await client.pause(1000);
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