// pages/signUp/signUp.js
const app = getApp()
const filter = require("../../utils/filter")
const Mcaptcha = require("../../utils/mcaptcha")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    code: '',
    name: '',
    phone: '',
    second: 0,
    sms: '',
    shenfen: '',
    ycode: '',
    userInfo: {},
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo
    })

    this.insert()
  },
  insert: function () {
    let that = this;
    if (!that.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; // 判断手机号码的正则
    if (that.data.phone.length < 11 || !myreg.test(that.data.phone)) {
      wx.showToast({
        title: '手机号格式有误',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let res = this.mcaptcha.validate(this.data.sms);
    if (!res) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!that.data.shenfen) {
      wx.showToast({
        title: '请选择注册类型',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.shenfen == 1) {
      if (that.data.ycode != 123) {
        wx.showToast({
          title: '邀请码错误',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    const db = wx.cloud.database();
    let data = that.data.userInfo;
    data.name = that.data.name
    data.phone = that.data.phone
    data.shenfen = that.data.shenfen
    db.collection('user').add({
      data,
      success: res => {
        wx.showToast({
          title: '注册成功',
          duration: 2000,
          complete: r => {
            debugger
            if (that.data.code) {
              wx.switchTab({
                url: '/pages/sign/sign?code=' + that.data.code + "&id=" + that.data.id,
              })
            } else {
              filter.loginCheck()
            }
          }
        })

      }

    })
  },
  changeShenfen: function (e) {
    this.setData({
      shenfen: e.detail.value
    })
  },
  sendSms: function () {
    let that = this;
    if (that.data.phone) {
      that.setData({
        second: 60
      })
      let currentTime = that.data.second
      const interval = setInterval(function () {
        currentTime--;
        that.setData({
          second: currentTime
        })
        if (currentTime <= 0) {
          clearInterval(interval)
        }
      }, 1000)

    }
  },
  onTap() {
    this.mcaptcha.refresh();
  },
  onLoad: function (options) {
    if (options) {
      this.setData({
        code: options.code,
        id: options.id
      })
    }
  },
  onReady: function () {
    this.mcaptcha = new Mcaptcha({
      el: 'canvas',
      width: 80,
      height: 35,
      createCodeImg: ""
    });
  }

})