const http = require('../../utils/http.js')
import Toast from '@vant/weapp/toast/toast';
const app = getApp()
Page({


  data: {

    couponList: [],
    canCoin:false,
    payType:'weixin'
  },


  traggleCheck(e) {
    var index = e.currentTarget.dataset.index
    this.data.productList[index].shopCheck = !this.data.productList[index].shopCheck
    this.setData({
      productList: this.data.productList
    })
    this.computePrice()
  },
  // 计算
  computePrice() {
    console.log(1)
    var totalPrice = 0
    var discountPrice = 0
    var totalCount = 0
    var totalCoin = 0
    this.data.productList.forEach(item => {
      if (item.shopCheck) {
        totalPrice += item.discountPrice * item.quantity
        totalCount += Number(item.quantity)
        totalCoin += item.coinPrice*item.quantity
      }
      
    })

    // totalPrice = totalPrice.toFixed(2)
    discountPrice = totalPrice
    // 计算邮费 拼团不需要油费和优惠
    if (totalPrice < this.data.freeExpressFee && this.data.shoptype != 'group') {
      discountPrice += Number(this.data.expressFee)
    }
    if (this.data.coupon && this.data.shoptype != 'group') {
      discountPrice = discountPrice - Number(this.data.coupon.coupon.reduceValue)
    }
    
    this.setData({
      totalPrice: totalPrice.toFixed(2),
      discountPrice,
      totalCount,
      totalCoin
    })
  },
  // 获取免邮价格及邮费
  getSetting(e) {
    return http.get('/api/settings-one').then(res => {
      this.setData({
        freeExpressFee: res.data.freeExpressFee,
        expressFee: res.data.distributionFee,
        shareDiscount: res.data.shareDiscount,
        memberDay: res.data.memberDay || 1000000000, //没有会员日
        memberDiscount: {
          stairDiscount: res.data.stairDiscount,
          secondDiscount: res.data.secondDiscount,
          thirdDiscount: res.data.thirdDiscount,
        }
      })
    })
  },
  getLocation(e) {
    var location = wx.getStorageSync('location') || null
    if (location) {
      this.setData({
        location
      })
    } else {
      var pageParams = {
        userId: wx.getStorageSync('user').userId
      }
      wx.$http.get('/api/user-address', pageParams).then(res => {
        location = res.data.find(item => {
          return item.isDefault
        })
        if (!location) {
          // 没有默认则默认首个
          location = res.data[0] || null
        }
        this.setData({
          location: location || null
        })
      })
    }
  },
  payOrder(number, groupId) {

    return http.post("/api/wx-pay-order", {
      deviceInfo: "WEB",
      body: "星空之境",
      outTradeNo: number,
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
          wx.redirectTo({
            url: '../myOrder/myOrder?status='
          })
        },
        fail: (err) => {
          console.log('取消', err)
          // http.delete(`/api/orders/${this.data.orderId}`, {
          //   status: 'cancel'
          // }).then(res => {
          //   if (this.data.type == 'cart') {
          //     wx.switchTab({
          //       url: '../cart/cart',
          //     })
          //   }

          // })
          wx.redirectTo({
            url: '../myOrder/myOrder?status='
          })
        }
      })
    })

  },
  payByCoin(id){
    http.post('/api/pay-coin/'+id).then(res=>{
      if(!res.errCode){
        Toast.success('积分支付成功')
      }else{
        // Toast.fail(res.errMsg)
      }
    })
  },

  catchType(e) {
    // if(this.data.user.organizationBalance < this.data.product.price)
    this.setData({
      payType: e.detail
    })
  },
  showPopup(){
    this.setData({
      popupBool:true
    })
  },
  closePopup(){
    this.setData({
      popupBool:false
    })
  },
  // 付款下单
  checkOrder(e) {
    if(!this.data.type){
      Toast.fail('请选择支付方式')
      return
    }
    if (!this.data.location) {
      Toast.fail('请添加地址')
      return
    }
    var cartIdList = []
    this.data.productList.forEach(item => {
      if (item.shopCheck) {
        cartIdList.push(item.id)
      }
    })
    if (this.data.type == 'cart') {
      var params = {
        userId: this.data.userId,
        cartIdList,
        addressId: this.data.location.id,
        userCouponId: this.data.coupon ? this.data.coupon.id : null,

        organizationId: wx.getStorageSync('user').data.organizationId || ''
      }
    } else if (this.data.type == 'shop') {
      var params = {
        userId: this.data.userId,
        productId: this.data.productList[0].id,
        addressId: this.data.location.id,
        quantity: this.data.productList[0].quantity,
        productAttrId: this.data.productList[0].productAttrId,
        userCouponId: this.data.coupon ? this.data.coupon.id : null,
        type: 'product',
        organizationId: wx.getStorageSync('user').data.organizationId || ''

      }
    }
    if (this.data.productList[0].appointmentProduct){
      params.appointmentProductId = this.data.productList[0].appointmentProduct.id
    }
    var _interface = this.data.type == 'cart' ? 'orders-cart' : 'orders'
    http.post('/api/' + _interface, params).then(res => {
      if (!res.errCode) {
        this.setData({
          orderId: res.data.id
        })
        if (this.data.payType == 'coin'){
          this.payByCoin(res.data)
        }else{
          this.payOrder(res.data).then(res => {

          })
        }
 
      } else {
        // Toast.fail(res.errMsg)
      }

    })
  },

  onLoad: function(options) {
    this.setData({
      shoptype: options.shoptype,
      productList: wx.getStorageSync('productList'),
      type: options.type,
      userId: wx.getStorageSync('user').userId,
      user: wx.getStorageSync('user'),
      
      canCoin: !wx.getStorageSync('productList').find(item => { return !item.isExchange })

    })
    this.getSetting().then(res => {

      // 会员日

      this.computePrice()
      http.get('/api/user-coupon-page', {
        userId: wx.getStorageSync('user').userId,

        productCoupon: true
      }).then(res => {
        var coupon = null
        this.data.productList.forEach(pItem => {
          res.data.forEach(item => {
            if (item.coupon.productId) {
              if (item.coupon.productId != pItem.productId) {

              } else {
                if (coupon) {
                  if (item.coupon.fullValue <= this.data.totalPrice && coupon.coupon.reduceValue < item.reduceValue) {
                    coupon = item
                  }
                } else {
                  if (item.coupon.fullValue <= this.data.totalPrice) {
                    coupon = item
                  }
                }
              }
            } else {
              if (coupon) {
                if (item.coupon.fullValue <= this.data.totalPrice && coupon.coupon.reduceValue < item.reduceValue) {
                  coupon = item
                }
              } else {
                if (item.coupon.fullValue <= this.data.totalPrice) {
                  coupon = item
                }
              }
            }

          })
        })

        this.setData({
          coupon
        })
        this.computePrice()
      })


    })


  },


  onShow: function() {
    this.getLocation()
    var coupon = wx.getStorageSync('coupon')
    wx.removeStorageSync('coupon')
    if (coupon) {

      this.data.productList.forEach(pItem => {
        if (coupon.coupon.productId) {
          if (coupon.coupon.productId != pItem.productId) {
            Toast.fail('该优惠券不可使用')

          } else {
            if (this.data.totalPrice < coupon.coupon.fullValue) {
              Toast.fail('商品金额不满足要求哦')
            } else {
              this.setData({
                coupon
              })
              this.computePrice()
            }
          }
        } else {
          if (this.data.totalPrice < coupon.coupon.fullValue) {
            Toast.fail('商品金额不满足要求哦')
          } else {
            this.setData({
              coupon
            })
            this.computePrice()
          }
        }
      })



    }
  },

  onHide: function() {

  },
  onPullDownRefresh: function() {

  },



  onReachBottom: function() {

  },


  onShareAppMessage: function() {

  },
})