// miniprogram/pages/admin/articles/articles.js
const db = wx.cloud.database();
const formatTime = require("../../../utils/formatTime.js");
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		articlesList: [[]],
		page: 0,
		hasArticle: false,
		noMore: false,
		isAdmin: true,
		title: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getList()
	},

	getList: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		db.collection('articles').where({}).limit(10).orderBy('createTime', 'desc').orderBy('openId', 'asc').get({
			success: res => {
				console.log(res)
				let articlesList = res.data
				for (let i = 0; i < articlesList.length; i++) {
					if (articlesList[i].isPublish === '0') { // 判断是否发表
						articlesList[i].isPublish = '未发表'
					} else {
						articlesList[i].isPublish = '已发表'
					}
					articlesList[i].createTime = formatTime.dayDate(articlesList[i].createTime)
				}
				that.setData({
					page: 0,
					["articlesList[0]"]: articlesList,
					hasArticle: true
				})
				wx.hideLoading()
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
		const that = this
		that.onLoad()
		that.onReachBottom()
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
		this.onRefresh()
	},

	onRefresh: function () {
		const that = this
		wx.showNavigationBarLoading()
		wx.showLoading({
			title: '刷新中...'
		})
		that.onLoad()
		wx.hideLoading()
		wx.hideNavigationBarLoading()
		wx.stopPullDownRefresh()
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		const that = this
		that.loadingMore()
	},

	loadingMore: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		let page = that.data.page + 10
		db.collection('articles').where({}).skip(page).limit(10).orderBy('createTime', 'desc').orderBy('openId', 'asc').get({
			success: res => {
				console.log(res)
				let articlesList = res.data
				console.log(articlesList)
				wx.hideLoading()
				if (articlesList.length === 0) {
					that.setData({
						noMore: true
					})
					return
				}
				for (let i = 0; i < articlesList.length; i++) {
					if (articlesList[i].isPublish === '0') { // 判断是否发表
						articlesList[i].isPublish = '未发表'
					} else {
						articlesList[i].isPublish = '已发表'
					}
					articlesList[i].createTime = formatTime.dayDate(articlesList[i].createTime)
				}
				that.setData({
					page: page,
					["articlesList[" + page + "]"]: articlesList,
					hasArticle: true
				})
				console.log(that.data.articlesList)
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})