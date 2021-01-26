"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
class Tools {
    /**
     * 数组中随机取几个元素
     * arr      数组
     * count    要取的数量
     */
    static getRandomArrayElements(arr, count) {
        let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }
    /**
     * 16位的随机数
     */
    static guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
exports.Tools = Tools;
Tools.orderType = ['一般销售单', '补录销售单', '一般退货单', '取消退货单'];
Tools.orderState = ['交易中', '已取消', '已完成', '已部分退', '已退货', '已关闭'];
