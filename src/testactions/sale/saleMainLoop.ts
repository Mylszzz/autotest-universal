import {SaleAction_A8, SaleAction_Elo} from "./saleAction";
import {LogoutAction_A8, LogoutAction_Elo} from "../basicActions/logoutAction";
import {DeviceName} from "../../static/deviceName";
import {CsvGenerator} from "./csvGenerator";
import {Tools} from "../../utils/tools";

export class SaleMainLoop {
    private static instance:SaleAction_A8|SaleAction_Elo;
    private static csvGenerator:CsvGenerator;
    private static fileName:string = '';  // 保存测试输出的csv文件名

    private constructor(){}

    public static async salePreparation(client:any) {
        if (this.csvGenerator == null) {
            this.csvGenerator = new CsvGenerator(, this.fileName);
        }
        if (this.fileName = '') {
            this.fileName = new Date().getFullYear()+"-"+ (new Date().getMonth()+1) + "-" +
                new Date().getDate() + "-" + Tools.guid() + ".csv";
        }
        if (DeviceName.getDeviceName() == 'a8' && this.instance == null) {
            this.instance = new SaleAction_A8(, client, this.csvGenerator);
        } else if (DeviceName.getDeviceName() == 'elo' && this.instance == null) {
            this.instance = new SaleAction_Elo(, client, this.csvGenerator);
        }
    }

    public saleMainLoop() {
        
    }


}