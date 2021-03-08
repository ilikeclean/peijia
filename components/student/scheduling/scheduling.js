// components/student/scheduling/scheduling.js
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
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getList() {
      const db = wx.cloud.database()
      const _=db.command
      db.collection('user').where({
        shenfen: _.eq("2")
      }).get({
        success: res => {
          this.setData({
            list: res.data
          })
          console.log(res.data)
        }
      })
    },


    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX
      })
    },

    // ListTouch计算方向
    ListTouchMove(e) {
      this.setData({
        ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
      })
    },

    // ListTouch计算滚动
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection == 'left') {
        this.setData({
          modalName: e.currentTarget.dataset.target
        })
      } else {
        this.setData({
          modalName: null
        })
      }
      this.setData({
        ListTouchDirection: null
      })
    },
    
    top(e){
      wx.showToast({
        title: '功能正在开发中...',
        icon: 'none'
      })
      return 
    },
    delete(e){
      wx.showToast({
        title: '功能正在开发中...',
        icon: 'none'
      })
      return 
      console.log(e.currentTarget.id)
      wx.showModal({
        title: '提示',
        content: '确定要删除该学员吗?删除后不可恢复',
        success: function (res) {
          if (res.confirm) {
            console.log('点击确定了');
            const db = wx.cloud.database()
            db.collection('user').where({
              _id:e.currentTarget.id
            }).remove({
              success: res => {
                console.log(res)
                this.getList()
              },
              fail: res=>{
                console.log(res,"删除失败")
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
      this.getList();
    }
  }
})