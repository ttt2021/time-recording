// miniprogram/pages/user/updated/updated.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// docSrc: '../../../images/circle.png',
		updatedContant: [
			{
				version: 'v1.0.0',
				time: '2021/1/31',
				content: [
					'1.0.0 版本上线'
				]
			},
			{
				version: 'v1.0.0',
				time: '2021/1/13',
				content: [
					'1.0.0 版本进入开发阶段'
				]
			}
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '日志时间轴',
			success: function (res) {
				// success
			}
		})
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

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})