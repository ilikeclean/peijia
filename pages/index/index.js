Page({
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'cloud://dev-1g9sd93e704166e1.6465-dev-1g9sd93e704166e1-1304758957/index/1.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'cloud://dev-1g9sd93e704166e1.6465-dev-1g9sd93e704166e1-1304758957/index/2.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],

    iconList: [{
      icon: 'phone',
      color: 'orange',
      badge: 0,
      name: '电话'
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '预约'
    },{
      icon: 'scan',
      color: 'red',
      badge: 0,
      name: '签到'
    },{
      icon: 'share',
      color: 'green',
      badge: 0,
      name: '分享'
    }, ],
    gridCol:3,

    PageCur:'home',
    isBack: false
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },

  onLoad(options) {
    let that = this;
    this.setData({
      isBack: options.isBack
    })
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },

  go(e){
    if(e.currentTarget.dataset.name=='电话'){
      wx.makePhoneCall({
        phoneNumber: '1234',
      })
    }else if(e.currentTarget.dataset.name=='预约'){
      wx.navigateTo({
        url: '/pages/baoming/baoming',
      })
    }else if(e.currentTarget.dataset.name=='签到'){
      wx.navigateTo({
        url: '/pages/sign/sign',
      })
    }else if(e.currentTarget.dataset.name=='分享'){
      console.log("分享")
      wx.showShareMenu({
        withShareTicket: true,
      })
      wx.showToast({
        title: '点击右上角,将小程序发送给朋友',
        icon:'none'
      })
      
    }
  },
  onShareAppMessage() {
    return {
      title: 'xx陪驾',
      path: '/pages/weixin/weixin'
    }
  },
})