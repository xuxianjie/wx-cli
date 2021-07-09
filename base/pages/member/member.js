const http = require('../../utils/http.js')
const poster = require('../../utils/poster.js')
import Toast from '@vant/weapp/toast/toast';
Page({


  data: {

  },
  // 获取详情
  _getDetail:function(_detailId){
    // 加载提示
    Toast.loading({
      title: '加载中',
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
  // 获取成员列表
  getMemberList: function (_detailId, isFirst = false) {
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
      _detailId: _detailId
    }
    wx.$http.res['_interface'].page(pageParams).then(res => {
      if (!res.errCode) {
        // 初次加载直接覆盖原有数据
        if (isFirst) {
          this.data.memberList = res.data
        } else {
          this.data.memberList = [...this.data.memberList, ...res.data]
        }

        // 暂无图片展示
        if (this.data.memberList.length == 0) {
          this.setData({
            noOrder: true
          })
        }
        Toast.clear()

        this.setData({
          memberList: this.data.memberList,
          pageCount: res.pageParams.total,
          pageNum: this.data.pageNum
        })

        //  暂无标志
        if (this.data.memberList.length == 0) {
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
      userId:wx.getStorageSync('user').userId
    })
    this._getDetail(options._detailId)
    this.getMemberList(options._detailId,true)
  },


  onShow: function () {

  },


  onPullDownRefresh: function () {
    this.getMemberList('', true)
    
  },

  onReachBottom: function () {
    // 判断是否还有更多
    if (this.data.memberList.length < this.data.pageCount) {
      this.data.pageNum++
      this.getMemberList(this.data.status)
    }
  },


  onShareAppMessage: function () {

  }
})
