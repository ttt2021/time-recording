// miniprogram/pages/me/me.js
const app = getApp();
const db = wx.cloud.database();
// const auth = require('../../utils/auth.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {}, // 用户信息
		// openid: '',
		isLoginPopup: true, // 遮罩层是否显示
		isLogin: false, // 是否登录
		isDisabled: false // 按钮是否禁用
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
				latestLogin: new Date()
			}
		}).then(res => {
			// console.log(res.result.userinfos.data[0])
			const userinfos = res.result.userinfos.data[0]
			if (res.errMsg === 'cloud.callFunction:ok') { // 云函数调用成功
				self.setData({
					isLogin: true,
					userInfo: userinfos,
					isDisabled: true
				})
				self.closeLoginPopup()
				// 若登录成功则将用户信息挂载到app.globalData上
				app.globalData.userInfo = userinfos
				// 用户信息存储到本地存储
				wx.setStorageSync('userinfoLogs', [userinfos])
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

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '我的个人中心',
			success: function (res) {
				// success
			}
		})

		const self = this

		// 从本地存储中获取数据
		let userinfoLogs = wx.getStorageSync('userinfoLogs')
		// console.log(userinfoLogs, userinfoLogs.length)
		if (userinfoLogs.length === 0) { // 若本地无存储
			self.setData({
				userInfo: {
					avatarUrl: '../../images/gravatar.png',
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
			// 更新数据库最新登录信息
			db.collection('usersinfo').doc(userinfoLogs[0]._id).update({
				data: {
					latestLogin: new Date()
				}
			}).then(res => {
				console.log(res)
			})
			// // 数据挂载全局
			// app.globalData.userInfo = userinfoLogs
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