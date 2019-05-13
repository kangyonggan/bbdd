// pages/form/index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    apiUrl: app.apiUrl,
    isLogin: false,
    loading: false,
    emptyText: '登录中...',
    content: '',
    filePaths: [],
    videoPaths: []
  },

  inputContent: function (e) {
    this.setData({
      content: e.detail.value
    }) 
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
   * 表单提交
   */
  formSubmit: function () {
    if (this.data.content == '') {
      app.message('内容不能为空');
      return;
    }

    let that = this;
    this.setData({
      loading: true
    })
    wx.request({
      url: app.apiUrl + "/api/record",
      method: 'POST',
      data: {
        content: that.data.content,
        fileNames: that.data.filePaths.join(','),
        videoNames: that.data.videoPaths.join(','),
        openid: app.openId
      },
      success: function (res) {
        that.setData({
          loading: false
        })
        if (res.data.respCo == '0000') {
          that.setData({
            content: '',
            filePaths: []
          });
          wx.switchTab({
            url: '../home/index'
          })
        } else {
          app.message(res.data.respMsg);
        }
      },
      fail: function () {
        app.message('网络异常, 请稍后再试');

        that.setData({
          loading: false
        })
      }
    })
  },

  /**
   * 删除
   */
  delImage: function(e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: "#f60",
      success: function (res) {
        if (!res.cancel) {
          let arr = that.data.filePaths;
          let newArr = [];
          let index = e.target.dataset.index;
          for (var i = 0; i < arr.length; i++) {
            if (i != index) {
              newArr.push(arr[i]);
            }
          }
          that.setData({
            filePaths: newArr
          });
        }
      }
    });
  },

/**
 * 选择相册
 */
  chooseImageTap: function () {
    let _this = this;

    wx.showActionSheet({
      itemList: ['选择图片', '选择视频'],
      success(e) {
        if (e.tapIndex == 0) {
          _this.chooseImages();
        } else if (e.tapIndex == 1) {
          _this.chooseVideos();
        }
      }
    })
  },

  chooseVideos: function () {
    let _this = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      success(res) {
        _this.upload(res.tempFilePath, function (url) {
          console.log(url);
          let arr = _this.data.videoPaths;
          arr[arr.length] = url;
          _this.setData({
            videoPaths: arr
          });
        });
      }
    })
  },

  chooseImages: function () {
    let _this = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          _this.upload(res.tempFilePaths[i], function(url) {
            let arr = _this.data.filePaths;
            arr[arr.length] = url;
            _this.setData({
              filePaths: arr
            });
          });
        }
      }
    })
  },

  /**
   * 文件上传
   */
  upload: function (filePath, success) {
    wx.uploadFile({
      url: app.apiUrl + "/file/upload",
      filePath: filePath,
      name: 'file',
      success: function (res) {
        if (success) {
          success(res.data)
        }
      },
      fail: function () {
        app.message('上传失败, 请稍后再试');
      }
    })
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