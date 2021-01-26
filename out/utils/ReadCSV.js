"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const GlobalUtil_1 = require("./GlobalUtil");
class ReadCSV {
    static readFile() {
        let myMap = new Map();
        let data = fs_1.default.readFileSync(GlobalUtil_1.GlobalUtil.map.get('csv'));
        let buffer = iconv_lite_1.default.decode(data, "gbk");
        let string = buffer.toString();
        let line_list = string.split('\r\n');
        myMap.set("saleContent", line_list);
        //获取首行
        let name = line_list[0].split(',');
        for (let i = 1; i < line_list.length; i++) {
            let payTree = new Map();
            let otherTree = new Map();
            // 支付方式
            let pay = [];
            //支付价格
            let price = [];
            // 其他（是否退货、是否取消交易）
            let key = [];
            // key 的值
            let val = [];
            if (line_list[i].length != 0) {
                let item_list = line_list[i].split(',');
                let n = 0;
                let m = 0;
                for (let j = 0; j < item_list.length - 2; j++) {
                    if (item_list[j] != '0') {
                        // payTree.set(n,{name[j],item_list[j]});
                        // payTree.set(n,[name[j],item_list[j]]);
                        pay[n] = name[j];
                        price[n] = +item_list[j];
                        n++;
                    }
                }
                payTree.set("data", [pay, price]);
                for (let k = item_list.length - 1; k > item_list.length - 3; k--) {
                    // otherTree.set(m,[name[k],item_list[k]]);
                    key[m] = name[k];
                    val[m] = item_list[k];
                    m++;
                }
                otherTree.set("data", [key, val]);
                myMap.set(i, { 'payTree': payTree, 'otherTree': otherTree });
            }
        }
        return myMap;
    }
}
exports.ReadCSV = ReadCSV;
