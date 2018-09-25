// pages/form/index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    isLogin: false,
    emptyText: '登录中...'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.onPullDownRefresh();
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    if (app.openId == '') {
      // 显示顶部刷新图标
      wx.showNavigationBarLoading();
      let that = this;
      that.setData({
        isLogin: false,
        emptyText: '登录中...'
      });
      app.login(function () {
        that.setData({
          isLogin: true,
          emptyText: '登录成功'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }, function () {
        that.setData({
          isLogin: false,
          emptyText: '网络错误，请下拉重试！'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      });
    } else {
      this.setData({
        isLogin: true,
        emptyText: '已登录'
      });
      // 停止下拉动作
      wx.stopPullDownRefresh();
    }
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})