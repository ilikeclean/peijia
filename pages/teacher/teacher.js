// pages/catering.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,


    open: true,
    tabs: [{
        title: '学员管理',
        anchor: 'a',
      },
      {
        title: '工作日志',
        anchor: 'b',
      },
      {
        title: '休息报备',
        anchor: 'c',
      },
      {
        title: '收款',
        anchor: 'd',
      },
      {
        title: '保险',
        anchor: 'e',
      },
      {
        title: '用户协议',
        anchor: 'f',
      },
    ],
    indexId: 0,
    
  },
  // 左侧点击事件
  jumpIndex(e) {
    let index = e.currentTarget.dataset.menuindex;
   
    let that = this
    that.setData({
      indexId: index
    });
    //可以设置定位事件

  },

  switch() {
    wx.navigateTo({
      url: '/pages/index/index?isBack=true',
    })
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
  },
  onShow: function(){
    wx.hideHomeButton({
      success: (res) => {},
    })
  },

   showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})