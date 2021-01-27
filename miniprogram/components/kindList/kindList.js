// miniprogram/components/kindList/kindList.js
const app = getApp()
const db = wx.cloud.database()
const tool = require("../../utils/tool.js");

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		kindList: {
			type: Array,
			value: []
			// observer: function (newVal) {
			// 	console.log(newVal)
			// }
		},
		isLogin: {
			type: Boolean,
			value: false,
			observer: function (newVal) {
				console.log(newVal)
			}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		orderList: []
	},
	

	/**
	 * 组件的方法列表
	 */
	methods: {
		order: tool.throttle(function (e) {
			const that = this
			// console.log(e)
			const kind = e[0].currentTarget.dataset.kind
			// console.log(kind, app.globalData.userInfo[0]._id)
			let userInfo = wx.getStorageSync('userinfoLogs') || []
			let userId = userInfo[0]._id
			wx.cloud.callFunction({
				name: 'order',
				data: {
					kind: kind,
					userId: userId
				}
			}).then(res => {
				that.getData()
			})
		}),
		getData () {
			const that = this
			// const userId = app.globalData.userInfo[0]._id
			// console.log(userId)
			let userInfo = wx.getStorageSync('userinfoLogs') || []
			let userId = userInfo[0]._id
			db.collection('order').where({
				userId: userId
			}).get().then(res => {
				// console.log(res.data[0].orderList, that.data.kindList)
				let list = that.data.kindList
				let orderlist = res.data[0].orderList
				for (let i = 0; i < orderlist.length; i++) {
					// console.log(orderlist[i].isOrder, list[i])
					list[i].isOrder = orderlist[i].isOrder
				}
				that.setData({
					kindList: list
				})
			})
		},
		login: tool.throttle(function () {
			wx.showToast({
				title: '请先登录'
			})
			wx.reLaunch({
				url: '/pages/me/me'
			})
		}),
		go: tool.throttle(function (e) {
			console.log(e)
			let title = e[0].currentTarget.dataset.title
			wx.navigateTo({
				url: `/pages/details/kind/kind?detail=${title}`
			})
		})
	}
})