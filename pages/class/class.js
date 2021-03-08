// pages/class/class.js
import util from '../util';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    class: {},
    latitude: '',
    longitude: '',
    markers: [],
    acodeUrl: '',
    index: '',
    id: '',
    setting: false
  },

  start: function (e) {
    this.clear()
    //开始上课,生成二维码
    this.getQrCode(1);

  },
  end: function (e) {
    this.clear()
    //下课
    this.getQrCode(2);
  },
  getQrCode(e) {
    wx.showLoading({
      title: '加载中',
    })

    var that = this
    var path = 'pages/sign/sign'
    var width = '430';
    console.log(e)
    wx.cloud.callFunction({
      name: 'getQrCode',
      data: {
        page: path,
        width: width,
        scene: 'code=' + e + '&classId=' + that.data.classId + '&userId=' + that.data.userId,
      },
      success: res => {
        console.log(res)
        that.setData({
          acodeUrl: res.result[0].tempFileURL
        })
      },
      complete: res => {
        wx.hideLoading()
      }
    });
  },
  clear: function () {
    this.setData({
      acodeUrl: ''
    })
  },

  stop() {
    //直接结束本次课程
    let endTime = util.js_date_time(new Date())
    const db = wx.cloud.database()
    db.collection('yuyue').where({
      userId: this.data.userId,
      _id: this.data.classId
    }).update({
      data: {
        endTime: endTime
      },
      success: r => {
        //弹出提示课程结束
        wx.showToast({
          title: '课程已结束',
          icon: 'none',
          duration: 2000,
          complete: r => {
            //返回上一页
            wx.navigateBack()
          }
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    this.setData({
      userId: options.userId, //当前学生的id
      classId: options.classId
    })

    //获取该用户的课程
    const db = wx.cloud.database()
    db.collection('yuyue').where({
      userId: options.userId,
      _id: options.classId
    }).orderBy('date', 'desc').get({
      success: res => {
        console.log(res)
        if (res.data.length == 0) {
          //没有预约,可以开新课程
        } else {
          //如果没有结束时间，可以主动下课
          this.setData({
            class: res.data[0]
          })
          if (res.data[0].startTime) {

            setInterval(function () {
              //上课时长 
              let now = res.data[0].endTime? res.data[0].endTime: util.js_date_time(new Date())
              let t = Date.parse(now) - Date.parse(res.data[0].startTime)
              let time = "";
              if (t / 1000 / 60 / 60 / 24 >= 1) {
                time += parseInt(t / 1000 / 60 / 60 / 24) + '天'
                t %= (1000 * 60 * 60 * 24)
              }
              if (t > 0) {
                time += parseInt(t / 1000 / 60 / 60) + '时'
                t %= (1000 * 60 * 60)
              }
              if (t > 0) {
                time += parseInt(t / 1000 / 60) + '分'
              }

              that.setData({
                time: time
              })


            }, 1000);
          }

        }
      }
    });

  },
  map: function () {
    wx.openLocation({
      latitude: this.data.class.latitude,
      longitude: this.data.class.longitude,
      scale: 18
    })
  },
  getLocation: function () {
    let that = this;
    wx.chooseLocation({
      success: res => {
        console.log(res)
        that.setData({
          ['class.latitude']: res.latitude,
          ['class.longitude']: res.longitude,
          ['class.region']: res.name,
          ['class.street']: res.address
        })
        //数据库修改信息
        const db = wx.cloud.database()
        db.collection('yuyue').doc(that.data.classId)
          .update({
            data: {
              latitude: res.latitude,
              longitude: res.longitude,
              region: res.name,
              street: res.address
            }
          })

      }
    })
  },

  openSetting: function () {
    wx.openSetting({
      withSubscriptions: true,
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {
        console.log(res.authSetting)
        if (res.authSetting["scope.userLocation"]) {
          this.getLocation()
          this.setData({
            setting: false
          })
        } else {}
      },
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