"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleDataPreparation = void 0;
const logUtils_1 = require("../../utils/logUtils");
const readCSV_1 = require("../../utils/readCSV");
class SaleDataPreparation {
    /**
     *
     */
    saleDataPreparation() {
        this.saleMap = readCSV_1.ReadCSV.readFile();
        let saleContent = this.saleMap.get('saleContent');
        logUtils_1.LogUtils.log.info("-------map--------------");
        logUtils_1.LogUtils.log.info(saleContent);
        let headers = [];
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
            }
            else {
            }
        }
    }
}
exports.SaleDataPreparation = SaleDataPreparation;
