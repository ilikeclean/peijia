const app = getApp()

function loginCheck(e) {

  if (!app.globalData.openid) {
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        app.globalData.openid = res.result.openid;
      }
    })
  }

  const db = wx.cloud.database()
  db.collection('user').where({
    _openid: app.globalData.openid
  }).get({
    success: res => {

      if (res.data.length == 0) {
        let url = '/pages/signUp/signUp'
        if(e.code)
          url += '?code=' + e.code + '&id=' + e.id
        wx.navigateTo({
          url: url
        })
      } else if (e) {

      } else {
        let userInfo = res.data[0]
        app.globalData.userId=res.data[0]._id;
        if (userInfo.shenfen == 1) {
          //教练
          wx.redirectTo({
            url: '/pages/teacher/teacher',
          })
        } else {
          //学员
          wx.redirectTo({
            url: '/pages/index/index',
          })

        }
      }
    },
    fail: err => {

    }
  })
}

module.exports = {
  loginCheck
}