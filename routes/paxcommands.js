const Codes = require("./paxconstants")

//=============================================================================================

class PAXCommands {

    static PAXInitialize(){
        //[STX]A00[FS]1.28[ETX]K
        let cmd = String.fromCharCode(2);
        cmd += "A26" + Codes.FS; // FS
        cmd += "1.28";
        let lrc = PAXCommands.calculateLRC(cmd);
        cmd += String.fromCharCode(3);
        cmd += lrc;
        return cmd;
    }

    //----------------------------------------------------------------------------------------
    static PAXDoCredit(){
        //T00[FS]1.31[FS]01[FS]1.25[FS][FS]123456[FS][FS][FS][FS][FS]ENTRYMODEBITMAP=01111111
       
        let cmd = String.fromCharCode(2);
        //cmd+= "T00"+Codes.FS +"1.28" +Codes.FS +"01" +Codes.FS +Codes.FS +Codes.FS +"123456" +Codes.US +Codes.US +Codes.US +"124" +Codes.US +Codes.US +Codes.FS +Codes.FS +Codes.FS + Codes.FS +Codes.FS + "ENTRYMODEBITMAP=01111111"+Codes.FS;
        cmd+="T00" +Codes.FS +"1.58" +Codes.FS +"01" +Codes.FS +"13500" +Codes.FS +Codes.FS +"123456" +Codes.FS +Codes.FS +Codes.FS +Codes.FS +Codes.FS+ "ENTRYMODEBITMAP=01111111";
        // cmd += "T00" + Codes.FS + "1.31" + Codes.FS + "1" + Codes.FS + "01";
        // cmd += Codes.FS + Codes.FS + "123456" + Codes.FS + Codes.FS; // FS
        // cmd += Codes.FS + Codes.FS + Codes.FS + "ENTRYMODEBITMAP=01111111";
        let lrc = PAXCommands.calculateLRC(cmd);
        cmd += String.fromCharCode(3);
        cmd += lrc;
        return cmd;
    }
    //----------------------------------------------------------------------------------------
    static DoDebit(){

    }
    //----------------------------------------------------------------------------------------
    static DoSign(){

    }
    //----------------------------------------------------------------------------------------
    static Reboot(){

    }
    //----------------------------------------------------------------------------------------
    static CloseBatch(){

    }
    //----------------------------------------------------------------------------------------
    static GetTranction(){

    }
    //----------------------------------------------------------------------------------------
    static GetFaildReport(){

    }
    //----------------------------------------------------------------------------------------
    static GetTranctionDetals(){

    }
    //----------------------------------------------------------------------------------------
    static ClearBatch(){

    }
    //----------------------------------------------------------------------------------------
    static DoCNP(){

    }
    //----------------------------------------------------------------------------------------
    static DoAdjust(){

    }
    //----------------------------------------------------------------------------------------
    static DoEBT(){

    }
    //----------------------------------------------------------------------------------------
    static ShowMessage(){

    }
    //----------------------------------------------------------------------------------------
    static ShowDialog(){

    }
    //----------------------------------------------------------------------------------------
    static ClearMessage(){

    }
    //----------------------------------------------------------------------------------------
    static GetSignature(){

    }
    //----------------------------------------------------------------------------------------
    static CardInsertDetection(){

    }
    //----------------------------------------------------------------------------------------
    static RemoveCard(){

    }
    //----------------------------------------------------------------------------------------
    static Cancel(){

    }
    //----------------------------------------------------------------------------------------
    static Reset(){

    }
    //----------------------------------------------------------------------------------------
    static ShowMessageLabel(){

    }
    //----------------------------------------------------------------------------------------
    static InputTexBox(){

    }
    //----------------------------------------------------------------------------------------
    static CheckCardType(){

    }
    //----------------------------------------------------------------------------------------
    static calculateLRC (str) {
        var bytes = [];
        var lrc = 0;
        for (var i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i));
        }
        for (var i = 0; i < str.length; i++) {
            lrc ^= bytes[i];
        }
        return String.fromCharCode(lrc);
    }
};
//========================================================================================

module.exports = PAXCommands; 