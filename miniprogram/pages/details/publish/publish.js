// miniprogram/pages/details/publish/publish.js
const db = wx.cloud.database();
const app = getApp()
const formatTime = require("../../../utils/formatTime.js");
// const QR = require("../../../utils/qrcode.js");
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
		isShowPoster: false,
		imgCode: '', // 二维码地址
		likeInfo: [],
		show: false,
		commentContent: '',
		commentsList: [],
		commentLikeImage: '../../../images/like.jpg',
		commentLikeCount: 0
		// canvasHidden: false
	},

	onClickShow() {
		let userInfo = wx.getStorageSync('userinfoLogs') || []
		if (userInfo.length !== 0) {
			this.setData({
				show: true
			});
			// 若一分钟后还没有写评论，则关闭评论窗口
			setTimeout(() => {
				if (this.data.commentContent === '') {
					this.setData({
						show: false
					});
				}
			}, 60000)
		} else {
			wx.showToast({
				title: '请登录'
			})
			wx.switchTab({
				url: '/pages/me/me'
			})
		}
	},

	onChange: function (e) {
		console.log(e)
		const that = this
		let content = e.detail
		that.setData({
			commentContent: content
		})
	},

	// 发表评论
	send: function () {
		let userInfo = wx.getStorageSync('userinfoLogs') || []
		const that = this
		if (userInfo.length !== 0) {
			let userinfo = userInfo[0]
			let articleId = that.data.articleInfo._id
			let comments = that.data.articleInfo.comments + 1
			let content = that.data.commentContent
			// console.log('context', context)
			wx.cloud.callFunction({
				name: 'publishComment',
				data: {
					articleId: articleId,
					comments: comments,
					userId: userinfo._id,
					username: userinfo.nickName,
					avatar: userinfo.avatarUrl,
					content: content,
					commentLike: 0
				}
			}).then(res => {
				that.setData({
					commentContent: ''
				})
				// 更新评论列表
				that.getCommentsList(articleId)
				wx.showToast({
					title: '发表成功'
				})
			})
		} else {
			wx.showToast({
				title: '请登录'
			})
			wx.switchTab({
				url: '/pages/me/me'
			})
		}
	},

	// onClickHide() {
	// 	this.setData({
	// 		show: false
	// 	});
	// },

	showPoster: function (e) {
		// console.log(e)
		const that = this
		that.setData({
			isShowPoster: true
		})
		// // 绘制二维码
		// that.getCode()
		wx.showToast({
			title: '海报暂未开通'
		})
	},

	// getCode: function () {
	// 	const that = this
	// 	let pages = getCurrentPages(); //获取加载的页面	
	// 	let currentPage = pages[pages.length - 1]; //获取当前页面的对象
	// 	let url = currentPage.route ;//当前页面url
	// 	let options = currentPage.options.id
	// 	// console.log(url, options.id)	
	// 	// const articleInfo = e.currentTarget.dataset.info
	// 	// const articleId = articleInfo.id
	// 	// const articleTitle = articleInfo.title
	// 	const articlePath = `${url}?id=${options}`
	// 	// console.log(articlePath)
	// 	// 绘制大小
	// 	const size = that.setCanVasSize()
	// 	// 绘制二维码
	// 	that.createQrCode(articlePath, 'canvasCode', size.w, size.h)
	// },


	// setCanVasSize: function () {
	// 	let size = {}
	// 	const res = wx.getSystemInfoSync()
	// 	const scale = 750 / 200
	// 	const width = res.windowWidth / scale
	// 	const height = width
	// 	size.w = width
	// 	size.h = height
	// 	return size
	// },

	// // 绘制二维码
	// createQrCode: function (url, canvasId, cavW, cavH) {
	// 	// 调用插件中的draw方法，绘制二维码
	// 	QR.api.draw(url, canvasId, cavW, cavH)
	// 	setTimeout(() => {
	// 		this.canvasToTempCodeImg(canvasId)
	// 	}, 1000)
	// },

	// canvasToTempCodeImg: function() {
	// 	const that = this
	// 	wx.canvasToTempFilePath({
	// 		canvasId: 'canvasCode',
	// 		success: function (res) {
	// 			const tempCodeImg = res.tempFilePath
	// 			console.log(tempCodeImg)
	// 			that.setData({
	// 				imgCode: tempCodeImg,
	// 				canvasHidden: true
	// 			})
	// 			let articleInfo = that.data.articleInfo
	// 			let picUrl = '../../../images/logo.gif'
	// 			let content = articleInfo.content
	// 			let title = articleInfo.title
	// 			that.canvasPoster(picUrl, tempCodeImg, title, content)
	// 		}
	// 	})
	// },

	// //将canvas转换为图片保存到本地，然后将路径传给image图片的src
	// canvasPoster: function (picUrl, tempCodeImg, title, content) {
	// 	const that = this
	// 	wx.showLoading({
	// 		title: '正在生成海报...'
	// 	})
	// 	let context = wx.createCanvasContext('canvasPoster');
	//   context.setFillStyle('#ffffff'); //填充背景色
	//   context.fillRect(0, 0, 600, 970);
	//   context.drawImage(picUrl, 0, 0, 600, 400); //绘制首图
	// 	context.drawImage(tempCodeImg, 210, 670, 180, 180); //绘制二维码
	// 	context.setFillStyle("#959595");
	//   context.setFontSize(20);
	//   context.setTextAlign('center');
	// 	context.fillText("阅读文章，请长按识别二维码", 300, 900);
	// 	context.setFillStyle("#959595");       
	//   formatTime.drawTitleExcerpt(context, title, content); //文章标题
	// 	context.draw();
	// 	//将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
	//   setTimeout(function() {
	//     wx.canvasToTempFilePath({
	//       canvasId: 'canvasPoster',
	//       success: function(res) {
	//         var tempFilePath = res.tempFilePath;
	//         // that.setData({
	//         //     imagePath: tempFilePath,
	//         //     maskHidden: "none"
	// 				// });
	// 				that.setData({
	// 					posterImg: tempFilePath
	// 				})
	//         wx.hideLoading();
	//         console.log("海报图片路径：" + res.tempFilePath);
	//         // that.modalView.showModal({
	//         //   title: '保存至相册可以分享到朋友圈',
	//         //   confirmation: false,
	//         //   confirmationText: '',
	//         //   inputFields: [{
	//         //     fieldName: 'posterImage',
	//         //     fieldType: 'Image',
	//         //     fieldPlaceHolder: '',
	//         //     fieldDatasource: res.tempFilePath,
	//         //     isRequired: false,
	//         //   }],
	//         //   confirm: function(res) {
	//         //     console.log(res)
	//         //     //用户按确定按钮以后会回到这里，并且对输入的表单数据会带回
	//         //   }
	//         // })


	//       },
	//       fail: function(res) {
	//         console.log(res);
	//       }
	//     });
	//   }, 1000);
	// },

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

	// previewImg(e) {
	// 	const e = e.currentTarget.dataset.img;
	// 	wx.previewImage({
	// 		urls: e.split(",")
	// 	});
	// },

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

	commentLike: function (e) {
		console.log(e)
		const that = this
		const info = e.currentTarget.dataset.info
		console.log(info)
		const userInfo = wx.getStorageSync('userinfoLogs') || []
		if (userInfo.length === 0) {
			wx.showToast({
				title: '请登录'
			})
			wx.switchTab({
				url: '/pages/me/me'
			})
		} else {
			let userId = userInfo[0]._id
			const articleId = that.data.articleInfo._id
		}


		// let userId = ''
		// let isLogin = false
		// let userAvatar = ''
		// if (userInfo.length !== 0) {
		// 	userId = userInfo[0]._id
		// 	userAvatar = userInfo[0].avatarUrl
		// 	isLogin = true
		// }
		// console.log(userAvatar)
		// // console.log(userId)
		// // 先查数据库是否已经存在，若存在，则已点赞
		// // 存在再进行操作则为取消点赞
		// // 若不存在，则点赞，将信息存入数据库中
		// wx.cloud.callFunction({
		// 	name: 'checkLike',
		// 	data: {
		// 		userId: userId,
		// 		articleId: articleId,
		// 		userAvatar: userAvatar
		// 	}
		// }).then(res => {
		// 	console.log(res)
		// 	const msg = res.result.errMsg
		// 	if (msg === 'collection.remove:ok') {
		// 		// 点赞取消
		// 		// 更新点赞人员
		// 		// 更换点赞头像
		// 		let likeImg = '../../../images/love.jpg'
		// 		let isLike = false
		// 		that.setData({
		// 			likeImg: likeImg,
		// 			isLike: isLike
		// 		})
		// 	} else {
		// 		let likeImg = '../../../images/loved.jpg'
		// 		let isLike = true
		// 		that.setData({
		// 			isLogin: isLogin,
		// 			likeImg: likeImg,
		// 			isLike: isLike
		// 		})
		// 	}
		// 	that.getAvatarList(articleId)
		// 	that.getArticleInfo(articleId)
		// })
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
		that.randlikeList(articleId)
		that.getCommentsList(articleId)
	},

	getCommentsList: function (articleId) {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		db.collection('comments').where({
			articleId: articleId
		}).get().then(res => {
			console.log(res)
			let commentsList = res.data
			for (let i = 0; i < commentsList.length; i++) {
				let time = formatTime.diffTime(commentsList[i].commentTime)
				commentsList[i].commentTime = time
			}
			that.setData({
				commentsList: commentsList
			})
			wx.hideLoading()
		})
	},

	changeList: function (e) {
		console.log(e)
		const articleId = e.currentTarget.dataset.id
		const that = this
		that.randlikeList(articleId)
	},

	// 随机相似文章
	randlikeList: function (articleId) {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		wx.cloud.callFunction({
			name: 'randArticle',
			data: {
				articleId: articleId
			}
		}).then(res => {
			console.log(res)
			let articles = res.result
			let length = articles.length
			// 随机文章数
			let randNum = Math.floor(Math.random() * 3 + 3)
			let likeInfo = []
			let nums = []
			for (let i = 0; i < randNum; i++) {
				// 随机数字不能相同
				let num = Math.floor(Math.random() * length)
				if (nums.indexOf(num) === -1) {
					likeInfo.push(articles[num].info)
					nums.push(num)
				} else {
					i--
				}
			}
			console.log(nums)
			that.setData({
				likeInfo: likeInfo
			})
			console.log(likeInfo)
			wx.hideLoading()
		})
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