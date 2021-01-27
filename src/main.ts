import {SingleDriver} from "./driver";
import {LoginAction} from "./testactions/loginAction";
import {GlobalUtil} from "./utils/GlobalUtil";
import {ReadCSV} from "./utils/ReadCSV";
// import {VipMixedPayment} from "./testactions/VipMixedPayment";
import {Tools} from "./utils/Tools";
import {logger} from "./utils/LogUtils";

let map = new Map();
let fileName:string = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() + "-" + Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";
function before() {
    GlobalUtil.init();
    // 读取测试数据
    map = ReadCSV.readFile();
    let saleContent = map.get('saleContent');
    logger.info("-------map--------------")
    logger.info(saleContent);
}

async function salesSettlement() {

    let client = await SingleDriver.createClient();
    await client.setImplicitTimeout(20000);
    await LoginAction.Login(client);

}

before();
salesSettlement();

// (function (){
//     console.log(fileName)            2021-1-25-60cbe1f9-cdcd-4d49-a437-eac92b0e3617.csv
//     console.log(fileName2)           2021/1/25-892c8de0-0997-407b-8aa5-3f80e0baee04.csv
// })()

