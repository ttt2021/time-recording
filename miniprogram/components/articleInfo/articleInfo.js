// miniprogram/components/articleInfo/articleInfo.js
// const app = getApp()
// const db = wx.cloud.database()
const tool = require("../../utils/tool.js");

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		articleList: {
			type: Array,
			value: [],
			observer: function (newVal) {
				console.log(newVal)
			}
		},
		isAdmin: {
			type: Boolean,
			value: false,
			observer: function (newVal) {
				console.log(newVal)
			}
		},
		title: {
			type: String,
			value: '',
			observer: function (newVal) {
				console.log(newVal)
			}
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},


	/**
	 * 组件的方法列表
	 */
	methods: {
		publish: tool.throttle(function (e) {
			// console.log(e[0].target.dataset.publish)
			const that = this
			let articleInfo = e[0].target.dataset.publish
			articleInfo.isPublish = articleInfo.isPublish === '未发表' ? '1' : '0'
			console.log(articleInfo)
			wx.cloud.callFunction({
				name: 'updatedArticle',
				data: {
					articleInfo: articleInfo
				},
				complete: res => {
					console.log(res)
					const detail = that.data.title || ''
					that.triggerEvent('updatePublish', detail)
				}
			})
		}),
		goDetail: tool.throttle(function (e) {
			console.log(e)
			const that = this
			let articleInfo = e[0].currentTarget.dataset.info
			let articleId = articleInfo._id
			console.log(articleId)
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
						articleId: articleId,
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
				wx.navigateTo({
					url: `/pages/details/publish/publish?id=${articleId}`
				})
			})
		}, 3000)
	}
})