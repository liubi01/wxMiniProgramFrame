// pages/arrivelStore/index.js
const app = getApp();
const commonMixin = require('../../mixins/commonMixin');
let { $Message } = require('../../components/base/index');
const Site = require('../../services/site');
const Cargo = require('../../services/cargo');
const Schedule = require('../../services/schedule');
Page(Object.assign({
  /**
   * 页面的初始数据
   */
  data: {
    pixelRatio: app.globalData.pixelRatio,
    imgUrl: app.globalData.imgUrl,
    bottomStatus: 0,//step //1准备配送 未开始2 已完成3 离开4,站点没有单5,6卸货中,7装货中 8全部完成
    siteId: "",
    orderNum: "",
    scheduleId: "",
    showCodeDialog: false,
    showLoadedDialog: false,
    code: "",
    detail: {
      // isVerification: false,//是否验证过了
      // dischargeCargo: true,
      // shipCargo: true
    },
    goodsType: 1,// 1装货 2卸货
    allComplete: false,//都操作完成
    isLast: false,
    goodsList: [],
    loadName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 'siteId': options.siteId, 'bottomStatus': options.bottomStatus, "orderNum": options.orderNum, "scheduleId": options.scheduleId, 'isLast': options.isLast });
    // this.getSiteDetailByIdFn();
  },
  onShow: function () {
    this.getSiteDetailByIdFn();
  },
  // 卸货
  dischargeCargo: function (e) {
    this.setData({ 'goodsType': e.detail.type })
    if (!this.data.detail.isVerification && this.data.orderNum != 0) {
      this.setData({ 'showCodeDialog': true });
    } else {
      this.toOperatePage();
    }
  },
  //装货
  shipCargo: function (e) {
    this.setData({ 'goodsType': e.detail.type })
    // if (!this.data.detail.isVerification && this.data.orderNum != 0) {
    //   this.setData({ 'showCodeDialog': true });
    // } else {
    // }
    this.toOperatePage();
  },
  //已装货
  loaded: function (e) {
    if (e.detail.info.alreadyLoading > 0) {
      this.setData({ 'loadName': "装货" });
      this.getLodingOrUnloadingListFn(1)
    } else {
      $Message({
        content: '已装货为空！',
        type: 'warning'
      });
    }
  },
  //已卸货
  unloaded: function (e) {
    if (e.detail.info.alreadyUnloading > 0) {
      this.setData({ 'loadName': "卸货" });
      this.getLodingOrUnloadingListFn(2)
    } else {
      $Message({
        content: '已卸货为空！',
        type: 'warning'
      });
    }
  },
  getLodingOrUnloadingListFn(flag) {
    let data = {
      scheduleId: this.data.detail.scheduleId,
      siteId: this.data.detail.siteId,
      orderNum: this.data.detail.orderNum,
      type: flag,
    }
    Cargo.getLodingOrUnloadingList(data).then(res => {
      this.setData({ 'goodsList': res.data, 'showLoadedDialog': true });
    })
  },
  confirmChecked: function () {
    this.setData({ 'showLoadedDialog': false });
  },
  checkCode() {
    if (this.data.code) {
      let data = {
        scheduleId: this.data.detail.scheduleId,
        siteId: this.data.detail.siteId,
        orderNum: this.data.detail.orderNum,
        verificationCode: this.data.code,
      }
      Cargo.checkVerificationCode(data).then(res => {
        if (res.data) {
          this.changeCodeDialog();
          $Message({
            content: '验证通过！',
            type: 'success'
          });
          this.toOperatePage();
        } else {
          $Message({
            content: '验证未通过！',
            type: 'warning'
          });
        }
      })
    } else {
      $Message({
        content: '验证码不能为空！',
        type: 'warning'
      });
    }
  },
  getSiteDetailByIdFn() {
    let data = {
      orderNum: this.data.orderNum,
      siteId: this.data.siteId,
      scheduleId: this.data.scheduleId
    }
    Site.getSiteDetail(data).then(res => {
      this.setData({ 'detail': res.data });
      this.checkComplete();
    })
  },
  checkComplete() {
    if (this.data.isLast == 'true') {
      this.setData({ 'bottomStatus': 6 });
    }
    // this.setData({ 'bottomStatus':  });
    // this.setData({ 'allComplete': false });//路线是否全部完成
    // if (this.data.detail.castNum == 0 && this.data.detail.getNum == 0) {
    // } else {
    //   this.setData({ 'allComplete': false });
    // }
  },
  cancelCheckCode() {
    this.changeCodeDialog();
  },
  changeCodeDialog() {
    this.setData({ 'showCodeDialog': !this.data.showCodeDialog });
  },
  toOperatePage() {
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/discharge-cargo/index?goodsType=' + this.data.goodsType + '&siteId=' + this.data.siteId + '&orderNum=' + this.data.orderNum + '&scheduleId=' + this.data.scheduleId + '&isLast=' + this.data.isLast
      })
    }, 500)
  },
  nextStep(e) {
    if (this.data.detail.castNum > 0 && this.data.detail.alreadyUnloading == 0) {
      $Message({
        content: '请先卸货!',
        type: 'warning'
      })
      return;
    }
    if (this.data.detail.getNum > 0 && this.data.detail.alreadyLoading == 0) {
      $Message({
        content: '请先装货!',
        type: 'warning'
      })
      return;
    }
    let btnStatus = e.detail.currentStatus;
    let data = {};
    data = {
      "currentSiteIndex": this.data.orderNum,
      "scheduleId": this.data.scheduleId,
      "siteId": this.data.siteId,
      "status": btnStatus
    };
    Schedule.updatedSchedule(data).then(res => {
      wx.redirectTo({
        url: '/pages/shiftDetail/index?routeId=' + this.data.scheduleId
      });
    })
    // switch (btnStatus) {
    //   case 2:
    //     data = {
    //       "currentSiteIndex": this.data.orderNum,
    //       "scheduleId": this.data.scheduleId,
    //       "siteId": this.data.siteId,
    //       "status": 2
    //     };
    //     Schedule.updatedSchedule(data).then(res => {
    //       wx.navigateTo({
    //         url: '/pages/shiftDetail/index?routeId=' + this.data.scheduleId
    //       });
    //     })
    //     break;
    //   case 4:
    //     data = {
    //       "currentSiteIndex": this.data.orderNum,
    //       "scheduleId": this.data.scheduleId,
    //       "siteId": this.data.siteId,
    //       "status": 4
    //     };
    //     Schedule.updatedSchedule(data).then(res => {
    //       wx.navigateTo({
    //         url: '/pages/shiftDetail/index?routeId=' + this.data.scheduleId
    //       });
    //     })
    //     break;
    // }
    // case 6:

    console.log(e.detail.currentStatus);
  }
}, commonMixin))