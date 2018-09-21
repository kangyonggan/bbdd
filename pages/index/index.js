//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasLogin: false,
    openId: '',
    errMsg: '登录中...'
  },
  onLoad: function () {
    this.login();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.setData({
      errMsg: '登录中...'
    });
    this.login();
  },
  login: function() {
    let that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: 'wx94338920deda7272',
            secret: '15e3441a7b41d18d344edbb4df2822fa',
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method: 'GET',
          success: function (res) {
            app.openId = res.data.openid;
            that.setData({
              hasLogin: true,
              openid: res.data.openid,
              errMsg: '登录成功'
            })

            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
          },
          fail: function () {
            that.setData({
              hasLogin: false,
              errMsg: '登录失败，下拉重试！'
            })

            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
          }
        })
      },
      fail: function () {
        that.setData({
          hasLogin: false,
          errMsg: '登录失败，下拉重试！'
        })

        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  }
})
