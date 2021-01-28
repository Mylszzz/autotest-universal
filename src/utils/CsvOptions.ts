export class CsvOptions {
    public static options:any ={};
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
}
