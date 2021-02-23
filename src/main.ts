import {SingleDriver} from "./driver";
import {LoginAction} from "./testactions/loginAction";

// import {GlobalUtil} from "./utils/GlobalUtil";
import {ReadCSV} from "./utils/ReadCSV";
// import {VipMixedPayment} from "./testactions/VipMixedPayment";
import {Tools} from "./utils/Tools";
import {GlobalUtil} from "./utils/GlobalUtil";
import {VipMixedPayment} from "./testactions/VipMixedPayment";


let map = new Map();
let fileName:string = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate() + "-" + Tools.guid() + ".csv";
// let fileName2:string = new Date().toLocaleDateString() + "-" + Tools.guid() + ".csv";
function before() {
    GlobalUtil.init();
    map = ReadCSV.readFile();
    let saleContent = map.get('saleContent');
}

async function salesSettlement() {
    let client =await SingleDriver.createClient();
    await client.setImplicitTimeout(20000);
    await LoginAction.Login(client);



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
            await VipMixedPayment.test(client, payTree, otherTree, i, headers, saleContent[i].split(','), fileName);

        } else {

        }

    }

}



//
//     let client = await SingleDriver.createClient();
//     await LoginAction.Login(client);
//
//     // let saleContent = map.get('saleContent');
//     // let headers:string[] = [];
//     // headers.push("saleTime");
//     // headers.push("orderNo");
//     // headers.push("price");
//     // headers.push(saleContent[0].split(','));
//     // for (let i = 1; i <= map.size-1; i++) {
//     //     let mode = map.get(i);
//     //     if (mode!==undefined){
//     //         let payTree = mode.payTree;
//     //         let otherTree = mode.otherTree;
//     //         await VipMixedPayment.test(client, payTree, otherTree,i,headers,saleContent[i].split(','),fileName);
//     //
//     //     }else{
//     //
//     //     }
//     //
//     // }
//
//
// }

before();
salesSettlement();

// (function (){
//     console.log(fileName)            2021-1-25-60cbe1f9-cdcd-4d49-a437-eac92b0e3617.csv
//     console.log(fileName2)           2021/1/25-892c8de0-0997-407b-8aa5-3f80e0baee04.csv
// })()

