// components/tabs/index.js
Component({
  relations: {
    '../tabs/index': {
      type: 'parent'
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    key: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    date: {
      type: Date,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    current: false,
    currentColor: '',
    scroll: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeCurrent(current) {
      this.setData({ current });
    },
    changeCurrentColor(currentColor) {
      this.setData({ currentColor });
    },
    changeScroll(scroll) {
      this.setData({ scroll });
    },
    bindDateChange(e) {
      const parent = this.getRelationNodes('../tabs/index')[0];
      parent.emitEvent(this.data.key, e.detail.value);
    },
    handleClickItem() {
      const parent = this.getRelationNodes('../tabs/index')[0];
      parent.emitEvent(this.data.key);
    }
  }
})
