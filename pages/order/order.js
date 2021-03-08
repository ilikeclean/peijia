const app = getApp()

Page({
  data: {
    nodataType: 7,
    orderList: [], //订单列表数据，接口获取
    currentPage: 1,
    isNoMoreData: false,
    orderState: null,
    winHeight: 900,
    currentTab: 0, //当前显示tab的下标
    navTab: ['全部', '待付款', '已付款'],
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(0); //获取数据的方法
  },
  initData(currentPage) {
    const db = wx.cloud.database()
    const _ = db.command

    let data = {
      endTime: _.neq(''),
      _openid: app.globalData.openid
    }
    if (currentPage == 1) {
      data.payamount = _.eq('')
    } else if (currentPage == 2) {
      data.payamount = _.neq('')
    }

    db.collection('yuyue').where(data)
      .orderBy('startTime', 'desc')
      .get({
        success: res => {
          this.setData({
            orderList: res.data
          })
        }
      })

  },
  switchNav(e) { //点击 这个方法会触发bindChange()方法
    let isSelect = e.target.dataset.current;
    this.setData({
      currentTab: isSelect,

    })
  },

  bindChange(e) { //切换swiper
    let isSelect = e.detail.current;

    if (isSelect != 0) {
      this.setData({
        orderState: isSelect
      })
    } else {
      this.setData({
        orderState: null
      })
    }
    this.setData({
      isNoMoreData: false,
      loading: true,
      currentTab: isSelect,
      orderList: []
    })
    this.initData(isSelect)
  },
  toDetail(val) {
    console.log(val)
    let obj = JSON.stringify(val.currentTarget.dataset.item);
    wx.navigateTo({
      url: './orderInfo/orderInfo?item=' + encodeURIComponent(obj)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { //获取设备高度
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.windowWidth);
        // console.log(res.windowHeight);
        _this.setData({
          winHeight: res.windowHeight
        })
      },
    })

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { //上拉加载分页
    this.setData({
      loading: true
    })
    if (!this.data.isNoMoreData && this.data.orderList.length > 0) {
      this.initData(++this.data.currentPage);
    }
  },
})