// components/title/index.js
const app = getApp();
Component({
  externalClasses: ['self-item'],
  /**
   * 组件的属性列表
   */        
  properties: {
      title:{
        type:Object, 
        value:{}
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

  }
})
