//index.js
//获取应用实例
const Schedule = require('../../services/schedule');
const Login = require('../../services/login');
const app = getApp()
Page({
  data: {
    pixelRatio: app.globalData.pixelRatio,
    imgUrl: app.globalData.imgUrl,
    page: 1,
    limit: 10,
    total: 0,
    driverInfo: {},
    isShowLogout: false,
    missions: [
      // {
      //   name: "ss",
      //   status: 1,
      //   id: "1",
      // },
      // {
      //   status: 2,
      // },
      // {
      //   status: 2,
      // },
      // {
      //   status: 2,
      // },
      // {
      //   status: 2,
      // },
    ],//任务列表
    currentTabs: 1,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  handleChange({ detail }) {
    switch (detail.key) {
      case "1": break;
      case "2": wx.redirectTo({
        url: '/pages/history-list/index'
      })
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({ 'driverInfo': wx.getStorageSync('driverInfo') });
  },
  onShow: function () {
    this.setData({ currentTabs: 1 });
    this.setData({ 'page': 1 });
    this.setData({ 'missions': [] });
    this.getScheduleListFn();
  },
  getScheduleListFn() {
    Schedule.getScheduleList({ page: this.data.page, limit: this.data.limit }).then(res => {
      res.data.rows.map(item => {
        item.plannedStartTime = item.plannedStartTime.split(' ')[1];
      })
      let arr = this.data.missions.concat(res.data.rows);
      this.setData({
        'missions': arr, 'total': res.data.total
      });
    });
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReachBottom: function () {
    if (this.data.total > this.data.missions.length) {
      this.setData({ 'page': ++this.data.page });
      this.getScheduleListFn();
    }
  },
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/shiftDetail/index?routeId=' + e.detail.id
    })
  },
  logout() {
    this.setData({ 'isShowLogout': true });
  },
  comfirmOut(e) {
    Login.logoutFn();
  },
  cancelOut(e) {
    this.setData({ 'isShowLogout': false });
  },
})
