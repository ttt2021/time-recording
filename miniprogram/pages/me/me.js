// miniprogram/pages/me/me.js
const app = getApp();
import meMenu from '../../api/meMenu'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {}, // 用户信息
		// openid: '',
		isLoginPopup: true, // 遮罩层是否显示
		isLogin: false, // 是否登录
		isDisabled: false, // 按钮是否禁用
		menuItems: meMenu,
		arrowSrc: '../../images/arrow-right.jpg'
	},

	closeLoginPopup() {
		this.setData({
			isLoginPopup: false
		});
	},

	// 获取用户信息
	getUserInfo: function (e) {
		const self = this
		// let authFlag = 0
		console.log(e, self)

		if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
			wx.showToast({
				title: '登录失败',
				icon: 'error',
				duration: 2000
			})
		}

		// 调用云函数，判断是否存在该用户
		// 若存在，则更新用户信息，若不存在，则添加用户信息
		wx.cloud.callFunction({
			name: 'userinfo',
			data: {
				avatarUrl: e.detail.userInfo.avatarUrl,
				name: '',
				nickName: e.detail.userInfo.nickName,
				sex: e.detail.userInfo.gender,
				visitCounts: 1,
				dayVisitList: [new Date()] // 存储所有的登录记录
			}
		}).then(res => {
			console.log(res)
			// console.log(res.result.userinfos.data[0])
			const userinfos = res.result.userinfos.data[0]
			if (res.errMsg === 'cloud.callFunction:ok') { // 云函数调用成功
				self.setData({
					isLogin: true,
					userInfo: userinfos,
					isDisabled: true
				})
				// 若登录成功则将用户信息挂载到app.globalData上
				app.globalData.userInfo = userinfos
				// 用户信息存储到本地存储
				wx.setStorageSync('userinfoLogs', [userinfos])
				self.closeLoginPopup()	
				wx.showToast({
					title: '登录成功',
					icon: 'success',
					duration: 500
				})
			}
		})

	},

	showLogin: function () {
		// console.log(this.data.isLoginPopup)
		this.setData({
			isLoginPopup: true
		})
	},

	//切换页面
	go: function (e) {
		var e = e.currentTarget.dataset.to;
		wx.navigateTo({
			url: e,
		})
	},

	// 赞赏作者
	likeImg: function () {
		let rewordImg = 'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3eab93d695f46dca799fea1ad631260~tplv-k3u1fbpfcp-watermark.image'
		wx.previewImage({
			urls: rewordImg.split(",")
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// console.log("2021-01-15T12:32:50.406Z".split('T')[0])
		// //转成毫秒数
		// const start_date = Date.parse("2021-01-15T12:32:50.406Z");
		// const end_date = Date.parse(new Date()) // 返回该日期与 1970 年 1 月 1 日午夜之间相差的毫秒数
		// // 两个日期相减，转换成天数
		// let days = parseInt((end_date - start_date) / (1000 * 60 * 60 *24))
		// if (days < 0)
		// 	days = Math.abs(days) + 1
		// console.log("day = ",start_date, end_date, new Date(), days);
		console.log(this.data.menuItems)
		wx.setNavigationBarTitle({
			title: '我的个人中心',
			success: function (res) {
				// success
			}
		})

		const self = this

		// 从本地存储中获取数据
		let userinfoLogs = wx.getStorageSync('userinfoLogs') || []

		// 从全局上获取本地存储挂载的数据
		// console.log(app)
		// let userinfoLogs = app.globalData.userInfo
		// console.log(userinfoLogs)
		if (userinfoLogs.length === 0) { // 若本地无存储
			self.setData({
				userInfo: {
					avatarUrl: '../../images/gravatar.jpg',
					nickName: '登录'
				}
			})
		} else { // 本地已存储

			self.setData({
				userInfo: {
					avatarUrl: userinfoLogs[0].avatarUrl,
					nickName: userinfoLogs[0].nickName
				},
				isDisabled: true,
				isLoginPopup: false,
				isLogin: true
			})

			// console.log(userinfoLogs[0]._id);
			// 查询数据库信息
			// db.collection('usersinfo').doc(userinfoLogs[0]._id).get().then(res => {
			// 	console.log(res)
			// })

			// 更新数据库最新登录信息
			wx.cloud.callFunction({
				name: 'userinfo',
				data: {
					avatarUrl: userinfoLogs[0].avatarUrl,
					nickName: userinfoLogs[0].nickName,
					sex: userinfoLogs[0].sex,
					name: userinfoLogs[0].name,
					openId: userinfoLogs[0].openId,
					visitCounts: userinfoLogs[0].visitCounts,
					dayVisitList: userinfoLogs[0].dayVisitList,
					createTime: userinfoLogs[0].createTime,
					latestLogin: userinfoLogs[0].latestLogin,
					isAdmin: userinfoLogs[0].isAdmin
				}
			}).then(res => {
				console.log(res)
				const userinfos = res.result.userinfos.data[0]
				if (res.errMsg === 'cloud.callFunction:ok') { // 云函数调用成功
					// 若登录成功则将用户信息挂载到app.globalData上
					app.globalData.userInfo = userinfos
					// 用户信息存储到本地存储
					wx.setStorageSync('userinfoLogs', [userinfos])
				}
			})
		}

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