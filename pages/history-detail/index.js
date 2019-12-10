// pages/history-detail/index.js
const Schedule = require('../../services/schedule');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shiftId: "",
    stepCurrent: 0,//
    detail: {
    },
    topItem:{},
    routeList: [
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 'shiftId': options.id });
    this.getScheduleDetailFn();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //详情
  getScheduleDetailFn: function () {
    Schedule.getScheduleDetailById(this.data.shiftId).then(res => {
      let data = res.data;
      this.setData({
        'topItem': {
          scheduleSn: data.scheduleSn,
          plannedStartTime: data.plannedStartTime.split(' ')[1],
          // plannedStartTime: data.plannedStartTime,
          routeName: data.routeName,
          siteNum: data.siteNum,
          status: data.status,
        }
      });
      //目的地
      // this.setData({ 'detail': data.outH5ScheduleSiteInfos[0] })
      //站点路线
      this.setData({ 'routeList': data.outH5ScheduleSiteInfos});
      this.setData({ 'stepCurrent': data.currentSiteIndex});
    })
  },
  // handleClick() {
  //   const addCurrent = this.data.stepCurrent + 1;
  //   const current = addCurrent > 2 ? 0 : addCurrent;
  //   this.setData({
  //     'stepCurrent': current
  //   })
  // },
  stepClick(e) {
    let btnStatus = 0;
    if (e.detail.status == 1 || e.detail.status == 2 || e.detail.status == 3) {
      //是否离开--不显示 确认到店 开始站点-显示开始发车 不是开始站点显示离开
      btnStatus = (e.detail.status == 2 || e.detail.status == 3) ? 9 : e.detail.orderNum == 0 ? 2 : 4;
      wx.navigateTo({
        url: `/pages/arrivelStore/index?siteId=${e.detail.siteId}&scheduleId=${e.detail.scheduleId}&orderNum=${e.detail.orderNum}&bottomStatus=${btnStatus}`,
      });
    }
  },

})