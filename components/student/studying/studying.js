// components/student/studying/studying.js
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
    list:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    go: function(e){
      let id = e.currentTarget.id
      wx.navigateTo({
        url: '/pages/class/class?id='+id,
      })
    }
  },
  
  lifetimes: {
    attached: function(){
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('yuyue').where({
        endTime: _.eq(''),
        teacherId: app.globalData.id
      }).get({
        success: res=>{
          this.setData({
            list: res.data
          })
          console.log()
        }
      })
    }
  },

  pageLifetimes: {
    show() {
      
    }
  }

})
