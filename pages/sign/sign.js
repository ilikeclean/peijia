// pages/sign/sign.js
const app = getApp()
const date = require('../util')
const filter = require('../../utils/filter')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '',
    endTime: '',
    code: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //首次进入该页面，没有传参，则查询上一次课程
    console.log(options)
    this.setData({
      code: options.code,
      classId: options.classId
    })

    filter.loginCheck(options)
    console.log(date.js_date_time(new Date()))
    let openid;
    if (!app.globalData.openid) {
      wx.cloud.callFunction({
        name: 'getOpenid',
        complete: res => {
          app.globalData.openid = res.result.openid;
          openid = res.result.openid;
        }
      })
    }else{
      openid = app.globalData.openid
    }
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('yuyue').where(_.or([
      {
        _openid: openid
      },
      {
        userId: app.globalData.userId
      }]).and(
      {
        _id: options.classId,
      }))
      .orderBy('startTime','desc').get({
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          this.setData({
            startTime: res.data[0].startTime,
            endTime: res.data[0].endTime
          })
        }
      }
    })
  },
  getUrlParam(url,param) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|\\?|&)" + param + "=([^&]*)(&|$)");
    //匹配目标参数
    var r = url.match(reg);
    //返回参数
    if (r != null) {
      console.log(r)
        return unescape(r[2]);
    } else {
        return null;
    }

  },
  scan: function (param) {
    let that = this;
    const db = wx.cloud.database();
    wx.scanCode({
      success(res) {
        const time = date.js_date_time(new Date())
        console.log(time)
        if(res.path){
          that.setData({
            classId: that.getUrlParam(res.path,'classId'),
            code: that.getUrlParam(res.path,'code'),
            userId: that.getUrlParam(res.path,'userId')
          })
        }
        if(app.globalData.userId && app.globalData.userId!=that.data.userId){
          wx.showToast({
            title: '二维码无效(非该用户课程)，请重新扫描',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if(param.code && that.data.code!=param.code){
          wx.showToast({
            title: '二维码无效，请重新扫描'+param.code==1?'上':'下'+'课码',
            icon: 'none',
            duration: 2000
          })
          return
        }
        //提醒上下课
        if (that.data.code == 1) {
          db.collection('yuyue').where({
            _id: that.data.classId,
            userId: app.globalData.userId
          }).update({
            data: {
              startTime: time
            },
            success: r => {
              that.setData({
                startTime: time
              })
            }
          })
        } else if (that.data.code == 2) {
          db.collection('yuyue').where({
            _id: that.data.classId,
            userId: app.globalData.userId
          }).update({
            data: {
              endTime: time
            },
            success: r => {
              that.setData({
                endTime: time
              })
              wx.navigateTo({
                url: '/pages/order/orderInfo/orderInfo?cid=' + that.data.classId,
              })
            }
          })
        }
      }
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