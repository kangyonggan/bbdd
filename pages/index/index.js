//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasLogin: false,
    userInfo: {},
  },
  onLoad: function () {
    let that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res && res.data) {
          that.setData({
            hasLogin: true,
            userInfo: res.data
          })
          wx.setNavigationBarTitle({
            title: res.data.nickName
          })
        }
      }
    });
  },
  getUserInfo: function(e) {
    this.setData({
      hasLogin: true,
      userInfo: e.detail.userInfo
    })

    wx.setNavigationBarTitle({
      title: e.detail.userInfo.nickName
    })

    wx.setStorage({
      key: 'userInfo',
      data: e.detail.userInfo
    });
  }
})
