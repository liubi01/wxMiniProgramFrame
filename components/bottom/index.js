// components/bottom/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Number,
      value: '0', //1准备配送 确认发车2 已到店3 离开4,站点没有单5,6全部完成,7卸货中,8装货中 9 不展示
      observer: '_updateDataChange'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentName: "",
    isShow:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _updateDataChange() {
      switch (this.data.status) {
        case 1: this.setData({ 'currentName': "准备配送" }); break;
        case 2: this.setData({ 'currentName': "确认发车" }); break;
        case 3: this.setData({ 'currentName': "确认到达" }); break;
        case 4: this.setData({ 'currentName': "确认离开" }); break;
        case 5: this.setData({ 'currentName': "跳过无件站点" }); break;
        case 6: this.setData({ 'currentName': "配送完成" }); break;
        case 7: this.setData({ 'currentName': "卸货完成" }); break;
        case 8: this.setData({ 'currentName': "装货完成" }); break;
        case 9: this.setData({ 'isShow': false }); break;
      }
    },
    nextStep() {
      this.triggerEvent('change', { currentStatus: this.data.status });
    },
  }
})
