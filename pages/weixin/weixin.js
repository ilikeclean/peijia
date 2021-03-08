//index.js
const app = getApp()
const filter = require('../../utils/filter')
Page({
  data: {},
  login: function () {
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openid)
        
        var openid = res.result.openid;
        app.globalData.openid= openid
        this.setData({
          openid: openid
        })
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  app.globalData.userInfo = res.userInfo
                }
              })
            }
          }
        })
        //获取用户
        filter.loginCheck();
      }
    })
  },

  onLoad: function () {}
})