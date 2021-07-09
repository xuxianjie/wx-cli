var http = require("../../utils/http")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:null,
    couponList:[],
    showNo: false,
  },
  getCoupon:function(){
    http.get(`/api/user-coupon-page`,{
      userId:this.data.userId,
      status:'unUse'
    }).then(res=>{
      console.log(res)
      this.setData({
        couponList:res.data
      })
      if (this.data.couponList.length == 0) {
        this.setData({
          showNo: true
        })
      }

    })
  },
  // 使用优惠券
  useCoupon:function(e){
    let index = e.currentTarget.dataset.index
    let coupon = this.data.couponList[index]
    console.log(coupon)
    if(coupon.type == 'activityUnique'){
      wx.navigateTo({
        url: `../activityInfo/activityInfo?activityId=${coupon.coupon.activityId}`,
      })
    }else{
      wx.switchTab({
        url: '../home/home',
      })
    }

  },


  onLoad: function (options) {
    this.setData({
      userId:wx.getStorageSync('user').userId ||null
    })
    this.getCoupon()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})