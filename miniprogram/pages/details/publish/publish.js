// miniprogram/pages/details/publish/publish.js
const db = wx.cloud.database();
const app = getApp()
const formatTime = require("../../../utils/formatTime.js");
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		articleInfo: {},
		canOpenView: false,
		isAdmin: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options)
		const articleId = options.id
		const that = this
		db.collection('articles').where({
			_id: articleId
		}).get({
			success: res => {
				console.log(res)
				let articleInfo = res.data[0]
				console.log(articleInfo)
				wx.setNavigationBarTitle({
					title: `${articleInfo.title}`,
					success: function (res) {
						// success
					}
				})
				let isAdmin = wx.getStorageSync('isAdmin') === 'true' ? true : false
				console.log(isAdmin)
				articleInfo.createTime = formatTime.dayDate(articleInfo.createTime)
				that.setData({
					articleInfo: articleInfo,
					canOpenView: true,
					isAdmin: isAdmin
				})
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