const http = require('../../utils/http.js')
import Toast from '@vant/weapp/toast/toast';
const check = require('../../utils/check.js')
const dateTimePicker = require('../../utils/dateTimePicker.js')

Page({


  data: {
    show:false,
    radioList: ['少件/漏发', '卖家发错货', '质量问题', '包装/商品破损/污渍','不想要了'],
    radio:'',
    type: 'choice',
    productList: [],
    shopCheck:true,
    imageList: [],
    imageUrls: []
  },
  onChange(e) {
    console.log('9999',e)
    this.setData({
      radio: e.detail,
      show:false
    });
  },

//弹出底部
  selectReason(){
    this.setData({
      show:!this.data.show
    })
  },
  showPopup(){
    this.setData({
      show:!this.data.show
    })
  },


  // 计算选中个数
  computeTotal(e) {

    var totalCount = 0
    var totalPrice = 0
    this.data.order.orderProductList.forEach(item => {
      if (item.shopCheck) {
        totalCount += item.quantity
        totalPrice += item.quantity * item.price
      }
    })
    this.setData({
      totalCount: totalCount,
      totalPrice
    })
  },
  traggleType(e) {
    this.data.order.orderProductList.forEach(item => {
      if (item.shopCheck) {
        this.data.productList.push(item)
      }
    })
    this.setData({
      type: 'check',
      productList: this.data.productList
    })
  },
  traggleCheck(e) {
    this.data.order.orderProductList[e.currentTarget.dataset.index].shopCheck = !this.data.order.orderProductList[e.currentTarget.dataset.index].shopCheck
    this.setData({
      order: this.data.order
    })
    this.computeTotal()
  },
  traggleAll: function() {
      this.data.shopCheck = !this.data.shopCheck
      this.data.order.orderProductList.forEach(item => {
        item.shopCheck = this.data.shopCheck
      })
      this.setData({
        shopCheck: this.data.shopCheck,
        order: this.data.order
      })
      this.computeTotal()
  },
  sliceNum(e) {
    var index = e.currentTarget.dataset.index
    if (this.data.order.orderProductList[index].quantity == 1) {
      return
    }

    this.data.order.orderProductList[index].quantity--
      this.setData({
        order: this.data.order
      })
    this.computeTotal()

  },
  // 增加数量
  addNum(e) {
    var index = e.currentTarget.dataset.index
    if (this.data.order.orderProductList[index].quantity == this.data.order.orderProductList[index].maxQuantity) {
      return
    }
    this.data.order.orderProductList[index].quantity++

      this.setData({
        order: this.data.order
      })
    this.computeTotal()
  },
  inputReason(e) {
    this.setData({
      reason: e.detail.value
    })
  },
  getOrder: function(orderId) {
    http.get('/api/orders/' + orderId).then(res => {
      if (!res.errCode) {
        res.data.orderProductList.forEach(item => {
          item.shopCheck = true
          // 设置最大可退款数量
          item.maxQuantity = item.quantity
          if(item.quantity>1){
            item.quantityType = true
          }else{
            item.quantityType = false
          }
        })
        console.log(res.data.orderProductList)
        this.setData({
          order: res.data
        })
        this.computeTotal()
      } else {
        Toast.fail(res.errMsg)
      }

    }).catch(err => {
      Toast.fail('系统错误')
      console.log(err)
    })
  },
  postInfo: function(e) {
    if(!this.data.radio){
      wx.showToast({
        title: '请选择退款原因',
        duration:2000,
        icon:'none'
      })
      return
    }
    // 加载提示
    Toast.loading({
      message: '加载中',
      loadingType: 'spinner',
      duration: 0,
      forbidClick: true
      // 禁止点击
    })

    var imageUrls = this.data.imageUrls.join(',')
    http.post('/api/refund', {
      // userId: this.data.userId,
      ordersId: this.data.orderId,
      // number: this.data.number,
      orderProductList: this.data.productList,
      imageUrls: imageUrls,
      refundReason: this.data.reason
    }).then(res => {
      if (!res.errCode) {
        Toast.clear()
        setTimeout(() => {
          Toast.success('提交成功')
        }, 200)
        wx.navigateBack({

        })
      } else {
        Toast.clear()
        Toast.fail(res.errMsg)
      }
    }).catch(err => {
      Toast.clear()
      Toast.fail('系统繁忙')
      console.log(err)
    })
  },

  onLoad: function(options) {
    this.getOrder(options.orderId)
    this.setData({
      userId: wx.getStorageSync('user').userId,
      orderId: options.orderId,
      number: options.number
    })
  },


  // radio 性别选择
  changeGender(e) {
    this.setData({
      gender: e.detail
    });
  },
  // picker YMD时间选择 / picker -region  
  changeStartTime(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  // picker YMDhm设置退款时间
  changeRefundDeadline: function(e) {
    let time = e.detail.value
    let timeArray = this.data.timeArray
    this.setData({
      refundDeadline: `${timeArray[0][time[0]]}-${timeArray[1][time[1]]}-${timeArray[2][time[2]]} ${timeArray[3][time[3]]}:${timeArray[4][time[4]]}`
    })
  },
  // 获取一张图片
  getImage: function() {
    wx.chooseImage({
      count: 1, //根据imagelist长度 控制可添加的图片数量
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.data.image = res.tempFilePaths;
        this.setData({
          image: this.data.image
        })
        console.log(res)
        wx.uploadFile({
          url: http.config.baseUrl + "/api/upload-image",
          filePath: this.data.image[0],
          name: 'file',
          formData: {
            type: "yizi"
          },
          header: http.config.header,
          success: res => {
            let data = JSON.parse(res.data);
            let imageUrl = http.config.baseUrl + data.data;
            this.setData({
              imageUrl: imageUrl
            })
          }
        })
      }
    })
  },
  // 获取多张图片
  getImageList: function() {
    let count = 3 - this.data.imageList.length
    wx.chooseImage({
      count: count, //根据imagelist长度 控制可添加的图片数量
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // 
        this.data.imageList = this.data.imageList.concat(res.tempFilePaths);
        this.setData({
          imageList: this.data.imageList
        })
        res.tempFilePaths.forEach(item => {
          wx.uploadFile({
            url: http.config.baseUrl + "/api/upload-image",
            filePath: item,
            name: 'file',
            formData: {
              type: "trip"
            },
            header: http.config.header,
            success: res => {
              let data = JSON.parse(res.data);
              let imageUrl = http.config.baseUrl + data.data;
              this.data.imageUrls.push(imageUrl);
              this.setData({
                imageUrls: this.data.imageUrls
              })
            }
          })
        })
      }
    })
  },
  // 删除一张图片
  deleteImage(e) {
    this.setData({
      image: null,
      imageUrl: null
    })
  },
  // 删除多张图片
  deleteImages(e) {
    this.data.imageList.splice(e.target.dataset.index, 1)
    this.data.imageUrls.splice(e.target.dataset.index, 1)
    this.setData({
      imageList: this.data.imageList,
      imageUrls: this.data.imageUrls
    })
  },
})