const http = require('../../utils/http.js')
const poster = require('../../utils/poster.js')
const WxParse = require('../../utils/wxParse/wxParse.js')
import Toast from '@vant/weapp/toast/toast';


Page({
  data: {
    
    refund:null,
  },

  // 获取详情
  getRefund:function(refundId){
    http.get('/api/refund/'+refundId).then(res=>{
      console.log('退款详情',res)
      if(!res.errCode){
        this.setData({
          refund: res.data
        })
      }else{
        Toast.fail(res.errMsg)
      }

    }).catch(err=>{
      Toast.fail('系统错误')
      console.log(err)
    })  
  },
  onLoad: function (options) {
    this.setData({
      refundId:options.refundId,
      userId: wx.getStorageSync('user').id
    })
    
  },


  onShow: function () {
    this.getRefund(this.data.refundId)
  },



  onShareAppMessage: function () {
    return {
      title :'',
      path: `../refundDetail/refundDetail?refundId=${this.data.refundId}`
    }
  },





  // 备用方法
  toHome:function(){
    wx.switchTab({
      url: '../home/home',
    })
  },
  // 弹出框开启关闭
  openPopup:function(e){
    this.setData({
      popupBool:true
    })
  },
  showPopup:function(e){
    this.setData({
      popupBool:!this.data.popupBool
    })
  },
  // 返回数据数组转换
  reverseImageUrls:function(imageUrls){
    if (images && typeof images == 'string' && images.length > 0) {
      try {
 
        return JSON.parse(images);
      } catch(e) {

        return images.split(',');
      }
    }else{
      return images
    }
  },
  // 预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [e.currentTarget.dataset.src],
    })
  },
  // 预览轮播图图片
  previewrefundImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data.refund.imageUrls,
    })
  },
  // 保存海报
  savePoster: function () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImage,
      complete: res => {
        console.log(res)
      },
      success: res => {
        Toast.success({
          title: '已保存到相册',
          duration: 1000
        })
      }
    })
  },
  // 绘制海报并展示
  openPoster: function () {
    poster.drawPoster('canvas1', 585, 900).then(url => {
      console.log(url)
      this.setData({
        posterImg: url,
        posterBool: true
      })
    })
  },
})
