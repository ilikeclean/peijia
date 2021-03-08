// pages/order/orderInfo/orderInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    qrcode: ''
  },
  pay: function () {
    let that = this
    wx.request({
      url: 'https://pay.muitc.com/api.php?act=order&pid=18533&key=tAhFRq2Dek96dcflm69JaTjF9cTFfcm0&out_trade_no=20210124134756333',
    })
    wx.request({
      url: 'https://pay.muitc.com/submit_qr.php?money=1.00&name=123&notify_url=http&out_trade_no=202086029590&pid=18533&return_url=http&sign_type=MD5&type=alipay&sign=5F6A9291A3C5DA12A4A5216E1D7B19D8',
      header: {
        // "Accept-Language": "zh-CN,zh;q=0.9"
      },
      // method: "POST",
      data: {
        money: "1.00",
        name: "木皆聚合支付平台余额充值",
        notify_url: "http:",
        return_url: "http:",
        out_trade_no: "202086029599",
        pid: 18533,
        sitename: "木皆聚合支付平台",
        type: "alipay",
        sign: "202cb962ac59075b964b07152d234b70",
        sign_type: "MD5"
      },
      success(res) {
        console.log(res)
        that.setData({
          qrcode: res.qrcode
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = decodeURIComponent(options)
    this.setData({
      info: obj
    })
    this.pay()
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