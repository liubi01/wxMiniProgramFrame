// pages/route-detail/index.js
const Schedule = require('../../services/schedule');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabs: 2,
    currentSelect: "1",//筛选
    page: 1,
    limit: 10,
    total: 0,
    type: 5,
    date:"",
    titleList: [
      {
        name: "昨日班次",
        key: "1",
      },
      {
        name: "近一周",
        key: "2",
      },
      {
        name: "近一个月",
        key: "3",
      },
      {
        name: "筛选",
        key: "4",
      },
    ],
    tableData: [
    ],
    pagenum: 1, //初始页默认值为1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getScheduleListFn();
  },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {
  //    console.log("asdf");
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.total > this.data.tableData.length) {
      this.setData({ 'page': ++this.data.page });
      this.getScheduleListFn();
    }
  },
  handleChange({ detail }) {
    switch (detail.key) {
      case "1": wx.redirectTo({
        url: '/pages/index/index'
      });
        break;
      case "2": break;
    }
  },
  handleSelectChange({ detail }) {
    this.setData({ currentSelect: detail.key });
    this.setData({ 'tableData': [] })
    if (detail.key != 4) {
      this.setData({'date':''});
      switch (detail.key) {
        case "1":
          this.setData({ type: 5 });
          break;
        case "2": this.setData({ type: 2 }); break;
        case "3": this.setData({ type: 3 }); break;
      }
      this.getScheduleListFn();
    }else{
      this.setData({type:4,date:detail.date});
      this.getScheduleListFn();
    }
  },
  getScheduleListFn() {
    Schedule.getScheduleList({ page: this.data.page, limit: this.data.limit, type: this.data.type,date:this.data.date}).then(res => {
      res.data.rows.map(item => {
        item.plannedStartTime = item.plannedStartTime.split(' ')[1];
      })
      let arr = this.data.tableData.concat(res.data.rows);
      this.setData({
        'tableData': arr, 'total': res.data.total
      });
    });
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  toDetail(e) {
    wx.navigateTo({
      url: "/pages/history-detail/index?id=" + e.detail.id,
    });
  },
})