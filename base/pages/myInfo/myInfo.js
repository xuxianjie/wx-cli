const http = require('../../utils/http.js')
const dateTimePicker = require('../../utils/dateTimePicker.js')
Page({


  data: {
    sex:"0",
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    showBool:true
  },
  closeLogin(){
    this.setData({
      showBool:false
    })
  },
  // 获取开始时间
  getStartTime: function (e) {
    // 获取到的时间为  当天的 8：00
    console.log(e)
    this.setData({
      startTime: e.detail.value
    })
  },

  // 获取时间戳
  // 设置截止时间
  getDeadLine: function (e) {
    let time = e.detail.value
    let timeArray = this.data.timeArray
    this.setData({
      deadline: `${timeArray[0][time[0]]}-${timeArray[1][time[1]]}-${timeArray[2][time[2]]} ${timeArray[3][time[3]]}:${timeArray[4][time[4]]}`
    })
  },

  load(e){
    console.log(e)
  },

  onChange(event) {
    this.setData({
      sex: event.detail
    });
  },
  // 提交表单
  putUserInfo:function(e){
    wx.$http.res['user'].put({
      id:this.data.userId,

    })
  },
  // 获取个人信息
  getUserInfo:function(){
    http.get(`/api/user/${userId}`).then(res=>{
      // 初始化 imageUrl 为icon
      userInfo.image = userInfo.icon
      this.setData({
       userInfo:res.data
      })
    })
  },
  onLoad: function (options) {
    // 获取时间array
    let timeObj = dateTimePicker.dateTimePicker(new Date().getFullYear(), 2050)
    this.setData({
      timeArray: timeObj.dateTimeArray,
      time: timeObj.dateTime
    })
    // this.getUserInfo()
  },


  onShow: function () {

  },


  onPullDownRefresh: function () {

  },



  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  }
})