// components/custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current: {
      type: String,
      value: '1',
      observer: 'changeCurrent'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[
      {
        name:"今日班次",
        key:"1",
      },
      {
        name:"历史班次",
        key:"2",
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeCurrent(key){
      key && (this.current = key);
      this.setData({current:this.current});
    },
    emitEvent(key) {
      this.triggerEvent('change', { key });
    },
    handleClickItem(e) {
      const key = e.currentTarget.dataset.key;
      this.changeCurrent(key);
      this.emitEvent(key);
    },
  }
})
