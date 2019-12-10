//app.js
const utils = require("./utils/util");
const Login = require("./services/login");
const config = require("./config/config");

App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // wx.request({
        //   url: '',
        //   header: {
        //     'Content-Type': 'application/json'
        //   },
        //   success: function (res) {

        //   }
        // })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    //获取设备像素比
    const getPixelRatio = () => {
      let pixelRatio = 2
      wx.getSystemInfo({
        success: function (res) {
          pixelRatio = res.pixelRatio
        },
        fail: function () {
          pixelRatio = 2
        }
      })
      return pixelRatio
    };
    this.globalData.pixelRatio = getPixelRatio();
    const updateManager = wx.getUpdateManager()

    // 版本更新检测
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本更新失败再试？',
        // success(res) {
        //   if (res.confirm) {
        //     // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        //     updateManager.applyUpdate()
        //   }
        // }
      });
    })
    wx.setEnableDebug({
      enableDebug: false
    })
    this.refreshToken();
  },
  onHide: function () {
    clearInterval(this.refreshTime);
  },
  // 实时检测刷新token
  refreshToken() {
    this.refreshTime = setInterval(() => {
      const token = wx.getStorageSync('token');
      const expires_in = wx.getStorageSync('expires_in');
      const refreshToken = wx.getStorageSync('refresh_token');
      if (utils.validatenull(token)) {
        return
      }
      if (expires_in <= 1000 && !this.refreshLock) {
        this.refreshLock = true
        Login.refreshToken(refreshToken).then(res => {
          this.refreshLock = false
        }).catch(err => {
          this.refreshLock = false
          clearInterval(this.refreshTime)
        })
      }
      wx.setStorageSync('expires_in', expires_in - 10)
      // this.$store.commit('SET_EXPIRES_IN', this.data.expires_in  - 10)
    }, 10000)
  },
  globalData: {
    imgUrl:config.BASEIMG,
    userInfo: null,
    pixelRatio: 2,
    expires_in: "",
    refreshTime: "",
    refreshLock: false,
  },
})