const http = require('../../utils/http.js')
import Toast from '@vant/weapp/toast/toast';
const check = require('../../utils/check.js')
const dateTimePicker = require('../../utils/dateTimePicker.js')

Page({


  data: {
  },
  _getDetail:function(_detailId){
    // 加载提示
    Toast.loading({
      message: '加载中',
      loadingType: 'spinner',
      duration: 0
    })
    wx.$http.res['_interface'].getById(_detailId).then(res=>{
      if(!res.errCode){
        this.setData({
          _detail: res.data
        })        
        Toast.clear()
      }else{
        Toast.clear()
        Toast.fail(res.errMsg)
      }
    }).catch(err=>{
      Toast.clear()
      Toast.fail('系统错误')
      console.log(err)
    })  
  },

  postInfo:function(e){
    // 表单验证是否为空
    var result = check.checkEmpty()
    if(!result.result){
      Toast.fail(result.word)
    }
    // 手机号码正则验证
    result = check.checkPhone(e.detail.value.mobeilPhone)
    if(!result.result){
      Toast.fail(result.word)
    }
    // 加载提示
    Toast.loading({
      message: '加载中',
      loadingType: 'spinner',
      duration: 0,
      forbidClick:true
      // 禁止点击
    })

    let params = e.detail.value
    params.userId = this.data.userId
    params._detailId = this.data._detailId
    params.refundDeadline = this.data.refundDeadline
    // ios不支持  2018-10-10 18:00  的格式转化为Date 需要转换为为 2018/10/10 18:00
    // let enterDeadline = new Date(this.data.deadline.replace(/-/g, '/')).getTime()
    // 获取到的时间为  当天的 8：00 去整点需要另外设置
    // startTime: new Date(this.data.startTime).getTime() - 28800000, 
    // endTime: new Date(this.data.endTime).getTime() + 57540000, 

    wx.$http.res['_interFace'].post(params).then(res=>{
      if(!res.errCode){
        Toast.clear()
        Toast.success('创建成功')
        wx.redirectTo({
          url: `../_detailDetail/_detailDetail?_detailId=${res.data.id}`,
        })
      }else{
        Toast.clear()
        Toast.fail(res.errMsg)
      }
    }).catch(err=>{
      Toast.clear()
      Toast.fail('系统繁忙')
      console.log(err)
    })
  },

  onLoad: function (options) {
    // 获取时间 YMDhm time为当前时间
    let timeObj = dateTimePicker.dateTimePicker(new Date().getFullYear(), 2050)
    this.setData({
      _detailId:options._detailId,
      timeArray: timeObj.dateTimeArray,
      nowTime: timeObj.dateTime,
    userId:wx.getStorageSync('user').userId,

    })
    this._getDetail()
  },

  // picker YMDhm设置退款时间
  changeRefundDeadline:function(e){
    let time = e.detail.value
    let timeArray = this.data.timeArray
    this.setData({
      refundDeadline: `${timeArray[0][time[0]]}-${timeArray[1][time[1]]}-${timeArray[2][time[2]]} ${timeArray[3][time[3]]}:${timeArray[4][time[4]]}`
    })
  },
  // 获取一张图片
  getImage:function(){
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
            type: "trip"
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
  getImageList:function(){
    let count = 3-this.data.imageList.length
    wx.chooseImage({
      count:count, //根据imagelist长度 控制可添加的图片数量
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=>{
        // 
        this.data.imageList=this.data.imageList.concat(res.tempFilePaths);
        this.setData({
          imageList:this.data.imageList
        })
        res.tempFilePaths.forEach(item=>{
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
      imageUrl:null
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
