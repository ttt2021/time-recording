// miniprogram/pages/index/index.js
const app = getApp()
const db = wx.cloud.database();
const formatTime = require("../../utils/formatTime.js");
const tool = require("../../utils/tool.js");
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		indicatorDots: true,
		interval: 5000,
		duration: 1000,
		autoplay: true,
		vertical: true,
		indicatorColor: 'rgba(255, 255, 255, .2)',
		indicatorActiveColor: '#ffffff',
		circular: true,
		img: [],
		noticeList: [
			'欢迎来到前端圣典！！！',
			'小程序上线了！！！',
			'让代码成为生活的一部分'
		],
		speedValue: 25,
		articlesList: [[]],
		hasArticle: false,
		noMore: false,
		title: '',
		isAdmin: false,
		inputVal: '',
		searchResult: []
	},

	keyInput: tool.debounce(function (e) {
		const that = this
		// console.log(e)
		let seachInfo = e[0].detail.value
		console.log(seachInfo)
		that.setData({
			inputVal: seachInfo,
			showSearch: true
		})
	}),

	search: tool.throttle(function (value) {
		const that = this
		let searchInfo = that.data.inputVal
		console.log(searchInfo)
		db.collection('articles').where({
			title: db.RegExp({
				regexp: searchInfo,
				options: 'is'
			}),
			isPublish: "1"
		}).get({
			success: res => {
				console.log(res)
				let searchResult = res.data
				that.setData({
					searchResult: searchResult
				})
			}
		})
	}),

	goDetail: function (e) {
		console.log(e)
		let articleId = e.currentTarget.dataset.info._id
		console.log(articleId)
		wx.navigateTo({
			url: `/pages/details/publish/publish?id=${articleId}`
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const isAdmin = "false"
		app.globalData.isAdmin = isAdmin
		// 将管理员标志存储到本地
		wx.setStorageSync('isAdmin', isAdmin)
		this.getLunboList()
		this.getlist()
	},

	getLunboList: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		db.collection('articles').where({}).limit(5).orderBy('views', 'desc').orderBy('openId', 'asc').get({
			success: res => {
				console.log(res)
				let list = res.data
				that.setData({
					img: list
				})
				// wx.hideLoading()
				console.log(that.data.img)
			}
		})
	},

	getlist: function () {
		const that = this
		// wx.showLoading({
		// 	title: '加载中...'
		// })
		db.collection('articles').where({}).limit(10).orderBy('createTime', 'desc').orderBy('openId', 'asc').get({
			success: res => {
				console.log(res)
				let articlesList = res.data
				console.log(articlesList)
				if (articlesList.length !== 0) {
					for (let i = 0; i < articlesList.length; i++) {
						if (articlesList[i].isPublish === '0') { // 判断是否发表
							articlesList.splice(i, 1)
							i--
						} else {
							articlesList[i].createTime = formatTime.dayDate(articlesList[i].createTime)
						}
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
		this.onLoad()
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
					// console.log(articlesList[i].isPublish)
					if (articlesList[i].isPublish === '0') {
						articlesList.splice(i, 1)
						i--
					} else {
						articlesList[i].createTime = formatTime.dayDate(articlesList[i].createTime)
					}
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