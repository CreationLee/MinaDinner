let app = getApp();
let server = require('../../utils/server');

Page({

  data: {

    orders:[ ],
    buttonSelected: 'today',
    shop: {}
  },

  onLoad: function (options) {
    let that = this;
    let userId = app.globalData.userInfo.id;
    server.getJSON('/order/' + userId,function(res){
      that.setData({orders: res.data});
      console.log(res);
      wx.getStorage({
        key: 'shop',
        success: function (res) { that.setData({ shop: res.data}); },
      })
      
    });
    
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
  
  
})