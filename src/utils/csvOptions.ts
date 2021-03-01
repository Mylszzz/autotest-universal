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
            }
        }
        return this.options;
    }

    /**
     * 退款的Option
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
