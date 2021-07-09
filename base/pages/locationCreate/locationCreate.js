const http = require('../../utils/http.js')
import Toast from '@vant/weapp/toast/toast';
const check = require('../../utils/check.js')
const dateTimePicker = require('../../utils/dateTimePicker.js')

Page({


  data: {

    location: {
      realName: '',
      mobilePhone: '',
      province: null,
      city: null,
      district: null,
      addressDetail: null,
      isDefault: false,
      region: null
    }
  },
  inputName(e) {
    this.data.location.realName = e.detail.value
    this.setData({
      location: this.data.location
    })
  },
  inputMobile(e) {
    this.data.location.mobilePhone = e.detail.value
    this.setData({
      location: this.data.location
    })
  },
  inputRegion(e) {
    this.data.location.province = e.detail.value[0]
    this.data.location.city = e.detail.value[1]
    this.data.location.district = e.detail.value[2]
    this.data.location.region = e.detail.value.join(',')
    this.setData({
      location: this.data.location
    })
  },
  inputAddress(e) {
    this.data.location.addressDetail = e.detail.value
    this.setData({
      location: this.data.location
    })
  },
  traggleDefault(e) {
    this.data.location.isDefault = !this.data.location.isDefault
    this.setData({
      location: this.data.location
    })
  },

  getSome: function() {
    http.get('/api/').then(res => {
      if (!res.errCode) {
        this.setData({

        })
      } else {
        Toast.fail({
          title: res.errMsg
        })
      }
    }).catch(err => {
      console.log(err)
      Toast.fail('系统繁忙')
    })
  },
  //修改地址
  postInfo: function(e) {
    console.log('修改地址', e)
    if (this.data.location.realName && this.data.location.mobilePhone && this.data.location.region && this.data.location.addressDetail) {
      if (this.data.location.mobilePhone.length !=11) {
      
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return;
      }
      // 加载提示
      Toast.loading({
        title: '加载中',
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true
        // 禁止点击
      })


      this.data.location.userId = this.data.userId
      console.log('location', this.data.location)
      if (this.data.type == 'change') {
        this.data.location.id = this.data.id
        http.put('/api/user-address/', this.data.location).then(res => {
          if (!res.errCode) {
            Toast.clear()
            setTimeout(() => {
              Toast.success('修改成功')
            }, 200)
            wx.navigateBack({})
          } else {
            Toast.clear()
            Toast.fail(res.errMsg)
          }
        }).catch(err => {
          Toast.clear()
          Toast.fail('系统繁忙')
          console.log(err)
        })
      } else {

        wx.$http.post('/api/user-address',this.data.location).then(res => {
          if (!res.errCode) {
            Toast.clear()
            setTimeout(() => {
              Toast.success('添加成功')
            }, 200)

            wx.navigateBack({})
          } else {
            Toast.clear()
            Toast.fail(res.errMsg)
          }
        }).catch(err => {
          Toast.clear()
          Toast.fail('系统繁忙')
          console.log(err)
        })
      }



    } else {
      Toast.fail('请填写必填信息')
    }
  },

  // 删除地址
  deleteInfo(e) {
    console.log('删除地址', e)
    if (this.data.location.id) {
      Toast.loading({
        title: '加载中',
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true
        // 禁止点击
      })
      http.delete('/api/user-address/' + this.data.location.id).then(res => {
        console.log('删除地址回调', res)
        if (!res.errCode) {
          Toast.clear()
          setTimeout(() => {
            Toast.success('删除成功')
          }, 200)
          wx.navigateBack({})
        } else {
          Toast.clear()
          Toast.fail(res.errMsg)
        }
      }).catch(err => {
        Toast.clear()
        Toast.fail('系统繁忙')
        console.log(err)
      })
    } else {
      wx.showToast({
        title: '删除失败，该地址不存在',
        duration: 3000,
        icon: 'none'
      })
    }
  },

  onLoad: function(options) {
    this.setData({
      type: options.type,
      id: options.id ? options.id : null,
      userId: wx.getStorageSync('user').userId,
    })
    if (options.type == 'change') {
      // 获取地址id
      http.get('/api/user-address/' + options.id).then(res => {
        res.data.region = res.data.province + ',' + res.data.city + ',' + res.data.district
        this.setData({
          location: res.data
        })
      })
    }
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