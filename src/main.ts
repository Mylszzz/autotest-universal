import {SingleDriver} from "./driver";
import {Device_A8} from "./testactions/loginAction";

// import {GlobalUtil} from "./utils/GlobalUtil";
import {ReadCSV} from "./utils/ReadCSV";
// import {VipMixedPayment} from "./testactions/VipMixedPayment";
import {Tools} from "./utils/Tools";


let map = new Map();
let fileName:string = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() + "-" + Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";
function before() {
    // GlobalUtil.init();
    // 读取测试数据
    // map = ReadCSV.readFile();
}

async function salesSettlement() {

    let client = await SingleDriver.createClient();
    let deviceName = 'a8';  // TODO
    let device:any;
    if (deviceName == 'a8') {
        device = new Device_A8(client);
    } else {
    }
    await device.getDeviceConfig();
    client.pause(1000);
    await device.loginProcess();
    client.pause(1000);
    // await LoginAction.Login(client);  //TODO: 这个是之前的静态方法

    // let saleContent = map.get('saleContent');
    // let headers:string[] = [];
    // headers.push("saleTime");
    // headers.push("orderNo");
    // headers.push("price");
    // headers.push(saleContent[0].split(','));
    // for (let i = 1; i <= map.size-1; i++) {
    //     let mode = map.get(i);
    //     if (mode!==undefined){
    //         let payTree = mode.payTree;
    //         let otherTree = mode.otherTree;
    //         await VipMixedPayment.test(client, payTree, otherTree,i,headers,saleContent[i].split(','),fileName);
    //
    //     }else{
    //
    //     }
    //
    // }


}

before();
salesSettlement();

// (function (){
//     console.log(fileName)            2021-1-25-60cbe1f9-cdcd-4d49-a437-eac92b0e3617.csv
//     console.log(fileName2)           2021/1/25-892c8de0-0997-407b-8aa5-3f80e0baee04.csv
// })()

