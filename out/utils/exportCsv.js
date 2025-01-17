"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportCsv = void 0;
const fs_1 = __importDefault(require("fs"));
const ts_export_to_csv_1 = require("ts-export-to-csv");
const path = __importStar(require("path"));
/**
 * 打印CSV的工具类
 */
class ExportCsv {
    /**
     * 打印销售文档
     * @param options: 输出csv的配置，在csvOptions.ts中配置
     * @param data: 二元数组 string[][]
     * @param {string} fileName: 输出的文件名
     */
    static printSaleData(options, data, fileName) {
        const csvExporter = new ts_export_to_csv_1.ExportToCsv(options);
        const csvData = csvExporter.generateCsv(data, true);
        fs_1.default.writeFileSync(path.join(__dirname, "../../csvData/sale/" + fileName), csvData, {
            flag: 'a',
            encoding: 'utf8'
        });
    }
    /**
     * 打印退货文档
     * @param options
     * @param refundData
     * @param {string} fileName
     */
    static printRefundData(options, refundData, fileName) {
        const csvExporter = new ts_export_to_csv_1.ExportToCsv(options);
        const csvData = csvExporter.generateCsv(refundData, true);
        fs_1.default.writeFileSync(path.join(__dirname, fileName), csvData, {
            flag: 'a',
            encoding: 'utf8'
        });
    }
}
exports.ExportCsv = ExportCsv;
