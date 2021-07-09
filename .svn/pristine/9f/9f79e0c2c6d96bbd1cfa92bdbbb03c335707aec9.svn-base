const http = require('../../utils/http.js')
const poster = require('../../utils/poster.js')
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
Page({


  data: {
    dataList: [],
    loading: false,
    pageSize: 10,
    pageNum: 1
  },
  goChange(e) {
    wx.navigateTo({
      url: '../locationCreate/locationCreate?type=change&id=' + this.data.locationList[e.currentTarget.dataset.index].id
    })
  },
  click(e) {
    console.log(e)
  },
  onClose(event) {

    var index = event.currentTarget.dataset.index

    const {
      position,
      instance
    } = event.detail;
    var _self = this
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？'
        }).then(() => {
 
          http.delete('/api/user-address/' + _self.data.locationList[index].id).then(res => {
            this.getLocationList()
            instance.close();
            Toast.success('删除成功')
          })
        }).catch(() => {

        });
        break;
    }
  },
  // 切换
  traggleTab: function(e) {
    this.setData({
      status: e.currentTarget.dataset.status,
      noOrder: false
    })
    this.getLocationList(e.currentTarget.dataset.status, true)
  },

  // 获取订单
  getLocationList: function(status, isFirst = false) {
    if (!this.data.userId) {
      Toast.fail('用户获取失败')
    }
    // 设置节流阀
    if (this.data.loading) {
      return
    }
    this.setData({
      loading: true
    })

    // 加载提示
    Toast.loading({
      message: '加载中',
      loadingType: 'spinner',
      duration: 0
    })
    // 传入 isFirst   是否加载第一页
    // 当首次加载 则pageNum=1
    var pageParams = {
        userId: wx.getStorageSync('user').userId
    }
    return wx.$http.get('/api/user-address',pageParams).then(res => {
      if (!res.errCode) {
        // 图片转换
        res.data.forEach(element => {
          element.imageUrls = this.reverseImageUrls(element.imageUrls)
        });
        // 初次加载直接覆盖原有数据
        console.log('地址回调',res.data)
        this.data.locationList = res.data

        Toast.clear()

        this.setData({
          locationList: this.data.locationList,

        })
        //  可以再次加载
        this.setData({
          loading: false
        })
      } else {
        Toast.clear()
        Toast.fail('未获取地址')
        this.setData({
          loading: false
        })
      }
    }).catch(err => {
      Toast.clear()
      wx.redirectTo({
        url: '../login/login',
      })
      this.setData({
        loading: false
      })
    })
  },


  onLoad: function(options) {
    this.setData({
      userId: wx.getStorageSync('user').userId
    })

  },


  onShow: function() {
    this.getLocationList('', true).then(res => {
      var location = this.data.locationList.find(item => {
        return item.isDefault
      })
      wx.setStorageSync('location', location)

    })
  },


  onPullDownRefresh: function() {
    this.getLocationList(this.data.status, true).then(res => {
      console.log('aaa')
      wx.stopPullDownRefresh()
    })

  },



  onReachBottom: function() {
    // 判断是否还有更多
    // if (this.data.locationList.length < this.data.pageCount) {
    //   this.data.pageNum++
    //     this.getLocationList(this.data.status)
    // }
  },


  onShareAppMessage: function() {

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
})