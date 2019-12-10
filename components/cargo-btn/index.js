// components/cargo-btn/index.js
const app = getApp();
let { $Message } = require('../base/index');
Component({
    externalClasses: ['self-item'],
    /**
     * 组件的属性列表
     */
    properties: {
        type: {
            type: Number,
            value: 1,//2卸货 1装货20190019253
        },
        iscomplete: {//装卸货是否完成
            type: Boolean,
            value: false,
        },
        item: {
            type: Object,
            value: {}
        },
        // currentSiteIndex:{
        //   type:Number,
        //   value:0
        // },
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
        tapEvent() {
            if (this.data.item.status == 2 || this.data.item.status == 3) {
                this.triggerEvent('loading', { info: this.data.item });
                return
            }
            if (this.data.item.getNum == 0 && this.data.type == 1) {
                $Message({
                    content: '已装货完成！',
                    type: 'success'
                });
                return
            }
            if (this.data.item.castNum !== 0 && this.data.type == 1) {
                $Message({
                    content: '请先完成卸货！',
                    type: 'warning'
                });
                return
            }
            if (this.data.item.castNum == 0 && this.data.type == 2) {
                $Message({
                    content: '已卸货完成！',
                    type: 'success'
                });
                return
            }
            this.triggerEvent('change', { type: this.data.type });
        },
    }
})
