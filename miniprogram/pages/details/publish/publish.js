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
		isAdmin: false,
		noMore: false,
		hasPrev: false,
		hasNext: false,
		prevId: '',
		nextId: '',
		islike: false,
		isLogin: false,
		likeImg: '../../../images/love.jpg',
		avatarList: [],
		collectImg: '../../../images/collect.jpg',
		collectName: '收藏',
		isShowPoster: false
	},

	giveLike: function (e) {
		// console.log(e)
		const that = this
		const articleId = e.currentTarget.dataset.id
		// console.log(id)
		const userInfo = wx.getStorageSync('userinfoLogs') || []
		let userId = ''
		let isLogin = false
		let userAvatar = ''
		if (userInfo.length !== 0) {
			userId = userInfo[0]._id
			userAvatar = userInfo[0].avatarUrl
			isLogin = true
		}
		console.log(userAvatar)
		// console.log(userId)
		// 先查数据库是否已经存在，若存在，则已点赞
		// 存在再进行操作则为取消点赞
		// 若不存在，则点赞，将信息存入数据库中
		wx.cloud.callFunction({
			name: 'checkLike',
			data: {
				userId: userId,
				articleId: articleId,
				userAvatar: userAvatar
			}
		}).then(res => {
			console.log(res)
			const msg = res.result.errMsg
			if (msg === 'collection.remove:ok') {
				// 点赞取消
				// 更新点赞人员
				// 更换点赞头像
				let likeImg = '../../../images/love.jpg'
				let isLike = false
				that.setData({
					likeImg: likeImg,
					isLike: isLike
				})
			} else {
				let likeImg = '../../../images/loved.jpg'
				let isLike = true
				that.setData({
					isLogin: isLogin,
					likeImg: likeImg,
					isLike: isLike
				})
			}
			that.getAvatarList(articleId)
			that.getArticleInfo(articleId)
		})
	},

	getArticleInfo: function (articleId) {
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

	getAvatarList: function (articleId) {
		const that = this
		db.collection('likes').where({
			articleId: articleId
		}).orderBy('likeTime', 'desc').orderBy('userId', 'asc').limit(6).get().then(res => {
			console.log(res)
			let userInfoList = res.data, avatarList = []
			for (let i = 0; i < userInfoList.length; i++) {
				if (userInfoList[i].userAvatar === '') {
					avatarList.push('../../../images/gravatar.jpg')
				} else {
					avatarList.push(userInfoList[i].userAvatar)
				}
			}
			console.log(avatarList)
			that.setData({
				avatarList: avatarList
			})
		})
	},

	goCollected: function (e) {
		const that = this
		let userInfo = wx.getStorageSync('userinfoLogs') || []
		if (userInfo.length === 0) {
			wx.showToast({
				title: '请登录再收藏'
			})
			wx.switchTab({
				url: '/pages/index/index'
			})
			wx.hideToast()
		} else {
			const id = e.currentTarget.dataset.id
			const userId = userInfo[0]._id
			wx.cloud.callFunction({
				name: 'checkCollection',
				data: {
					articleId: id,
					userId: userId
				}
			}).then(res => {
				console.log(res)
				const msg = res.result.errMsg
				if (msg === 'collection.remove:ok') {
					let collectImg = '../../../images/collect.jpg'
					let collectName = '收藏'
					that.setData({
						collectImg: collectImg,
						collectName: collectName
					})
				} else {
					let collectImg = '../../../images/collected.jpg'
					let collectName = '已收藏'
					that.setData({
						collectImg: collectImg,
						collectName: collectName
					})
				}
			})
		}
	},

	goHome: function () {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},

	previewImg(e) {
		var e = e.currentTarget.dataset.img;
		wx.previewImage({
			urls: e.split(",")
		});
	},

	goToArticle: function (e) {
		console.log(e)
		const id = e.currentTarget.dataset.id
		db.collection('articles').where({
			_id: id
		}).get().then(res => {
			// console.log(res)
			let articleInfo = res.data[0]
			const isAdmin = wx.getStorageSync('isAdmin')
			if (isAdmin === 'false') {
				articleInfo.views = articleInfo.views + 1
			}
			console.log(articleInfo)
			const userInfo = wx.getStorageSync('userinfoLogs') || []
			if (userInfo.length !== 0) {
				const userId = userInfo[0]._id
				wx.cloud.callFunction({
					name: 'updatedViews',
					data: {
						articleId: id,
						userId: userId
					}
				})
			}
			wx.cloud.callFunction({
				name: 'updatedArticle',
				data: {
					articleInfo: articleInfo
				}
			}).then(res => {
				console.log(res)
				wx.redirectTo({
					url: `/pages/details/publish/publish?id=${id}`
				})
			})
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(options)
		const articleId = options.id
		const that = this
		const userInfo = wx.getStorageSync('userinfoLogs') || []
		if (userInfo.length !== 0) {
			const userId = userInfo[0]._id
			db.collection('likes').where({
				articleId: articleId,
				userId: userId
			}).get().then(res => {
				console.log(res)
				if (res.data.length !== 0) {
					let likeImg = '../../../images/loved.jpg'
					that.setData({
						likeImg: likeImg
					})
				}
			})
			db.collection('collection').where({
				articleId: articleId,
				userId: userId
			}).get().then(res => {
				console.log(res)
				if (res.data.length !== 0) {
					let collectImg = '../../../images/collected.jpg'
					let collectName = '已收藏'
					that.setData({
						collectImg: collectImg,
						collectName: collectName
					})
				}
			})
		}
		that.getArticleInfo(articleId)
		that.getPrevNext(articleId)
		that.getAvatarList(articleId)
	},

	getPrevNext: function (articleId) {
		const that = this
		wx.cloud.callFunction({
			name: 'allArticles',
			data: {}
		}).then(res => {
			// console.log(res)
			let articlesList = res.result
			console.log(articlesList)
			let length = articlesList.length
			console.log(length)
			if (articleId === articlesList[0]._id) {
				let nextId = articlesList[1]._id
				that.setData({
					nextId: nextId,
					hasNext: true
				})
			} else if (articleId === articlesList[length - 1]._id) {
				let prevId = articlesList[length - 2]._id
				that.setData({
					prevId: prevId,
					hasPrev: true
				})
			} else {
				for (let i = 1; i < length; i++) {
					if (articleId === articlesList[i]._id) {
						let prevId = articlesList[i - 1]._id
						let nextId = articlesList[i + 1]._id
						that.setData({
							hasNext: true,
							hasPrev: true,
							nextId: nextId,
							prevId: prevId
						})
						break
					}
				}
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