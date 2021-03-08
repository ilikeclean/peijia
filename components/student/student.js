// pages/student/student.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // addGlobalClass: true,
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0,
    navList: ["学习中", "已结课", "全部学员"],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    activeNav: function (e) {
      let that = this;
      console.log(e)
      that.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    },
  }
})