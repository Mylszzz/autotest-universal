import {SingleDriver} from "./driver";
import {Device_A8, Device_Elo} from "./testactions/loginAction";
import {GlobalUtil} from "./utils/GlobalUtil";
import {ReadCSV} from "./utils/ReadCSV";
import {VipMixedPayment} from "./testactions/VipMixedPayment";
import {Tools} from "./utils/Tools";
import {logger} from "./utils/LogUtils";
import {DeviceName} from "./static/deviceName";
import {Screen} from "./testactions/Screen";
import {Search} from "./testactions/Search";
import {Refund} from "./testactions/Rufund"

let map = new Map();
let fileName:string = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() + "-" + Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";


const deviceName:string = DeviceName.getDeviceName();  // a8或者elo

function before() {
    GlobalUtil.init();
    // 读取测试数据
    map = ReadCSV.readFile();
    let saleContent = map.get('saleContent');
    logger.info("-------map--------------")
    logger.info(saleContent);
}

async function salesSettlement() {
    logger.info("开始创建client")
    let client = await SingleDriver.createClient();
    logger.info("成功创建["+deviceName+"]client")

    let device:any;
    if (deviceName == 'a8') {
        device = new Device_A8(client);
    } else if (deviceName == 'elo') {
        device = new Device_Elo(client);
    }
    await client.setImplicitTimeout(20000);
    await device.getDeviceConfig();
    client.pause(1000);
    await device.loginProcess();
    client.pause(1000);

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
   //  await Screen.screenNo(client,GlobalUtil.map.get('date'));
   //  await Screen.okScreen(client);
   //退货
    await Refund.Refund(client);

}

before();
salesSettlement();


