import {LogUtils} from "../../utils/logUtils";
import {ReadCSV} from "../../utils/readCSV";
import fs from "fs";
import iconv from 'iconv-lite'
import {GlobalUtil} from "../../utils/globalUtil";
import {ISaleData} from "./saleAction";

/**
 * 全部条销售测试用例的数据准备
 */
export class SaleDataPreparation {
    private rows:string[];  // 从销售测试用例csv文件中读取到的每一行数据的数组
    private title:string[];  // csv文件的首行是销售测试用例的字段
    private saleMap:Map = new Map();  // TODO: useless

    public constructor() {

    }

    /**
     * 用于读取销售流程的测试用例
     * @returns {Map}
     */
    public readFile() {
        let data = fs.readFileSync(GlobalUtil.getConfigMap().get('csv'));
        let buffer = iconv.decode(data, "gbk");  // 文件的编码格式是GBK
        let string = buffer.toString();
        //读取每一行的数据
        this.rows = string.split('\r\n');

        this.title = this.rows[0].split(',');
    }


    /**
     *
     */
    // public saleDataPreparation() {
    //     this.saleMap = ReadCSV.readFile();
    //     let saleContent = this.saleMap.get('saleContent');
    //     LogUtils.log.info("-------map--------------");
    //     LogUtils.log.info(saleContent);
    //     let headers: string[] = ["saleTime", "orderNo", "price"];
    //     headers.push(saleContent[0].split(','));
    //     for (let i = 1; i <= this.saleMap.size - 1; i++) {
    //         let mode = this.saleMap.get(i);
    //         if (mode !== undefined) {
    //             let payTree = mode.payTree;
    //             console.log("payTree[" + i + "]:" + payTree.get('data'));
    //             console.log(payTree.get("data")[0] + " " + payTree.get("data")[1]);
    //             let otherTree = mode.otherTree;
    //             console.log("otherTree[" + i + "]:" + otherTree.get('data'));
    //             console.log(otherTree.get("data")[0] + " " + otherTree.get("data")[1]);
    //             //   await VipMixedPayment.test(client, payTree, otherTree,i,headers,saleContent[i].split(','),fileName);
    //
    //         } else {
    //
    //         }
    //     }
    // }
}

/**
 * 单条销售记录的数据准备
 */
export class SingleSaleDataPreparation implements ISaleData{
    seqNum:number;
    paymentInfoMap:Map<string, string>;
    saleOptionsInfoMap:Map<string, string>;
    price:string;

    public constructor(seqNum:number) {
        this.seqNum = seqNum;
    }

    /**
     * 处理读取到的销售信息，得到实际使用了的支付方式和是否退货和取消交易
     * 并更新到saleMap
     */
    private dataProcess() {
        //获取首行
        let title = this.rows[0].split(',');  // 首行是销售测试用例的字段

        for (let i = 1; i < this.rows.length; i++) {
            let paymentInfoMap = new Map<string, string>();
            let saleOptionsInfoMap = new Map<string, string>();




            let payTree = new Map();
            let otherTree = new Map();
            // 支付方式
            let pay: string[] = [];
            //支付价格
            let price: number[] = [];
            // 其他（是否退货、是否取消交易）
            let key: string[] = [];
            // key 的值
            let val: string[] = [];
            if (line_list[i].length != 0) {
                let item_list = line_list[i].split(',');
                let n = 0;
                let m = 0;
                for (let j = 0; j < item_list.length - 2; j++) {
                    if (item_list[j] != '0') {
                        pay[n] = name[j];
                        price[n] = +item_list[j];
                        n++;
                    }
                }
                payTree.set("data", [pay, price]);
                for (let k = item_list.length - 1; k > item_list.length - 3; k--) {
                    key[m] = name[k];
                    val[m] = item_list[k];
                    m++;
                }
                otherTree.set("data", [key, val]);
                this.saleMap.set(i, {'payTree': payTree, 'otherTree': otherTree});
            }

        }
    }

}