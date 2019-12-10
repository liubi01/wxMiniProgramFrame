// pages/login/login.js
let app = getApp();
var commonMixin = require('../../mixins/commonMixin')
const Login = require('../../services/login');
const Schedule = require('../../services/schedule');
Page(
  Object.assign({

    /**
     * 页面的初始数据
     */
    data: {
      pixelRatio: app.globalData.pixelRatio,
      imgUrl: app.globalData.imgUrl,
      userInfo: {
        userName: "",
        password: "",
      },
      // expires_in: "",
      // refreshTime: "",
      // refreshLock: false,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let token = wx.getStorageSync('token');
      if (token) {
        wx.redirectTo({
          url: "/pages/index/index"
        })
      }

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
    loginTap() {
      if (this.data.userInfo.userName && this.data.userInfo.password) {
        Login.loginFn(this.data.userInfo.userName, this.data.userInfo.password).then(res => {
          wx.setStorageSync("token", res.access_token);
          wx.setStorageSync("refresh_token", res.refresh_token);
          wx.setStorageSync("expires_in", res.expires_in);
          wx.setStorageSync("driverInfo", res);
        }).then(() => {
          wx.redirectTo({
            url: "/pages/index/index"
          })
        });
      }
    },
  }, commonMixin))