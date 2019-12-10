const Config = require('./config.js');
const erpUrl = "/api/web/business";
const erpUserUrl = "/api/u";
const erpOrderUrl = "/api/o";
const erpProductUrl = "/api/p";
const erpAuthUrl = "/api/auth";
module.exports = {
    LoginUrl: Config.BASEURL + erpAuthUrl + '/oauth/token',//系统登录
    RefreshUrl: Config.BASEURL + erpAuthUrl + '/oauth/refreshtoken?',//系统登录
    ScheduleList: Config.BASEURL + erpUserUrl + '/logistic-schedule/page-h5-schedule-list',//系统登录
    ScheduleDetail: Config.BASEURL + erpUserUrl + '/logistic-schedule/get-h5-schedule-info',//班次配送详情
    SiteDetail: Config.BASEURL + erpUserUrl + '/logistic-schedule/get-h5-site-info',//站点详情
    UpdateSchedule: Config.BASEURL + erpUserUrl + '/logistic-schedule/update-schedule',//更新班次信息(手机端)
    LodingOrUnloading: Config.BASEURL + erpUserUrl + '/logistic-schedule/loading-or-unloading',//装货或者卸货
    CheckVerificationCode: Config.BASEURL + erpUserUrl + '/logistic-schedule/check-verification-code',//校验验证码
    GoodsByBarcode: Config.BASEURL + erpUserUrl + '/logistic-schedule/get-goods-by-bar-code',//扫码获取货物信息（手机端）
    LodingOrUnloadingList: Config.BASEURL + erpUserUrl + '/logistic-schedule/list-loading-and-unloading',//获取货物清单
}