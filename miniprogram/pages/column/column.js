// miniprogram/pages/column/column.js
const app = getApp()
const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// page: 0,
		kindList: [],
		isLogin: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const that = this
		// let userInfo = app.globalData.userInfo
		let userInfo = wx.getStorageSync('userinfoLogs') || []
		if (userInfo.length === 1) {
			const userId = userInfo[0]._id
			console.log(userId)
			wx.cloud.callFunction({
				name: 'addOrder',
				data: {
					userId: userId
				}
			}).then(res => {
				console.log(res)
				that.getList()
			})
		} else {
			that.noLoginList()
		}

	},

	noLoginList: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		db.collection('kind').get().then(res => {
			let list = res.data
			that.setData({
				kindList: list
			})
			wx.hideLoading()
		})
	},

	getList: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		db.collection('kind').get().then(kindRes => {
			// console.log(res)
			// const userId = app.globalData.userInfo[0]._id
			let userInfo = wx.getStorageSync('userinfoLogs') || []
			let userId = userInfo[0]._id
			db.collection('order').where({
				userId: userId
			}).get().then(res => {
				let list = kindRes.data
				let orderlist = res.data[0].orderList
				// console.log(list, orderlist)
				for (let i = 0; i < orderlist.length; i++) {
					// console.log(orderlist[i].isOrder, list[i])
					list[i].isOrder = orderlist[i].isOrder
				}
				console.log(list)
				that.setData({
					kindList: list,
					isLogin: true
				})
				wx.hideLoading()
			})
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
	onShow: async function () {
		// this.onLoad()
		// const that = this
		// let userInfo = await app.globalData.userInfo
		// // console.log(userInfo._id)
		// const userId = userInfo._id
		// console.log(userId)
		// if (userInfo) {
		// 	// const userId = userInfo.id
		// 	// console.log(userId)
		// 	wx.cloud.callFunction({
		// 		name: 'addOrder',
		// 		data: {
		// 			userId: userId
		// 		}
		// 	}).then(res => {
		// 		console.log(res)
		// 		that.getList()
		// 	})
		// } else {
		// 	that.noLoginList()
		// }
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})