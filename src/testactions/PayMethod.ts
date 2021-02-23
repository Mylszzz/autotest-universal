export class PayMethod {
    public static async allPayMethod(client:any,payMethods:any,prices:any){
        // let payMethodFromCSV :any =payTree.get("data")[0];
        await client.setImplicitTimeout(10000);
        // for (let i=0;j<)
        // let payName:string = payMethods[j];
        //获取所有支付方式
        let methods =new Array();
        let cash=await client.$('//android.widget.Button[@content-desc="现金"]');

        let other = await client.$('//android.widget.Button[@content-desc="其他"]');

        let chunfen = await client.$('//android.widget.Button[@content-desc="春风里礼券"]');

        let maoku = await client.$('//android.widget.Button[@content-desc="猫酷电子券"]');

        methods.push(cash);
        methods.push(other);
        methods.push(chunfen);
        methods.push(maoku);

        return methods;

        // for (let i=0;i<methods.length;i++){
        //    let name = await methods[i].getAttribute('content-desc');
        //    if (payName === name){
        //        break;
        //    }
        // }



    }

}