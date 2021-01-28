"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvOptions = void 0;
class CsvOptions {
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
