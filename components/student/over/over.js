// components/student/over/over.js
const app = getApp()
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

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  lifetimes: {
    attached: function(){
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('yuyue').where({
        endTime: _.neq(''),
        teacherId: app.globalData.id
      }).get({
        success: res=>{
          this.setData({
            list: res.data
          })
          console.log(res.data)
        }
      })
    }
  }
})
