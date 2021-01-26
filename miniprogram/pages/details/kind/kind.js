// miniprogram/pages/details/kind/kind.js
const db = wx.cloud.database();
const formatTime = require("../../../utils/formatTime.js");

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		kindList: {},
		articlesList: [[]],
		hasArticle: false,
		noMore: false,
		title: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// console.log(options.title)
		wx.showLoading({
			title: '加载中...'
		})
		const title = options.title
		wx.setNavigationBarTitle({
			title: `${title}`,
			success: function (res) {
				// success
			}
		})
		const that = this
		that.setData({
			title: title
		})
		this.getKind()
	},

	getKind: function () {
		const that = this
		const title = that.data.title
		db.collection('kind').where({
			title: title
		}).get({
			success: res => {
				const kindList = res.data[0]
				that.setData({
					kindList: kindList
				})
				that.getList()
			}
		})
	},

	getList: function () {
		const that = this
		const title = that.data.title
		db.collection('articles').where({
			kind: title
		}).limit(10).orderBy('createTime', 'openId').get({
			success: res => {
				console.log(res)
				let articlesList = res.data
				console.log(articlesList)
				if (articlesList.length !== 0) {
					for (let i = 0; i < articlesList.length; i++) {
						articlesList[i].createTime = formatTime.dayDate(articlesList[i].createTime)
						// console.log(articlesList[i].createTime)
					}
					that.setData({
						page: 0,
						["articlesList[0]"]: articlesList,
						hasArticle: true
					})
				}
				console.log(that.data.articlesList)
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

	onRefresh: function () {
		const that = this
		const options = {
			title: that.data.title
		}
		wx.showNavigationBarLoading()
		wx.showLoading({
			title: '刷新中...'
		})
		that.onLoad(options)
		wx.hideLoading()
		wx.hideNavigationBarLoading()
		wx.stopPullDownRefresh()
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.onRefresh()
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
		const title = that.data.title
		wx.showLoading({
			title: '加载中...'
		})
		let page = that.data.page + 10
		db.collection('articles').where({
			kind: title
		}).skip(page).limit(10).orderBy('createTime', 'openId').get({
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
					articlesList[i].createTime = formatTime.dayDate(articlesList[i].createTime)
					// console.log(articlesList[i].createTime)
				}
				that.setData({
					page: page,
					["articlesList[" + page + "]"]: articlesList,
					hasArticle: true
				})
				console.log(that.data.articlesList)
				wx.hideLoading()
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})