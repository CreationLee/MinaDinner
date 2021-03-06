var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
		
		shop:{
			name: '',
      logo: '',
      announce: '',
      tableNum: 0,
		},
		
		goodsList: [
			
		],

    goods: [ ],

		cart: {
			count: 0,
			total: 0,
			list: {},
			shopid:'',
		},

    classifySeleted: '',
		showCartDetail: false,
    Syncfinish: 0
	},

	onLoad: function (options) {
    wx.showLoading('加载中');
    var that = this;
    server.getJSON('/restaurant/1', function (res) {
      that.setMenuData(res.data);
    });    
	},

  setMenuData: function (data) {
    var that = this;
    let goods = {};
    data.dishCategories.forEach(function(classify, i){
      classify.id = 'cate' + classify.id;
      classify.dishes.forEach(function(dish, i){
        goods[dish.id] = dish;
      });
    });
    
    that.setData({
      'shop.id': data.id,
      'shop.name': data.name,
      'shop.logo': data.logo,
      'shop.announce': data.announce,
      'shop.tableNum': data.table_num,

      goods: goods,
      goodsList: data.dishCategories,
      classifySeleted: data.dishCategories[0].id

    });
    
    wx.setStorageSync('shop',that.data.shop);
    wx.setStorageSync('goods', that.data.goods);

  },

	onShow: function (e) {
    wx.hideLoading();
  },

	tapAddCart: function (e) {
		this.addCart(e.target.dataset.id);
	},

	tapReduceCart: function (e) {
		this.reduceCart(e.target.dataset.id);
	},
	addCart: function (id) {
		var num = this.data.cart.list[id] || 0;
		this.data.cart.list[id] = num + 1;
		this.countCart();
	},
	reduceCart: function (id) {
		var num = this.data.cart.list[id] || 0;
		if (num <= 1) {
			delete this.data.cart.list[id];
		} else {
			this.data.cart.list[id] = num - 1;
		}
		this.countCart();
	},
	countCart: function () {
		var count = 0,
			  total = 0;
    
		for (var id in this.data.cart.list) {
			var goods = this.data.goods[id];``
			count += this.data.cart.list[id];
			total += goods.price * this.data.cart.list[id];
		}
		this.data.cart.count = count;
		this.data.cart.total = total;
		this.setData({
			cart: this.data.cart
		});
	},
	follow: function () {
		this.setData({
			followed: !this.data.followed
		});
	},
	onGoodsScroll: function (e) {
		if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
			this.setData({
				scrollDown: true
			});
		} else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
			this.setData({
				scrollDown: false
			});
		}
  var scale = e.detail.scrollWidth / 570,
			scrollTop = e.detail.scrollTop / scale,
			h = 0,
			classifySeleted,
      len = this.data.goodsList.length;
		this.data.goodsList.forEach(function (classify, i) {
			var _h = 70 + classify.dishes.length * (46 * 3 + 20 * 2);
			if (scrollTop >= h - 100 / scale) {
				classifySeleted = classify.id;
			}
			h += _h;
		});
		this.setData({
			classifySeleted: classifySeleted
		});
	},

  // 点击分类
	tapClassify: function (e) {
		var id = e.target.dataset.id;
		this.setData({
			classifyViewed: id
		});
		var self = this;
		setTimeout(function () {
			self.setData({
				classifySeleted: id
			});
		}, 100);
	},

	showCartDetail: function () {
		this.setData({
			showCartDetail: !this.data.showCartDetail
		});
	},
	hideCartDetail: function () {
		this.setData({
			showCartDetail: false
		});
	},

  takeBill: function () {
    var that = this;
    wx.setStorage({
      key: 'cart',
      data: that.data.cart,
      success: function(){
        wx.navigateTo({ url:'../check/check'});
      }
    })

  },


// 结算先留着
	openConfirm: function () {
		var that=this;
        wx.showModal({
            title: '确认付款？',
            content: '请点击确认付款或取消再选择',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
					that.submit()
                }else{
                    console.log('用户点击辅助操作')
                }
            }
        });
    },
	submit: function(e){
    wx.showLoading({
      title: '提交中',
    })
	this.data.cart.shopid=8;
  var formdata =this.data.cart;
 formdata.userinfo = app.globalData.userInfo.city + ',' + app.globalData.userInfo.nickName;
  formdata.table=1;
  formdata=JSON.stringify(formdata);
  console.log(formdata)
	// wx.request({
	// 	url:'http://www.orders.autodone.com/index.php',
	// 	method:'POST',
	// 	data:formdata,
	// 	success:function(res){
      // if(res.data==1){
      //   wx.hideLoading();
      //   wx.showToast({
      //     title: '提交成功',
      //     icon: 'success',
      //     duration: 40000
      //   })
      //   wx.redirectTo({
      //     url: '../success/success',
      //     success: function(res) {},
      //     fail: function(res) {},
      //     complete: function(res) {},
      //   })
      // }else if(res.data==0){
      //   wx.showToast({
      //     title: '提交失败',
      //     icon: 'loading',
      //     duration: 2000
      //   })
      // }
      wx.redirectTo({
        url: '../order/order?formdata='+formdata,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
	// }
	// })
}


});

