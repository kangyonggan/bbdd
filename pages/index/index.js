// pages/home/index.js
//获取应用实例
const app = getApp()
const util = require("../../utils/util.js")

Page({

  /**
   * Page initial data
   */
  data: {
    apiUrl: app.apiUrl,
    pageNum: 1,
    list: [],
    emptyText: '加载中...',
    isLoading: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.loadData(true);
  },

  /**
   * 加载数据
   */
  loadData: function (isInit) {
    let that = this;
    if (this.data.isLoading) {
      return;
    }
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.setData({
      isLoading: true,
      emptyText: '加载中...'
    });
    if (isInit) {
      that.setData({
        pageNum: 1,
      });
    } else {
      that.setData({
        pageNum: that.data.pageNum + 1,
      });
    }
    wx.request({
      method: "GET",
      url: app.apiUrl + "/wx/records?pageNum=" + that.data.pageNum,
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        if (res.data.respCo == '0000') {
          if (res.data.pageInfo.list.length == 0) {
            that.setData({
              isLoading: false
            });
            if (isInit) {
              that.setData({
                emptyText: '暂时没有宝宝点滴'
              });
            } else {
              app.message("没有更加记录了");
            }
            return;
          }

          if (isInit) {
            that.setData({
              list: []
            });
          }

          let dataList = res.data.pageInfo.list;
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].createdTime = util.formatTime(dataList[i].createdTime);
            if (dataList[i].fileNames) {
              dataList[i].urls = dataList[i].fileNames.split(',');
            }
          }

          that.setData({
            isLoading: false,
            list: that.data.list.concat(dataList)
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
    this.onLoad();
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    this.loadData(false);
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})