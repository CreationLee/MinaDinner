var app = getApp()
Page({
	data: {
		shop:'新疆大盘鸡',
		tablenum:2,
		array:['一号','二号','三号'],
	
	},
	onLoad: function (res) {
		console.log(res.uid);
	},
	onShow: function() {}
});

