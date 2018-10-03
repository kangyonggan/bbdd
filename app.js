//app.js
App({
  // apiUrl: 'http://localhost:7777',
  apiUrl: 'https://kangyonggan.com',
  onLaunch: function () {
    this.login();
  },
  message: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1500
    });
  },
  openId: '',
  login: function (success, fail) {
    let that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.apiUrl + "/wx/getOpenId?jsCode=" + res.code,
          method: 'GET',
          success: function (res) {
            if (res.data.respCo == '0000') {
              that.openId = res.data.openid;
              if (success) {
                success();
              }
            } else {
              if (fail) {
                fail();
              }
            }
          },
          fail: function () {
            if (fail) {
              fail();
            }
          }
        })
      },
      fail: function () {
        if (fail) {
          fail();
        }
      }
    })
  }
})