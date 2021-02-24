import {LogUtils} from "../../utils/logUtils";
import {ReadCSV} from "../../utils/readCSV";

export class SaleDataPreparation {
    private saleMap:Map;

    /**
     *
     */
    public saleDataPreparation() {
        this.saleMap = ReadCSV.readFile();
        let saleContent = this.saleMap.get('saleContent');
        LogUtils.log.info("-------map--------------");
        LogUtils.log.info(saleContent);
        let headers: string[] = [];
        headers.push("saleTime");
        headers.push("orderNo");
        headers.push("price");
        headers.push(saleContent[0].split(','));
        for (let i = 1; i <= this.saleMap.size - 1; i++) {
            let mode = this.saleMap.get(i);
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
    }
}