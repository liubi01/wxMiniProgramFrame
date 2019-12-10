// pages/shiftDetail/index.js
const Schedule = require('../../services/schedule');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shiftId: "",
    currentData: {},//当前数据
    nextData: {},//下个站点信息
    infoTitle: {},//显示的title目的地
    currentStatus: 1,//当前运送bottom状态 //1准备配送 未开始2 已完成3 离开4,站点没有单5,6卸货中,7装货中 8全部完成 
    //  
    currentSiteIndex: 0,//当前站点索引值
    nextSiteIndex: 0,//下个站点索引值
    topItem: {},
    isLast: false,
    routeList: [
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 'shiftId': options.routeId });
  },
  onShow: function () {
    this.getScheduleDetailFn();
  },
  getScheduleDetailFn: function () {
    Schedule.getScheduleDetailById(this.data.shiftId).then(res => {
      let data = res.data;
      this.setData({
        'topItem': {
          scheduleSn: data.scheduleSn,
          plannedStartTime: data.plannedStartTime.split(' ')[1],
          routeName: data.routeName,
          siteNum: data.siteNum,
          status: data.status
        }
      });
      //站点索引值
      let tempIndex = data.currentSiteIndex || 0
      this.setData({ 'currentSiteIndex': tempIndex })
      data.outH5ScheduleSiteInfos.map((item, index) => {
        if (data.outH5ScheduleSiteInfos.length - 1 == index) {
          item.isLast = true;
        } else {
          item.isLast = false;
        }
      })
      this.setData({ 'currentData': data.outH5ScheduleSiteInfos[this.data.currentSiteIndex] })
      // if (this.data.currentSiteIndex && (this.data.currentSiteIndex == data.outH5ScheduleSiteInfos.length - 1) || ((this.data.currentSiteIndex == data.outH5ScheduleSiteInfos.length - 2) && (this.data.currentData.status == 2 || this.data.currentData.status == 3))) {//最后一个
      //   this.setData({ 'isLast': true });
      // }
      if (!this.data.currentData.isLast) {
        this.setData({ 'nextSiteIndex': ++tempIndex })
        //目的地
        this.setData({ 'nextData': data.outH5ScheduleSiteInfos[this.data.nextSiteIndex] })
      }
      /**
       * 初始化
      */
      if (this.data.currentData.status == 0 || this.data.currentData.status == 1 || this.data.currentData.isLast) {
        this.setData({ 'infoTitle': this.data.currentData });
      } else {
        this.setData({ 'infoTitle': this.data.nextData });
      }

      //运单状态
      if ((this.data.currentData.status == 2 || this.data.currentData.status == 3) && (this.data.nextData.getNum != 0 || this.data.nextData.castNum != 0 || this.data.nextData.isLast)) {//上个站点已离开&下个站点有货
        this.setData({ 'currentStatus': 3 }); //确认到达
      }
      //当前离店-下个待装卸为0；
      if ((this.data.currentData.status == 2 || this.data.currentData.status == 3)&& this.data.nextData.getNum == 0 && this.data.nextData.castNum == 0 && !this.data.nextData.isLast) {//已离开
        this.setData({ 'currentStatus': 5 }); //跳过无件站点
      }
      //不展示
      if (this.data.currentData.status == 1 || (this.data.currentData.isLast && this.data.currentData.status == 2)) {
        this.setData({ 'currentStatus': 9 });
      }
      // //不展示 当前站点-到店-有货待完成
      // if (this.data.currentSiteIndex != 0 && (this.data.currentData.getNum != 0 || this.data.currentData.castNum != 0) && this.data.currentData.status == 1) {
      //   this.setData({ 'currentStatus': 9 });
      // }
      // //中间无件站点跳过
      // if (this.data.currentSiteIndex != 0 && this.data.currentData.getNum == 0 && this.data.currentData.castNum == 0 && this.data.currentData.status != 3) {
      //   this.setData({ 'currentStatus': 5 });
      // }
      //站点路线
      this.setData({ 'routeList': data.outH5ScheduleSiteInfos });
    })
  },
  nextStep(e) {//点击后的callBack
    let btnStatus = e.detail.currentStatus;
    let data = {};
    switch (btnStatus) {
      //1准备配送 开始发车2 已到店3 离开4,站点没有单5,6全部完成 6卸货中,7装货中
      case 1: this.setData({ "currentStatus": 1 });
        data = {
          "currentSiteIndex": this.data.currentData.orderNum,
          "scheduleId": this.data.currentData.scheduleId,
          "siteId": this.data.currentData.siteId,
          "status": btnStatus
        };
        Schedule.updatedSchedule(data).then(res => {
          wx.navigateTo({
            url: `/pages/arrivelStore/index?siteId=${this.data.currentData.siteId}&scheduleId=${this.data.currentData.scheduleId}&orderNum=${this.data.currentData.orderNum}&bottomStatus=${2}&isLast=${this.data.currentData.isLast}`,
          });
        })
        break;
      case 3://确认到达
        this.toSite(this.data.nextData, btnStatus);
        break;
      case 5://跳过当前站点
        this.changeStatusFn(this.data.nextData, btnStatus);
        break;
    }
  },
  changeStatusFn(params, btnStatus) {
    let data = {
      "currentSiteIndex": params.orderNum,
      "scheduleId": params.scheduleId,
      "siteId": params.siteId,
      "status": btnStatus
    };
    Schedule.updatedSchedule(data).then(res => {
      this.getScheduleDetailFn();
    });
  },
  toSite(params, btnStatus) {
    let data = {
      "currentSiteIndex": params.orderNum,
      "scheduleId": params.scheduleId,
      "siteId": params.siteId,
      "status": btnStatus
    };
    Schedule.updatedSchedule(data).then(res => {
      // this.getScheduleDetailFn();
      wx.navigateTo({
        url: `/pages/arrivelStore/index?siteId=${params.siteId}&scheduleId=${params.scheduleId}&orderNum=${params.orderNum}&bottomStatus=${4}&isLast=${params.isLast}`,
      });
    });
  },
  //site
  stepClick(e) {
    let btnStatus = 0;
    if (e.detail.status == 1 || e.detail.status == 2 || e.detail.status == 3) {
      //是否离开--不显示 确认到店 开始站点-显示开始发车 不是开始站点&结束站点显示离开
      btnStatus = (e.detail.status == 2 || e.detail.status == 3) ? 9 : e.detail.orderNum == 0 ? 2 : this.data.isLast ? 6 : 4;
      wx.navigateTo({
        url: `/pages/arrivelStore/index?siteId=${e.detail.siteId}&scheduleId=${e.detail.scheduleId}&orderNum=${e.detail.orderNum}&bottomStatus=${btnStatus}&isLast=${e.detail.isLast}`,
      });
    }
  },
})