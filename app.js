var server = require('./utils/server');
App({
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
				server.getJSON('/WxAppApi/setUserSessionKey', {code: res.code}, function (res) {
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

        //这一步先省略
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
