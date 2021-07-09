const http = require('../../utils/http.js')
import Toast from '@vant/weapp/toast/toast';
Page({


  data: {
    
  },

  getSome:function(){
    http.get('/api/').then(res=>{
      if(!res.errCode){
        this.setData({

        })
      }else{
        Toast.fail({
          title:res.errMsg
        })
      }
    }).catch(err=>{
      console.log(err)
      Toast.fail('系统繁忙')
    })
  },
  onLoad: function (options) {
    this.setData({
      userId:wx.getStorageSync('user').userId
    })
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
