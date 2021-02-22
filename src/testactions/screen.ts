import {Search} from "./search";
import {DateUtil} from "../utils/dateUtil";
import {LogUtils} from "../utils/logUtils";

/*
* 选择筛选条件
* */
export class Screen {
    //筛选条件
    public static async screenNo(client: any,date:string,orderType: any, orderState: any) {
        await Search.search(client);
        //点击筛选
        let ccBtn = await client.$('//android.widget.Button[@content-desc="funnel"]');
        await ccBtn.click();
        //选择日期
        await DateUtil.selectDate(client, date);
        //选择条件
        // 清空默认的订单类型
        let chooseAll_1 = await client.$('(//android.widget.CheckBox[@content-desc="全选"])[1]');
        await chooseAll_1.click();
        await chooseAll_1.click();
        // 清空默认的订单状态
        let chooseAll_2 = await client.$('(//android.widget.CheckBox[@content-desc="全选"])[2]');
        await chooseAll_2.click();
        await chooseAll_2.click();

        // 点击选择订单类型
        for (let i=0;i<orderType.length;i++){
            let oneOfOrderType= await client.$('//android.widget.CheckBox[@content-desc="'+orderType[i]+'"]');
            await oneOfOrderType.click();
        }
        // 点击选择订单状态
        for (let i=0;i<orderState.length;i++){
            let oneOfOrderState= await client.$('//android.widget.CheckBox[@content-desc="'+orderState[i]+'"]');
            await oneOfOrderState.click();
        }
        //完成
        let ok = await client.$('//android.widget.Button[@content-desc="完成"]');
        await ok.click();
    }

    public static async refScreen(client:any){
        await Search.search(client);
        //点击筛选
        let ccBtn = await client.$('//android.widget.Button[@content-desc="funnel"]');
        await ccBtn.click();
        //重置
        let ok = await client.$('//android.widget.Button[@content-desc="重置"]');
        await ok.click();
        //重置后的条件判断，是否符合条件
        let generalSalesOrderCheck = await client.$('//android.widget.CheckBox[@content-desc="一般销售单"]');
        let isGeneralSalesOrderCheck =  await generalSalesOrderCheck.getAttribute('checked');
        if (isGeneralSalesOrderCheck){
            let completed = await client.$('//android.widget.CheckBox[@content-desc="已完成"]');
            let isCompleted =  await completed.getAttribute('checked');
            if (isCompleted){
                let complete = await client.$('//android.widget.Button[@content-desc="完成"]');
                await complete.click();
                LogUtils.log.info("=====订单查询--》重置筛选条件符合预期==");
            }else {
                LogUtils.log.info("=====订单查询--》重置筛选条件不符预期==");
            }
        }else {
            LogUtils.log.info("=====订单查询--》重置筛选条件不符预期==");
        }
    }
}