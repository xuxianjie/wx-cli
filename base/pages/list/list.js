const http = require('../../utils/http.js')
const poster = require('../../utils/poster.js')
import Toast from '@vant/weapp/toast/toast';

Page({


  data: {
    _list:[],
    loading:false,
    pageSize:10,
    pageNum:1
  },

  // 切换
  traggleTab: function (e) {
    this.setData({
      status: e.currentTarget.dataset.status,
      noOrder: false
    })
    this._getList( true)
  },

  // 获取订单
  _getList: function ( isFirst = false) {
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
      title: '加载中',
      loadingType: 'spinner',
      duration: 0
    })
    // 传入 isFirst   是否加载第一页
    // 当首次加载 则pageNum=1
    if (isFirst) {
      this.data.pageNum = 1
    }
    var pageParams = {
      pageSize: 10,
      pageNum: this.data.pageNum,
      userId: this.data.userId,
   
    }
    return wx.$http.res['_interface'].page(pageParams).then(res => {
      if (!res.errCode) {
        // 图片转换
        res.data.forEach(element => {
          element.imageUrls = this.reverseImageUrls(element.imageUrls)
        });
        // 初次加载直接覆盖原有数据
        if (isFirst) {
          this.data._list = res.data
        } else {
          this.data._list = [...this.data._list, ...res.data]
        }
        Toast.clear()

        this.setData({
          _list: this.data._list,
          pageCount: res.pageParams.total,
          pageNum: this.data.pageNum
        })

        //  暂无标志
        if (this.data._list.length == 0) {
          this.setData({
            noList: true
          })
        }
        //  可以再次加载
        this.setData({
          loading: false
        })
      } else {
        Toast.clear()
        Toast.fail('加载失败')
        this.setData({
          loading: false
        })
      }
    }).catch(err=>{
      Toast.clear()
      Toast.fail('系统繁忙')
      console.log(err)
      this.setData({
        loading: false
      })
    })
  },


  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('user').userId
    })
  },


  onShow: function () {
    this._getList(true)
  },


  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中...',
    })
    this._getList( true).then(res=>{
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })

  },



  onReachBottom: function () {
    // 判断是否还有更多
    if (this.data._list.length < this.data.pageCount) {
      this.data.pageNum++
      this._getList()
    }
  },


  onShareAppMessage: function () {

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
})
