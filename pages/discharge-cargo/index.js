// pages/discharge-cargo/index.js
const app = getApp();
const commonMixin = require('../../mixins/commonMixin');
const Schedule = require('../../services/schedule');
const Site = require('../../services/site');
const Cargo = require('../../services/cargo');
let { $Message } = require('../../components/base/index');
const utils = require('../../utils/util.js');
Page(Object.assign({
  /**
   * 页面的初始数据
   */
  data: {
    pixelRatio: app.globalData.pixelRatio,
    imgUrl: app.globalData.imgUrl,
    showHandDialog: false,
    phoneNumber: "123",
    bottomStatus: 7,
    code: "",
    gooesTypeName: "",
    goodsList: [],//货物列表
    wGoodsList: [],//待装/卸列表
    goodsType: 1,
    detail: {
      num: 1,
      num2: 1,
    },
    scheduleId: '34',
    siteId: '29',
    orderNum: '0',
    siteDetailInfo: {},
    isLast: false,
    loadingOrNot: false, //默认选中待xx单模块
    flag: 3, //1已装货 2已卸货 3待装货 4待卸货
    currentDelIndex: "",
    handOrScan: 1,//1扫描 2手输
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 'siteId': options.siteId, 'goodsType': options.goodsType, "orderNum": options.orderNum, "scheduleId": options.scheduleId, 'isLast': this.options.isLast });
    this.setData({ 'goodsTypeName': this.data.goodsType == 1 ? '装货' : '卸货', 'flag': this.data.goodsType == 1 ? 3 : 4 })
    this.setData({ 'bottomStatus': this.data.goodsType == 1 ? '8' : '7' })
    wx.setNavigationBarTitle({
      title: this.data.goodsTypeName  //修改title
    })
    this.getSiteDetailFn();
    this.getLodingOrUnloadingListFn();
    this.setAnimation();
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
  getSiteDetailFn() {
    let data = {
      scheduleId: this.data.scheduleId,
      siteId: this.data.siteId,
      orderNum: this.data.orderNum,
    }
    Site.getSiteDetail(data).then(res => {
      let data = res.data;
      this.setData({
        'siteDetailInfo': {
          address: data.address,
          castNum: data.castNum,
          deptName: data.deptName,
          siteName: data.siteName,
          siteNum: data.siteNum,
          status: data.status,
          tel: data.tel,
          getNum: data.getNum,
          deptCode: data.deptCode
        }
      });
    })
  },
  getLodingOrUnloadingListFn(flag) {
    let data = {
      scheduleId: this.data.scheduleId,
      siteId: this.data.siteId,
      orderNum: this.data.orderNum,
      type: this.data.flag
    }
    Cargo.getLodingOrUnloadingList(data).then(res => {
      this.setData({ 'wGoodsList': res.data });
    })
  },
  scan() {
    let that = this;
    this.setData({ 'handOrScan': 1 });
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: function (res) {
        if (res.result) {
          that.setData({ 'code': res.result });
          that.checkCode();
        }
      },
      fail: function (res) {

      },
    });
  },
  recallScan() {
    if (this.data.handOrScan == 1) {
      setTimeout(function(){
        this.scan();
      }.bind(this), 500);
    }
  },
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.siteDetailInfo.tel,
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {

      },
    })
  },
  changeLoadingBox(e) {
    let type = e.currentTarget.dataset.type, temp = "";
    temp = type === 'false' ? false : true;
    this.setData({ 'loadingOrNot': temp, 'currentDelIndex': '' });
  },
  handInput() {
    this.setData({ 'handOrScan': 2 });
    this.setData({ 'showHandDialog': !this.data.showHandDialog });
  },
  checkCode() {
    if (this.data.code) {
      if (this.isDuplicateBySn(this.data.code)) {
        $Message({
          content: '条码不能重复添加！',
          type: 'warning'
        });
        this.recallScan();
        return
      }
      Cargo.getGoodsByBarcode(this.data.code).then(res => {
        if (res.data) {
          this.isDuplicateInWgoodsListAndDel(this.data.code);
          this.data.goodsList.push(res.data);
          this.setData({ 'goodsList': this.data.goodsList });
          this.setData({ 'showHandDialog': false });
          $Message({
            content: "添加通过！",
            type: 'success'
          })
        } else {
          $Message({
            content: "条码验证未通过！",
            type: 'warning'
          })
        }
        this.recallScan();
      }).error(err => {
        this.recallScan();
      })
    } else {
      $Message({
        content: '验证码不能为空！',
        type: 'warning'
      });
    }
  },
  delGoodsItem(e) {
    let index = e.currentTarget.dataset.key;
    let temp = this.data.goodsList.splice(index, 1);
    this.data.wGoodsList.push(temp[0]);
    // this.setData({ 'goodsList': this.data.goodsList, 'wGoodsList': this.data.wGoodsList});
    this.setData({ 'currentDelIndex': temp[0].barCode });
    setTimeout(function () {
      this.setData({ 'goodsList': this.data.goodsList, 'wGoodsList': this.data.wGoodsList });
    }.bind(this), 500);
    $Message({
      content: '删除成功！',
      type: 'success'
    });
  },
  addGoodsItem(e) {
    let index = e.currentTarget.dataset.key;
    let temp = this.data.wGoodsList.splice(index, 1);
    this.data.goodsList.push(temp[0]);
    this.setData({ 'currentDelIndex': temp[0].barCode });
    setTimeout(function () {
      this.setData({ 'goodsList': this.data.goodsList, 'wGoodsList': this.data.wGoodsList });
    }.bind(this), 500);
    $Message({
      content: '添加成功！',
      type: 'success'
    });
  },
  cancelCheckCode() {
    this.setData({ 'showHandDialog': !this.data.showHandDialog });
  },
  isDuplicateBySn(barCode) {
    return this.data.goodsList.some(item => {
      return item.barCode === barCode
    })
  },
  isDuplicateInWgoodsListAndDel(barCode) {
    this.data.wGoodsList.map((item, index) => {
      if (item.barCode === barCode) {
        this.data.wGoodsList.splice(index, 1);
        this.setData({ 'wGoodsList': this.data.wGoodsList });
        return;
      }
    })
  },
  nextStep() {
    // 1是装货 2是卸货
    if (this.data.goodsList.length > 0) {
      let params = {
        barCode: [],
        deptCode: this.data.siteDetailInfo.deptCode,
        scheduleId: this.data.scheduleId,
        siteId: this.data.siteId,
        status: this.data.goodsType,
        orderNum: this.data.orderNum
      }
      this.data.goodsList.forEach(item => {
        params.barCode.push(item.barCode)
      })
      Schedule.postLoadingOrUnloading(params).then(res => {
        let message = this.data.goodsType == 1 ? "装货成功" : "卸货成功";
        $Message({
          content: message,
          type: 'success'
        })
        let data = { 'siteId': this.data.siteId, "orderNum": this.data.orderNum, "bottomStatus": this.data.orderNum == 0 ? 2 : 4, "scheduleId": this.data.scheduleId, "isLast": this.data.isLast };
        // wx.redirectTo({
        //   url: '/pages/arrivelStore/index?' + utils.qsString(data)
        // })
        wx.navigateBack({
          delta: 1
        })
      })
    } else {
      $Message({
        content: `请添加${this.data.goodsType == 1 ? '装货' : '卸货'}条码`,
        type: 'warning'
      })
    }
  },
  setAnimation() {
    let animation = wx.createAnimation({
      timingFunction: "ease"
    });
    animation.translateY('-100%').opacity(0).step({ duration: 500 }).opacity(1).translateY(0).step({ duration: 0 });
    this.setData({ 'fadeOutUp': animation.export() });
  },
}, commonMixin))