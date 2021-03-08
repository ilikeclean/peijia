// components/student/detail/detail.js
const util = require('../../../pages/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    id: "",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      name: options.name
    })

    this.getList();
  },
  getList() {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('yuyue').where({
      userId: this.data.id
    }).orderBy('date', "desc").get({
      success: res => {
        this.setData({
          list: res.data
        })
        console.log(res.data)
      }
    })
  },

  go(e) {
    console.log(e)
    let classId = e.currentTarget.dataset.classid
    let newClass = e.currentTarget.dataset.newclass;
    //新课程，未预约，直接上课
    //先插入记录
    let that = this;
    if (newClass) {
      const db = wx.cloud.database();
      db.collection('yuyue').add({
        data: {
          userId: that.data.id,
          name: that.data.name,
          date: util.js_date_time(new Date()).substring(0, 10),
          teacherId: app.globalData.userId,
          startTime: '',
          endTime: '',
          payamount: '',
          model:'',
          fileID:'',
          gear:'',
          have:'',
          phone:'',
          latitude:'',
          longitude:'',
          region:'',
          street:''
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
          classId= + res._id
          
        }
      })
    }
    wx.navigateTo({
      url: '/pages/class/class?userId=' + that.data.id + '&classId=' + classId,
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})