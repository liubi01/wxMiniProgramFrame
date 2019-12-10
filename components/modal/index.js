// components/modal/index.js
let app = getApp();
Component({
  externalClasses: ['i-class', 'i-class-mask'],
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: Number,
      value: 1 //1确认取消 2纯数据展示
    },
    visible: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    showOk: {
      type: Boolean,
      value: true
    },
    showCancel: {
      type: Boolean,
      value: true
    },
    okText: {
      type: String,
      value: '确定'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClickItem({ currentTarget = {} }) {
      const dataset = currentTarget.dataset || {};
      const { index } = dataset;
      this.triggerEvent('click', { index });
    },
    handleClickOk() {
      this.triggerEvent('ok');
    },
    handleClickCancel() {
      this.triggerEvent('cancel');
    },
    closeBtn() {
      this.setData({ 'visible': false });
    },
  }
})
