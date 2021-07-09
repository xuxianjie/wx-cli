const http = require('../../utils/http.js')
import Toast from '@vant/weapp/toast/toast';
Page({


  data: {
    
  },

  getSome:function(){
    http.get('/api/about-one', {
    }).then(res => {
      if (!res.errCode) {
        WxParse.wxParse('content', 'html', res.data[0].content, this, 0);

        this.setData({
          police: res.data
        })
      } else {
        Toast.fail({
          title: res.errMsg
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      userId:wx.getStorageSync('user').userId
    })
    this.getSome()
  },


  onShow: function () {

  },


  onPullDownRefresh: function () {

  },



  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  },
})
