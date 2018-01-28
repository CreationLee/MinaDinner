var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
    shop: {
      name: '',
      logo: '',
      announce: '',
      tableNum: 0,
    },
		tablenum:0,
    cart: {
      count: 0,
      total: 0,
      list: {},
      shopid: '',
    },
    goods: []
	
	},

	onLoad: function () {
    var that = this;
    var shop = wx.getStorageSync('shop');
    var cart = wx.getStorageSync('cart');
    var goods = wx.getStorageSync('goods');

    that.setData({
      shop: shop,
      cart: cart,
      goods: goods
    });

	},

  onShow: function() {},
  
  checkBill: function() {
    let that = this;
    wx.showModal({
      title: '确认付款',
      content: '仅为测试使用',
      confirmText: "确认",
      cancelText: "取消",
      success: function(res){
        if (res.confirm===false){
          return;
        }

        let orderData = that.orderData();
        let orderDishData = that.orderDishData();

        server.postJSON('/order/create', {orderData: orderData, orderDishData: orderDishData},
          function(res){

          }
        );

      }      
    });
  },

  orderData: function() {
    let orderData = {};
    orderData.customer_id = app.globalData.userInfo.id;
    orderData.restaurant_id = this.data.shop.id;
    orderData.order_status = 1;
    orderData.type = 1;
    orderData.pay_type = 0;
    orderData.cost = this.data.cart.total;
    orderData.paid = this.data.cart.total;
    return orderData;
  },

  orderDishData: function() {
    let cartData = [];
    let sn = 0;
    for (let i in this.data.cart.list){
      cartData[sn++] = {
        id: i,
        num: this.data.cart.list[i],
        price: this.data.goods[i].price
      }
    }
    return cartData;
  }

});

