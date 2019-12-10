// components/destination/index.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: ''
    },
    current: {
      type: Number,
      value: "",
    },
    type: {
      type: Number,
      value: 1, //1当前到店有logo 2纯文本
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pixelRatio: app.globalData.pixelRatio,
    imgUrl: app.globalData.imgUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    call(e) {
      if(this.data.item.tel){
        wx.makePhoneCall({
          phoneNumber: this.data.item.tel
        })
      }else{
        wx.showToast({
          title: '暂无手机号！',
          image:'{{imgUrl}}/icon_error.png'
        })
      }
    },
  }
})
