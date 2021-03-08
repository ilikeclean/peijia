// components/work/work.js
const app = getApp()
const date = require('../../pages/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    add: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getList: function () {
      const db = wx.cloud.database()
      db.collection('work').where({
        _openid: app.globalData.openid
      }).orderBy('time','desc')
      .get({
        success: res => {
          this.setData({
            list: res.data
          })
        }
      })
    },
    add: function() {
      this.setData({
        add: !this.data.add
      })
    },
    save: function(){
      const db = wx.cloud.database()
      db.collection('work').add({
        data:{
          content: this.data.content,
          time: date.js_date_time(new Date())
        },
        success: res=>{
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1500
          })
          this.setData({
            add: false,
            content: ''
          })
          this.getList()
        }
      })
    },
    delete: function (e) {
      wx.showModal({
        title: '提示',
        content: '确定要删除该记录吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('点击确定了');
            const db = wx.cloud.database()
            db.collection('work').doc(e.currentTarget.dataset.id).remove({
              success: res => {
                this.getList()
              }
            })
          } else if (res.cancel) {
            console.log('点击取消了');
            return false;
          }

        }

      })
    }
  },
  lifetimes: {
    attached: function () {
      this.getList()
    }
  }
})