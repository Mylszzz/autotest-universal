export class CsvOptions {
    public static options:any ={};

    /**
     * 输出csv的配置
     * @param {number} count，如果为1，就是输出表头
     * @param headers：表头
     * @returns {any} 返回配置
     */
    public static configurationOption(count:number,headers:any){
        if (count===1){
            this.options = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                useTextFile: false,
                useBom: true,
                useKeysAsHeaders: false,
                columnHeaders:headers,
                // headers: ['Column 1', 'Column 2', etc...], <-- Won't work with useKeysAsHeaders present!
                // additionalHeaders: [{columns: ["HeaderRow1Column1", "HeaderRow1Column2"]}, {columns: ["HeaderRow2Column1","HeaderRow2Column2"]}]
            }
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
                // columnHeaders:headers,
                // headers: ['Column 1', 'Column 2', etc...], <-- Won't work with useKeysAsHeaders present!
                // additionalHeaders: [{columns: ["HeaderRow1Column1", "HeaderRow1Column2"]}, {columns: ["HeaderRow2Column1","HeaderRow2Column2"]}]
            }
        }
        return this.options;
    }

    /**
     * 退款的Option
     * @type {{fieldSeparator: string; quoteStrings: string; decimalSeparator: string; showLabels: boolean; useTextFile: boolean; useBom: boolean; useKeysAsHeaders: boolean}}
     */
    public static refundOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: false
    };

}
