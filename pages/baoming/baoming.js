// pages/baoming/baoming.js
import util, {
  js_date_time
} from '../util';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    name: '',
    sex: '',
    phone: '',
    region: '',
    street: '',
    date: '',
    fileID: '',
    imgList: [],
    gear: '',
    model: '',
    have: '',
    index: 0,
    teachers: [],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date: util.js_date_time(new Date()).substring(0, 10),
      uid: app.globalData.userInfo.openId
    })
    this.getTeachers()
  },
  getTeachers() {
    const db = wx.cloud.database();
    const _ = db.command
    db.collection('user').where({
      shenfen: _.eq("1")
    }).field({
      nickName: true
    }).get({
      success: res => {
        this.setData({
          teachers: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
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

  },
  changeSex: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  changeDate: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  changeGear: function (e) {
    this.setData({
      gear: e.detail.value
    })
  },
  changeModel: function (e) {
    this.setData({
      model: e.detail.value
    })
  },
  changeHave: function (e) {
    this.setData({
      have: e.detail.value
    })
  },
  changeTeacher(e) {
    this.setData({
      index: e.detail.value
    })
  },
  upload: function (e) {
    let that = this;
    let uid = this.uid
    let directory = 'jiazhao'

    // 选择图片
    wx.chooseImage({
      count: 4,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          that.setData({
            imgList: res.tempFilePaths
          })
        }

        wx.showLoading()
        //批量上传
        var promise = Promise.all(res.tempFilePaths.map((filePath, index) => {
          return new Promise(function (resolve, reject) {
            var cloudPath = directory + "/" + js_date_time(new Date()).substr(0, 10) + "/" + index + filePath.match(/\.[^.]+?$/)[0]
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log('[上传文件] 成功：', res)
                const db = wx.cloud.database();
                db.collection('jiazhao').add({
                  data: {
                    uid: uid,
                    fileID: res.fileID,
                    img: cloudPath
                  }
                })
                that.setData({
                  img: cloudPath
                })
              },
              fail: e => {
                console.error('[上传文件] 失败：', e)
                wx.showToast({
                  icon: 'none',
                  title: '上传失败',
                })
              },
              complete: () => {
                wx.hideLoading()
              }
            })
          })
        }))
        promise.then(function (results) {
          console.log(results); //返回上传成功的数据
        }).catch(function (err) {
          console.log(err);
        });
      },
      fail: e => {
        console.error(e)

      }
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  submit: function (e) {
    //上传表单信息
    let that = this;
    if (!that.data.name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
      })
      return
    } else if (!that.data.sex) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
      })
      return
    } else if (!that.data.phone) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
      })
      return
    } else if (!that.data.region) {
      wx.showToast({
        title: '请选择接送地址',
        icon: 'none',
      })
      return
    } else if (!that.data.sex) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
      })
      return
    } else if (!that.data.gear) {
      wx.showToast({
        title: '请选择练车档位',
        icon: 'none',
      })
      return
    } else if (that.data.have == undefined) {
      wx.showToast({
        title: '请选择是否有车',
        icon: 'none',
      })
      return
    }



    const db = wx.cloud.database();
    db.collection('yuyue').add({
      data: {
        userId: app.globalData.userId,
        name: that.data.name,
        sex: that.data.sex,
        phone: that.data.phone,
        region: that.data.region,
        street: that.data.street,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        date: that.data.date,
        fileID: that.data.fileID,
        img: that.data.img,
        gear: that.data.gear,
        model: that.data.model,
        have: that.data.have,
        teacherId: that.data.teachers[that.data.index]._id,
        startTime: '',
        endTime: '',
        payamount: ''
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        wx.showToast({
          title: '预约成功',
          duration: 2000,
          complete: wx.navigateBack({
            delta: 0,
          })

        })
      }
    })


  },
  reset: function (e) {
    this.setData({
      name: '',
      sex: '',
      phone: '',
      region: '',
      street: '',
      date: '',
      fileID: '',
      imgList: '',
      gear: '',
      model: '',
      have: ''
    })
  },
  map: function (e) {
    let that = this;
    wx.chooseLocation({
      success(res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          region: res.name,
          street: res.address
        })
      }
    })
  }
})