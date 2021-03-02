"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
class Tools {
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
