var server = require('./utils/server');

App({
<<<<<<< HEAD
  onLaunch: function () {
    var self = this;
    var rd_session = wx.getStorageSync('rd_session');
    console.log('rd_session', rd_session)
    if (!rd_session) {
      self.login();
    } else {
      wx.checkSession({
        success: function () {
          // 登录态未过期
          console.log('登录态未过期')
          self.rd_session = rd_session;
          self.getUserInfo();
        },
        fail: function () {
          //登录态过期
          self.login();
        }
      })
    }
  },
=======
	onLaunch: function () {
		var self = this;
		var rd_session = wx.getStorageSync('rd_session');
		console.log('rd_session', rd_session)
		if (!rd_session) {
      console.log('没登陆');
			self.login();
		} else {
			wx.checkSession({
				success: function () {
					// 登录态未过期
					console.log('登录态未过期')
					self.rd_session = rd_session;
					self.getUserInfo();
				},
				fail: function () {
					//登录态过期
          console.log('登陆过期');
					self.login();
				}
			})
		}
	},
>>>>>>> 835cf3008b255248b8bf486d912efab22af28b0e
	onShow: function () {
		
	},
	onHide: function () {
		
	},
	globalData: {
		hasLogin: false,
		shopid: '',
    userInfo:'',	
	},
	rd_session: null,
	login: function() {
		var self = this;
		wx.login({
			success: function (res) {
<<<<<<< HEAD
				console.log('wx.login',res)
        server.getJSON('/WxAppApi/setUserSessionKey', {code: res.code}, function (res) {
=======
				server.getJSON('/WxAppApi/setUserSessionKey', {code: res.code}, function (res) {
>>>>>>> 835cf3008b255248b8bf486d912efab22af28b0e
          self.rd_session = res.data.session_key;
					self.globalData.hasLogin = true;
					wx.setStorageSync('rd_session', self.rd_session);
					self.getUserInfo();
				});
			}
		});
	},

	getUserInfo: function() {
		var self = this;
		wx.getUserInfo({
			success: function(res) {
				//console.log('getUserInfo', res)
				self.globalData.userInfo = res.userInfo;
<<<<<<< HEAD
=======

        //这一步先省略
>>>>>>> 835cf3008b255248b8bf486d912efab22af28b0e
				// server.getJSON('/WxAppApi/checkSignature', {
				// 	rd_session: self.rd_session,
				// 	result: res
				// }, function (res) {
				// 	console.log('checkSignature', res)
				// 	if (res.data.errorcode) {
				// 		// TODO:验证有误处理
				// 	}
				// });
			}
		});
	}
})
