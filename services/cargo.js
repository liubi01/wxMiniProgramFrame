const api = require("../config/api.js");
const req = require("../utils/req.js");
const utils = require("../utils/util.js");
const Cargo = {
      checkVerificationCode(data){
        return req.get(`${api.CheckVerificationCode}/${data.scheduleId}/${data.siteId}/${data.orderNum}/${data.verificationCode}`)
      },
      getGoodsByBarcode(barcode){    
        return req.get(`${api.GoodsByBarcode}/${barcode}`)
      },
      getLodingOrUnloadingList(data) {
        return req.get(`${api.LodingOrUnloadingList}/${data.scheduleId}/${data.siteId}/${data.type}/${data.orderNum}`)
      }
}
module.exports = Cargo