const api = require("../config/api.js");
const req = require("../utils/req.js");
const Schedule = {
    getScheduleList(params) {
        // type 1当天 2近一周 3近一个月 4历史 5昨天
        let data = {
            isDriver: true,
            startDate: params.date || '',
            endDate: params.date || '',
            type: params.type || 1
        }
        return req.post(`${api.ScheduleList}?perPage=${params.limit}&page=${params.page}`, {
            data: data
        })
    },
    getScheduleDetailById(scheduleId) {
        if (scheduleId) {
            return req.get(`${api.ScheduleDetail}/${scheduleId}`)
        }
    },
    updatedSchedule(data) {
        return req.put(`${api.UpdateSchedule}`,{
            data:{
                "currentSiteIndex": data.currentSiteIndex,
                "scheduleId": data.scheduleId,
                "siteId": data.siteId,
                "status": data.status
            }
        });
    },
    postLoadingOrUnloading(params) {
        return req.post(api.LodingOrUnloading, {
            data: params
        })
    }
}
module.exports = Schedule