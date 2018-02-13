let app = getApp();
let server = require('../../utils/server');

Page({

  data: {

    orders:[ ],
    buttonSelected: 'today',
    time: 0,
    shop: {}
  },

  onLoad: function (options) {
    let that = this;
    let userId = app.globalData.userInfo.id;
    server.getJSON('/order/' + userId,function(res){
      res.data.forEach(function(order,i){
        order.revertedTime = that.timestampTotime(order.create_at);
      });
      console.log(res);
      that.setData({orders: res.data});
      wx.getStorage({
        key: 'shop',
        success: function (res) { that.setData({ shop: res.data}); },
      })
      
    });
    
    that.setData({ time: that.getTimeStamp()})
    
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

  switchTap: function(e){
    let that = this;
    if (that.data.buttonSelected =='today'){
      that.setData({ buttonSelected: 'history'})
    }else{
      that.setData({ buttonSelected: 'today' })
    }
  },

  getTimeStamp: function(){
    let time = new Date();
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    time.getTime();
    time = Date.parse(time);
    return time;
  },

  timestampTotime: function(date){
    var date = new Date(parseInt(date));
    return date.toLocaleString();
  }
  

  
})