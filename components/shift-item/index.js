// components/shift-item/index.js
Component({
  externalClasses: ['self-item'],
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    },
    index:{
      type:Number,
      value:'',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail() {
      this.triggerEvent('todetail', this.data.item);
    },
  }
})
