const http = require('../../utils/http.js')
const poster = require('../../utils/poster.js')
const WxParse = require('../../utils/wxParse/wxParse.js')
import Toast from '@vant/weapp/toast/toast';
const app = getApp()

Page({
  data: {
    product: null,
    quantity: 1,
    choiceIdx: null,
    time: 30 * 60 * 60 * 1000,
    choiceIdx: 0
  },
  savePoster: function () {
    console.log(this.data.posterImg)
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
  getCarNum(e){
    http.get('/api/cart-count').then(res=>{
      if(!res.errCode){
        this.setData({
          carNum:res.data
        })
      }
    })
  },
  getTime(time) {
    var time = new Date(time)
    var Y = time.getFullYear() + '-';
    var M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-';
    var D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    D = D + " ";
    var h = time.getHours() < 10 ? '0' + time.getHours() + ":" : time.getHours() + ":";
    var m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    return Y + M + D + h + m
  },
  showTips(e) {
    if (this.data.appointStatus == 'unRush' || (this.data.appointStatus == 'open' && this.data.product.isAppointment)) {
      wx.showModal({
        content: '开始抢购时间----' + this.getTime(this.data.product.appointmentProduct.rushTime),
        showCancel: false,
      })
    }

  },
  appoint() {
    if (!wx.getStorageSync('user')) {
      setTimeout(() => {
        Toast.fail('您还未登录，请登录后购买')
      }, 200)
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    http.post('/api/appointment-product-record', {
      userId: this.data.userId,
      appointmentProductId: this.data.product.appointmentProduct.id
    }).then(res => {
      if (!res.errCode) {
        // Toast.success('预约成功')
        wx.showModal({
          content: '开始抢购时间----' + this.getTime(this.data.product.appointmentProduct.rushTime),
          showCancel: false,
        })
        this.getProduct(this.data.product.id)
      } else {
        Toast.fail(res.errMsg)
      }
    })
  },
  inputNum(e) {
    this.setData({
      quantity: e.detail.value
    })
  },
  onChange(e) {
    console.log(e)
    let time= e.detail
    if (time.days == 0 && time.hours == 0 && time.milliseconds == 0 && time.minutes == 0 && time.seconds == 0 ){
      this.getProduct(this.data.product.id)
    }
    this.setData({
      timeData: e.detail
    });
    // console.log(e)
  },
  // check确认
  check(e) {
    if (this.data.type) {
      if (!wx.getStorageSync('user')) {
        setTimeout(() => {
          Toast.fail('您还未登录，请登录后购买')
        }, 200)
        wx.navigateTo({
          url: '../login/login',
        })
        return
      }
      if (this.data.product.stock <= 0) {
        Toast.fail('商品已售罄')
        return
      }
      if (this.data.product.productAttrList && this.data.product.productAttrList.length && !this.data.choiceIdx && !(this.data.choiceIdx === 0)) {
        wx.showToast({
          title: '请选择规格',
          duration: 1500,
          icon: "none"
        })
        return
      }
      if (this.data.product.isLimit && this.data.product.limitCount < this.data.quantity){
        Toast.fail('超出商品限购数量')
        return
      }
      if (this.data.type == 'cart') {
        // 加入购物车
        this.addCart()
      } else {
        let product = this.data.product;
        let userId = wx.getStorageSync("user").userId;
        product.userId = userId;
        product.productId = product.id
        product.discountPrice = product.discountPrice || product.price

        if (this.data.product.productAttrList && this.data.product.productAttrList.length) {
          product.color = product.productAttrList[this.data.choiceIdx].color;
          product.discountPrice = product.productAttrList[this.data.choiceIdx].discountPrice || product.productAttrList[this.data.choiceIdx].price;
          product.coinPrice = product.productAttrList[this.data.choiceIdx].coinPrice
          product.size = product.productAttrList[this.data.choiceIdx].size;
          product.spec = product.productAttrList[this.data.choiceIdx].spec;
          product.taste = product.productAttrList[this.data.choiceIdx].taste;
          product.productAttrId = product.productAttrList[this.data.choiceIdx].id;
        } else {
          product.productAttrId = 0
        }

        product.quantity = this.data.quantity
        product.shopCheck = true
        wx.setStorageSync('productList', [product])
        wx.navigateTo({
          url: '../checkProduct/checkProduct?type=shop',
        })
      }
    }

    this.showPopup()
  },
  changeFavorite() {
    if (!wx.getStorageSync('user')) {
      wx.showModal({

        content: '您还未登录,是否前往登录',
        success: res => {
          if (res.confirm) {
            wx.redirectTo({
              url: '../login/login',
            })
          }
        }
      })
      return
    }
    http.post('/api/user-favorite', {
      type: 'product',
      productId: this.data.productId
    }).then(res => {
      if (!res.errCode) {
        this.data.product.isFavorite = !this.data.product.isFavorite
        this.setData({
          product: this.data.product
        })
        let str = this.data.product.isFavorite ? '成功收藏' : '已取消'
        Toast.success(str)
      } else {
        Toast.fail(res.errMsg)
      }
    })

  },
  goCart(e) {
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  // 选择规格
  traggleChoice: function(e) {
    this.setData({
      choiceIdx: e.currentTarget.dataset.index
    })
  },
  sliceNum(e) {
    if (this.data.quantity == 1) {
      Toast.fail('数量不能再减少了哦')
      return
    }
    this.setData({
      quantity: --this.data.quantity
    })
  },
  addNum(e) {
    if (this.data.product.appointmentProduct) {
      Toast.fail('限购一件')
      return
    }
    if (this.data.product.isLimit && this.data.quantity >= this.data.product.limitCount) {
      Toast('该商品限购' + this.data.product.limitCount + '件哦')
    } else {
      this.setData({
        quantity: ++this.data.quantity
      })
    }
  },
  addCart: function() {

    // 未登录提示

    this.setData({
      specBool: false
    })
    let product = {};
    let userId = wx.getStorageSync("user").userId;
    product.userId = userId;
    product.productId = this.data.product.id

    product.organizatinId = wx.getStorageSync("user").data.organizatinId || ''
    if (this.data.product.productAttrList && this.data.product.productAttrList.length) {

      product.productAttrId = this.data.product.productAttrList[this.data.choiceIdx].id;
    }


    product.quantity = this.data.quantity

    http.post("/api/cart", product).then(res => {
      if (!res.errCode) {

        // this.getCartList();
        Toast.success('加入成功')
        this.getCarNum()
      } else {
        // Toast.fail(res.errMsg)
      }
    })
  },
  // 弹出框开启关闭
  openPopup: function(e) {
    this.setData({
      popupBool: true,
      type: e.currentTarget.dataset.type
    })
  },

  // 获取详情
  getProduct: function(productId) {
    wx.$http.get('/api/product-mini/' + productId).then(res => {
      if (!res.errCode) {
        // 富文本
        if (res.data.detail) {
          WxParse.wxParse('content', 'html', res.data.detail, this, 0);
        }
        // 轮播图数组转换
        res.data.imageUrls = this.reverseImageUrls(res.data.imageUrls)
        if (res.data.appointmentProduct) {
          let now = new Date().getTime()
          var appointStatus

          if (now < res.data.appointmentProduct.startTime) {
            appointStatus = 'unOpen'
            this.setData({
              time: res.data.appointmentProduct.startTime - now
            })
          } else if (now >= res.data.appointmentProduct.startTime && now < res.data.appointmentProduct.endTime) {
            appointStatus = 'open'
            this.setData({
              time: res.data.appointmentProduct.endTime - now
            })
          } else if (now >= res.data.appointmentProduct.endTime && now < res.data.appointmentProduct.rushTime) {
            appointStatus = 'unRush'
            this.setData({
              time: res.data.appointmentProduct.rushTime - now
            })
          } else {
            appointStatus = 'rush'
            // this.setData({
            //   time: now - res.data.appointmentProduct.rushTime
            // })
          }
          this.setData({
            appointStatus
          })
        }

        this.setData({
          product: res.data
        })
      } else {
        Toast.fail(res.errMsg)
      }

    })
  },
  onLoad: function(options) {

    this.setData({
      productId: options.productId || options.scene,
      userId: wx.getStorageSync('user').userId,
      freeExpressFee: app.globalData.freeExpressFee,
      expressFee: app.globalData.expressFee
    })
    this.getCarNum()
  },


  onShow: function() {
    this.getProduct(this.data.productId)
  },






  // 备用方法
  toHome: function() {
    wx.switchTab({
      url: '../home/home',
    })
  },

  showPopup: function(e) {
    this.setData({
      popupBool: !this.data.popupBool
    })
  },
  // 返回数据数组转换
  reverseImageUrls: function(imageUrls) {
    if (imageUrls && typeof imageUrls == 'string' && imageUrls.length > 0) {
      try {

        return JSON.parse(imageUrls);
      } catch (e) {

        return imageUrls.split(',');
      }
    } else {
      return imageUrls
    }
  },
  // 预览图片
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [e.currentTarget.dataset.src],
    })
  },
  // 预览轮播图图片
  previewproductImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data.product.imageUrls,
    })
  },
  // 保存海报


  onShareAppMessage: function () {

  }
})