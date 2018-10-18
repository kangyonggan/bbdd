// pages/detail/index.js
const app = getApp()
const util = require("../../utils/util.js")
Page({

  /**
   * Page initial data
   */
  data: {
    apiUrl: app.apiUrl,
    id: '',
    record: {},
    isLoading: false,
    emptyText: '加载中...'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (this.data.isLoading) {
      return;
    }
    this.setData({
      id: options.id,
      emptyText: '加载中...'
    });
    this.loadData();
  },

  preview: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: this.data.record.urls 
    })
  },

  /**
   * 加载数据
   */
  loadData: function (id) {
    let that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    wx.request({
      method: "GET",
      url: app.apiUrl + "/wx/record/" + that.data.id,
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();

        if (res.data.respCo == '0000') {
          res.data.record.createdTime = util.formatTime(res.data.record.createdTime);
          if (res.data.record.fileNames) {
            res.data.record.urls = res.data.record.fileNames.split(',');
            for (var i = 0; i < res.data.record.urls.length; i++) {
              res.data.record.urls[i] = that.data.apiUrl + res.data.record.urls[i];
            }
          }
          if (res.data.record.videoNames) {
            res.data.record.videos = res.data.record.videoNames.split(',');
            for (var i = 0; i < res.data.record.videos.length; i++) {
              res.data.record.videos[i] = that.data.apiUrl + res.data.record.videos[i];
            }
          }

          that.setData({
            isLoading: false,
            emptyText: '加载成功',
            record: res.data.record
          });
        } else {
          that.setData({
            isLoading: false,
            emptyText: res.data.respMsg
          });
        }
      },
      fail: function (err) {
        that.setData({
          isLoading: false,
          emptyText: '网络错误，请下拉重试！'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
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
    if (this.data.isLoading) {
      return;
    }
    this.setData({
      emptyText: '加载中...'
    });
    this.loadData();
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