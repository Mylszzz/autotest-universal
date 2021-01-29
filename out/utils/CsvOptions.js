"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvOptions = void 0;
class CsvOptions {
    /**
     * 输出csv的配置
     * @param {number} count，如果为1，就是输出表头
     * @param headers：表头
     * @returns {any} 返回配置
     */
    static configurationOption(count, headers) {
        if (count === 1) {
            this.options = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                useTextFile: false,
                useBom: true,
                useKeysAsHeaders: false,
                columnHeaders: headers,
            };
        }
        else {
            this.options = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                useTextFile: false,
                useBom: true,
                useKeysAsHeaders: false,
            };
        }
        return this.options;
    }
}
exports.CsvOptions = CsvOptions;
CsvOptions.options = {};
