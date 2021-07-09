const http = require('../../utils/http.js')
const poster = require('../../utils/poster.js')
const WxParse = require('../../utils/wxParse/wxParse.js')
import Toast from '@vant/weapp/toast/toast';


Page({
  data: {
    order: null,
  },
  payOrder: function (e) {
    wx.showModal({
      title: '发起支付',
      content: '确认支付该订单吗',
      success: res => {
        if (res.confirm) {
          var productArr = []
          // this.data.order.orderProductList.forEach(item => {
          //   productArr.push({
          //     goodsId: item.id,
          //     goodsName: item.productName,
          //     quantity: item.quantity,
          //     price: item.price
          //   })
          // })
          let user = wx.getStorageSync('user')
          http.post("/api/wx-pay-order", {
            deviceInfo: "WEB",
            body: `${this.data.order.name}`,
            outTradeNo: this.data.order.number,
            totalFee: this.data.order.totalPrice,
            tradeType: "JSAPI",
            openid: wx.getStorageSync("openId"),

          }).then(res => {
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.packageValue,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success: (res) => {
                this.getOrder(this.data.orderId)
                wx.showToast({
                  title: '支付成功',
                  duration: 2000,
                  icon: 'success'
                })
              },
              fail: (err) => {
                // if (err) {
                //   wx.redirectTo({
                //     url: '../myOrder/myOrder'
                //   })
                // }
              }
            })
          })
        }
      }
    })
  },
  checkIn(e){
    wx.showModal({
      content: '确认收货吗?',
      success:res=>{
        if(res.confirm){
          http.put('/api/orders-received/' + this.data.orderId).then(res=>{
            if(!res.errCode){
              Toast.success('已确认收货')
              wx.navigateBack({
                
              })
            }else{
              Toast.fail(res.errMsg)
            }
          })
        }
      }
    })
  },
  completeTime(order) {
    if (order.status == 'unpaid') {
      this.data.cutTime = order.createTime - new Date().getTime() + 25200000
      console.log(this.data.cutTime)

      this.setData({
        cutTime: this.data.cutTime > 0 ? this.data.cutTime : 0
      })

      setInterval(() => {
        this.setData({
          cutTime: this.data.cutTime - 1000 > 0 ? this.data.cutTime - 1000 : 0
        })
      }, 1000)
    } else if (order.status = 'received') {
      this.data.cutTime = order.updateTime - new Date().getTime() + 604800000
      console.log(this.data.cutTime)
      this.setData({
        cutTime: this.data.cutTime
      })


    }
  },

  comfirm() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      success(res) {
        if (res.confirm) {
          http.put('/api/orders', {
            status: 'received',
            id: that.data.order.id
          }).then(res => {
            if (!res.errCode) {
              wx.redirectTo({
                url: "../order/order?status=",
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },


  // 获取详情
  getOrder: function (orderId) {
    http.get('/api/orders/' + orderId).then(res => {
      if (!res.errCode) {
        res.data.totalProductPrice = 0
        console.log(res.data.totalProductPrice)
        res.data.orderProductList.forEach(item => {
          res.data.totalProductPrice += item.quantity * item.price
        })
        console.log(res.data.totalProductPrice)
        this.setData({
          order: res.data
        })


        this.completeTime(res.data)
      } else {
        Toast.fail(res.errMsg)
      }

    })
  },
  openPopup(e) {
    if (!this.data.express) {
      this.getExpress()
    }
    this.setData({
      popupBool: true
    })
  },
  getExpress(e) {
    http.get('/api/get-express-info/' + this.data.order.id).then(res => {
      if (!res.errCode) {
        var express = JSON.parse(res.data)
        express.Traces = express.Traces.reverse()
        this.setData({
          express
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      userId: wx.getStorageSync('user').userId,

    })

  },


  onShow: function () {
    this.getOrder(this.data.orderId)
  },





  // 备用方法
  toHome: function () {
    wx.switchTab({
      url: '../home/home',
    })
  },

  showPopup: function (e) {
    this.setData({
      popupBool: !this.data.popupBool
    })
  },
  // 返回数据数组转换
  reverseImageUrls: function (imageUrls) {
    if (images && typeof images == 'string' && images.length > 0) {
      try {

        return JSON.parse(images);
      } catch (e) {

        return images.split(',');
      }
    } else {
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
  previeworderImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data.order.imageUrls,
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