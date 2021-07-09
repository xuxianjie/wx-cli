const http = require('../../utils/http.js')
const poster = require('../../utils/poster.js')
const WxParse = require('../../utils/wxParse/wxParse.js')
import Toast from '@vant/weapp/toast/toast';


Page({
  data: {
    _detail:null,
  },

  // 获取详情
  _getDetail:function(_detailId){
    wx.$http.res['_interface'].getById(_detailId).then(res=>{
      if(!res.errCode){
        // 富文本
        if (res.data.content) {
          WxParse.wxParse('content', 'html', res.data.content, this, 0);
        }
        // 轮播图数组转换
        res.data.imageUrls = this.reverseImageUrls(res.data.imageUrls)

        this.setData({
          _detail: res.data
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
      _detailId:options._detailId,
    userId:wx.getStorageSync('user').id,

    })
    
  },


  onShow: function () {
    this._getDetail(this.data._detailId)
  },



  onShareAppMessage: function () {
    return {
      title :'',
      path: `../_detailDetail/_detailDetail?_detailId=${this.data._detailId}`
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
    if (imageUrls && typeof imageUrls == 'string' && imageUrls.length > 0) {
      try {
 
        return JSON.parse(imageUrls);
      } catch(e) {

        return imageUrls.split(',');
      }
    }else{
      return imageUrls
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
  preview_detailImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data._detail.imageUrls,
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
          message: '已保存到相册',
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
