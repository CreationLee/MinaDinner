var server = require('./utils/server');

App({
  globalData: {
    hasLogin: false,
    userInfo: {},
    orderType: {
      1: 'booking',
      2: 'order',
    }
  },

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
        server.postJSON('/WxAppApi/checkSignature', {
					rd_session: self.rd_session,
          encryptedData: res.encryptedData,
          iv: res.iv
				}, function (res) {
          let userInfo = {};
          userInfo.id = res.data.id;
          userInfo.nickName = JSON.parse(res.data.info).nickName
          self.globalData.userInfo = userInfo;					
					if (res.data.errorcode) {
						// TODO:验证有误处理
					}
				});
			}
		});
	}
})
