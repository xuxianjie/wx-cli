var http = require("../../utils/http")
var time = require('../../utils/time');
import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:null,
    couponList:[],
    pageNum:0,
    showNo:false,
    isSubmit:false,
    isNew:false
  },
  // 获取头部轮播
  getCoursel: function () {
    http.get(`/api/carousel-picture`, {
      type: 'coupon'
    }).then(res => {
      this.setData({
        coursel: res.data
      })
    })
  },


  getCouponList:function(){
    var orderBy = ''
    orderBy = "coupon.create_time desc,quantity asc"
    http.get(`/api/coupon-page`,{
      userId:this.data.userId,
      orderBy:orderBy,
      isNew:false
    }).then(res=>{
      this.setData({
        couponList:res.data
      })
      if(this.data.couponList.length<=0){
        this.setData({
          showNo:true
        })
      }
    })
  },
  catchCoupon:function(e){
    // 防止多次领取同一张优惠券
    if(this.data.isSubmit){
      $wuxToast().show({
        type: 'forbidden',
        duration: 1500,
        color: '#fff',
        text: '领取中',
      })
      return
    }
    if(this.data.couponList[e.currentTarget.dataset.index].quantity <= 0 ){
      $wuxToast().show({
        type: 'forbidden',
        duration: 1500,
        color: '#fff',
        text: '该券已领完',
      })
      return
    }
    // 领取中
    this.setData({
      isSubmit:true
    })
    http.post(`/api/user-coupon`,{
      userId:this.data.userId,
      couponId:this.data.couponList[e.currentTarget.dataset.index].id,
      type:this.data.couponList[e.currentTarget.dataset.index].type
    }).then(res=>{
      // 领取后， 页面数量修改
      this.data.couponList[e.currentTarget.dataset.index].quantity--
      this.data.couponList[e.currentTarget.dataset.index].isHave = true
      this.setData({
        couponList:this.data.couponList,
        isSubmit:false
      })
      $wuxToast().show({
        type: 'success',
        duration: 1500,
        color: '#fff',
        text: '领取成功',
      })
      if(this.data.couponList.length == 0){
        this.setData({
          showNo:true
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      userId:wx.getStorageSync('user').userId ||null,
      isNew:options.isNew || false
    })
    this.getCouponList()
    this.getCoursel()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  onPullDownRefresh: function () {
    this.setData({
      couponList:[],
      hasMore:true
    })
  },


  onReachBottom: function () {
    if(this.data.hasMore){
      this.getCouponList()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})