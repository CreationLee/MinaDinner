var app = getApp()
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

	onShow: function() {}
});

