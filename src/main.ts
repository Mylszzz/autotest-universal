import {SingleDriver} from "./driver";
import {LoginAction, LogoutAction, UploadLogAction, RefreshAction} from "./testactions/deviceActions";
import {GlobalUtil} from "./utils/globalUtil";
import {ReadCSV} from "./utils/readCSV";
import {VipMixedPayment} from "./testactions/vipMixedPayment";
import {Tools} from "./utils/tools";
import {logger} from "./utils/logUtils";
import {DeviceName} from "./static/deviceName";
import {ValidateOrderInfo} from "./testactions/orderInfo/validateOrderInfo";
import {Screen} from "./testactions/screen";
import {Search} from "./testactions/search";
import {Refund} from "./testactions/refund"

let map = new Map();
let fileName:string = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() + "-" + Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";


const deviceName:string = DeviceName.getDeviceName();  // a8或者elo

/**
 * 执行脚本流程之前的一些准备工作
 * 包括读取配置到Map中
 */
function before() {
    GlobalUtil.init();
    // 读取测试数据
    map = ReadCSV.readFile();
    let saleContent = map.get('saleContent');
    logger.info("-------map--------------");
    logger.info(saleContent);
}

async function salesSettlement() {
    logger.info("开始创建client");
    let client = await SingleDriver.createClient();
    logger.info("成功创建[" + deviceName + "]client");

    /*
    登录(A8和Elo通用。)
     */
    await LoginAction.login(client);

    await UploadLogAction.uploadTodayLogAction(client);
    await RefreshAction.refreshAction(client);
    await LogoutAction.accountLogout(client);

    await LoginAction.login(client);

        // /*
    //  For Test Only
    //  测试打印屏幕上显示的销售信息
    //   */
    // await client.pause(30000);
    // console.log('------------测试：打印销售信息------------');
    // try {
    //     await ValidateOrderInfo.saveOrderInfoToCsv(client);
    // } catch (e) {
    //     console.log(e);
    // }


    /*

     */
    let saleContent = map.get('saleContent');
    let headers: string[] = [];
    headers.push("saleTime");
    headers.push("orderNo");
    headers.push("price");
    headers.push(saleContent[0].split(','));
    for (let i = 1; i <= map.size - 1; i++) {
        let mode = map.get(i);
        if (mode !== undefined) {
            let payTree = mode.payTree;
            console.log("payTree[" + i + "]:" + payTree.get('data'));
            console.log(payTree.get("data")[0] + " " + payTree.get("data")[1]);
            let otherTree = mode.otherTree;
            console.log("otherTree[" + i + "]:" + otherTree.get('data'));
            console.log(otherTree.get("data")[0] + " " + otherTree.get("data")[1]);
            //   await VipMixedPayment.test(client, payTree, otherTree,i,headers,saleContent[i].split(','),fileName);

        } else {

        }
    }
    await Refund.Refund(client);
}


before();
salesSettlement();
