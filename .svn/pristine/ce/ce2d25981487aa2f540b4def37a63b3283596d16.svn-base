const http = require('../../utils/http.js')
const poster = require('../../utils/poster.js')

Page({

  data: {
    posterBool: true,
    posterImg:null
  },
  // 保存海报到相册
  savePoster: function () {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImg,
      complete: res => {
        console.log(res)
      },
      success: res => {
        wx.showToast({
          title: '已保存到相册',
          duration: 1000
        })
      }
    })
  },
  // 绘制海报，显示，并隐藏选择
  showPoster: function () {
    // this.drawPoster()
    this.setData({
      posterBool: !this.data.posterBool,
      shareShow: false
    })
  },
  openPoster: function () {
    poster.drawPoster('canvas1', 585, 900).then(url => {
      console.log(url)
      this.setData({
        posterImg: url,
        posterBool: true
      })
    })
  },
  getAAA :function(...poster){
    let [a,m,b] = poster
    console.log(a,b,m)
    console.log(poster)
  },
  onLoad: function (options) {
    this.openPoster()

  },

})