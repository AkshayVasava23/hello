const TCPSocket = require("./tcp-socket");
const PAXCommands = require("./paxcommands");
const { clear } = require("console");
var express = require("express");
var router = express.Router();
// var key = "dataResponse";
//const InitCmd = PAXCommands.PAXDoCredit();
//const InitCmd = DoEBT("1.00");

router.post("/", async (req, res) => {
  const client = new TCPSocket(`${req.body.ip}`, 10009, 60000);
  client.connect();
  const amount = JSON.parse(req.body.amount);
  const InitCmd = DoCredit(amount);
  console.log(InitCmd);
  client.send(InitCmd);
  console.log(`Data sent: ${InitCmd}`);
  var o = [];

  client.receive(async (data) => {
    if (data.toString().length == 2 && data.toString().charCodeAt(0) == 6) {
      console.log(`HBT Received: ${data.toString().charCodeAt(0)}`);
      var data1 = {
        HBT_Received: `${data.toString().charCodeAt(0)}`,
      };
      return o.push(data1);
    } else {
      if (data.toString().length != 0) {
        //   // console.log(`Received: ${data.toString().charCodeAt(0)}`);
        //   // res.json(`Received: ${data.toString().charCodeAt(0)}`);
        //   const FS = String.fromCharCode(28);
        //   const US = String.fromCharCode(31);
        //   const dataArry = data.toString().replace(US, FS).split(FS);

        //   var data2 = {
        //     TranscationCode: `${dataArry[1]}`,
        //     Amount: `${dataArry[2]}`,
        //     tCode: `${dataArry[3]}`,
        //     Status: `${dataArry[4]}`,
        //   };
        //   return o.push(data2);
        // } else {
        // res.json(`Received: ${data}`);
        const FS = String.fromCharCode(28);
        const US = String.fromCharCode(31);
        const dataArry = data
          .toString()
          .split(US)
          .toString()
          .split(FS)
          .toString()
          .split(",");
        console.log(`Received: ${dataArry}`);
        var data3 = {
          TransStatusCode: `${dataArry[3]}`,
          sStatus: `${dataArry[4]}`,
          ApprovalStatus: `${dataArry[6]}`,
          Amount: `${dataArry[10]}`,
          Response: `${[dataArry]}`,
          TSI: `${dataArry[35]}`,
          CardBin: `${dataArry[36]}`,
          IAD: `${dataArry[37]}`,
          TC: `${dataArry[38]}`,
          ATC: `${dataArry[39]}`,
          APPPN: `${dataArry[40]}`,
          AID: `${dataArry[41]}`,
          APPLab: `${dataArry[42]}`,
          GlobalUID: `${dataArry[43]}`,
          TVR: `${dataArry[44]}`,
          CVM: `${dataArry[45]}`,
          ProgramType: `${dataArry[46]}`,
          SN: `${dataArry[47]}`,
          EDCType: `${dataArry[48]}`,
        };
        o.push(data3);
      }
      if (
        data.indexOf(String.fromCharCode(3)) !== -1 ||
        data.indexOf(String.fromCharCode(4)) !== -1
      ) {
        await res.json(o);
        await client.close();
      }
    }
  });

  client.onTimeout(async () => {
    console.log("Timeout reached");
    // var data4 = {
    //   msg: `Timeout reached`,
    // };
    // o.push(data4);
    // await res.json(o);
  });

  client.error((error) => {
    console.error(`${error}`);
  });
  function DoCredit(
    Amount,
    enTransType = "SALE",
    extData = null,
    InvoiceNum = null,
    TransID = "14578"
  ) {
    //T00[FS]1.31[FS]01[FS]1.25[FS][FS]123456[FS][FS][FS][FS][FS]ENTRYMODEBITMAP=01111111
    const FS = String.fromCharCode(28);
    const US = String.fromCharCode(31);
    let sb = "T00" + FS + "1.31" + FS + GetEnumToValue(enTransType) + FS;
    if (
      enTransType == "SALE" ||
      enTransType == "AUTH" ||
      enTransType == "POSTAUTH" ||
      enTransType == "RETURN"
    )
      sb += (Amount * 100).toFixed(0); // Amount
    sb += FS;
    sb += FS;
    let ECRRefNum = InvoiceNum == null ? 3 : InvoiceNum;
    sb += ECRRefNum; // Invoice Num
    if (
      enTransType == "VOID" ||
      enTransType == "VOID_AUTH" ||
      enTransType == "POSTAUTH" ||
      enTransType == "VOID_POSTAUTH"
    ) {
      sb += US + US + US + TransID + US + US + FS;
    } else {
      sb += FS + FS + FS + FS + FS;
    }
    if (
      enTransType != "VOID" &&
      enTransType != "VOID_AUTH" &&
      enTransType != "POSTAUTH" &&
      enTransType != "VOID_POSTAUTH"
    ) {
      if (extData != null) {
        let Cmd = extData.GetCommand();
        sb += Cmd;
      }
    }
    sb += FS;

    let cmd = buildCommandArray(sb);
    return PrepareCommand(cmd);
  }

  function DoEBT(
    Amount,
    enTransType = "SALE",
    extData = null,
    InvoiceNum = null,
    TransID = "123457"
  ) {
    //T00[FS]1.31[FS]01[FS]1.25[FS][FS]123456[FS][FS][FS][FS][FS]ENTRYMODEBITMAP=01111111

    const FS = String.fromCharCode(28);
    const US = String.fromCharCode(31);
    let sb = "T04" + FS + "1.31" + FS + GetEnumToValue(enTransType) + FS;
    if (
      enTransType == "SALE" ||
      enTransType == "AUTH" ||
      enTransType == "POSTAUTH" ||
      enTransType == "RETURN"
    )
      sb += (Amount * 100).toFixed(0); // Amount
    sb += FS;
    sb += FS;
    let ECRRefNum = InvoiceNum == null ? 5 : InvoiceNum;
    sb += ECRRefNum; // Invoice Num
    sb += FS + FS;
    if (
      enTransType != "VOID" &&
      enTransType != "VOID_AUTH" &&
      enTransType != "POSTAUTH" &&
      enTransType != "VOID_POSTAUTH"
    ) {
      if (extData != null) {
        let Cmd = extData.GetCommand();
        sb += Cmd;
      }
    }
    sb += FS;

    let cmd = buildCommandArray(sb);
    return PrepareCommand(cmd);
  }
  function buildCommandArray(cmdText) {
    try {
      const cmdByteArray = Buffer.from(cmdText, "ascii");
      const lrcByteArray = Buffer.alloc(cmdText.length + 1);
      ByteArrayCopy(cmdByteArray, lrcByteArray);
      lrcByteArray[cmdText.length] = 3;

      const fnlByteArray = Buffer.alloc(cmdText.length + 3);
      fnlByteArray[0] = 2;
      const LRC = calculateLRC(lrcByteArray);
      fnlByteArray[fnlByteArray.length - 1] = LRC;
      ByteArrayCopy(lrcByteArray, fnlByteArray, 1);
      return fnlByteArray;
    } catch (ex) {
      console.error("Error Building Command: " + ex.message);
      return null;
    }
  }

  function GetEnumToValue(enTransType) {
    switch (enTransType) {
      case "SALE":
        return "01";
      case "AUTH":
        return "02";
      case "POSTAUTH":
        return "03";
      case "RETURN":
        return "04";
      case "VOID":
        return "11";
      case "VOID_AUTH":
        return "12";
      case "VOID_POSTAUTH":
        return "13";
      default:
        return "01";
    }
  }

  function TerminalInfo() {
    const FS = String.fromCharCode(28);
    const cmdText = `A00${FS}1.31`;
    const cmdByteArray = Buffer.from(cmdText, "ascii");
    const lrcByteArray = Buffer.alloc(cmdText.length + 1);
    ByteArrayCopy(cmdByteArray, lrcByteArray);
    lrcByteArray[cmdText.length] = 3;

    const fnlByteArray = Buffer.alloc(cmdText.length + 3);
    fnlByteArray[0] = 2;
    const LRC = calculateLRC(lrcByteArray);
    fnlByteArray[fnlByteArray.length - 1] = LRC;
    ByteArrayCopy(lrcByteArray, fnlByteArray, 1);

    return PrepareCommand(fnlByteArray);
  }

  function ByteArrayCopy(source, destination, offset = 0) {
    source.copy(destination, offset);
  }

  function calculateLRC(data) {
    let lrc = 0;
    for (let i = 0; i < data.length; i++) {
      lrc ^= data[i];
    }
    return lrc;
  }

  function PrepareCommand(buffer) {
    const input = buffer.toString("ascii");
    return input;
  }
});

module.exports = router;
