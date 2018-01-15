var app = getApp();
var server = require('../../utils/server');
Page({
	data: {
		goods: {
			
		},
		shop:{
			name:'',

		},
		
		goodsList: [
			
		],
		cart: {
			count: 0,
			total: 0,
			list: {},
			shopid:'',
		},
		showCartDetail: false
	},
	onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://www.orders.autodone.com?rid=' + 8,
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        res.data.cat.forEach(function(classify, i){
          classify.id = String.fromCharCode(65+i);
       })
       console.log(res.data.cat);
       that.setData({
          'shop.name': res.data.res.rname,
          'shop.anounce': res.data.res.announce,
          'shop.logo': res.data.res.rlogo,
          goods: res.data.menu,
          goodsList: res.data.cat,
          classifySeleted: res.data.cat[0].id
        });

      },
      fail: function (res) {
        console.log('出错')
      }

    })
    
    // this.data.goodsList.forEach(function (classify, i) {
    //   console.log(85);

    // })
    
		// var shopId = options.id;
		// for (var i = 0; i < app.globalData.shops.length; ++i) {
		// 	if (app.globalData.shops[i].id == shopId) {
		// 		this.setData({
		// 			shop: app.globalData.shops[i]
		// 		});
		// 		break;
		// 	}
		// }
	},
	onShow: function (e) {
    
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
			var goods = this.data.goods[id];
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
			var _h = 70 + classify.list.length * (46 * 3 + 20 * 2);
			if (scrollTop >= h - 100 / scale) {
				classifySeleted = classify.id;
			}
			h += _h;
		});
		this.setData({
			classifySeleted: classifySeleted
		});
	},
	tapClassify: function (e) {
		var id = e.target.dataset.id;
    console.log(id)
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
        url: '../success/success?formdata='+formdata,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
	// }
	// })
}
	// submit: function (e) {
	// 	console.log(e);
	// 	server.sendTemplate(e.detail.formId, null, function (res) {
	// 		if (res.data.errorcode == 0) {
	// 			wx.showModal({
	// 				showCancel: false,
	// 				title: '恭喜',
	// 				content: '订单发送成功！下订单过程顺利完成，本例不再进行后续订单相关的功能。',
	// 				success: function(res) {
	// 					if (res.confirm) {
	// 						wx.navigateBack();
	// 					}
	// 				}
	// 			})
	// 		}
	// 	}, function (res) {
	// 		console.log(res)
	// 	});
	// }
});

