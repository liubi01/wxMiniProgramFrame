const api = require("../config/api.js");
const req = require("../utils/req.js");
const Site = {
    getSiteDetail(data) {
        if (data.scheduleId) {
            return req.get(`${api.SiteDetail}/${data.scheduleId}/${data.siteId}/${data.orderNum}`)
        }
    },
}
module.exports = Site