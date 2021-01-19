// miniprogram/pages/admin/newArticle/newArticle.js
const db = wx.cloud.database();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		title: '',
		desc: '',
		cover: '',
		kind: '',
		kindList: [],
		preContent: false,
		content: '',
		coverUrl: '',
		isPublish: 0 // 是否发布，发布为1
	},

	// 标题输入
	titleInput: function (e) {
		// console.log(e)
		const that = this
		that.data.title = e.detail.value
	},

	// 描述输入
	descInput: function (e) {
		const that = this
		that.data.desc = e.detail.value
	},

	// 选择封面图
	chooseImg: function () {
		const that = this
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album'],
			success: function (res) {
				console.log(res)
				let tempFilePaths = res.tempFilePaths[0];
				that.setData({
					cover: tempFilePaths
				})
			}
		})
	},

	// 预览图片
	previewImg: function (e) {
		console.log(e)
		// console.log(e.currentTarget.dataset.img)
		const url = e.currentTarget.dataset.img
		wx.previewImage({
			urls: url.split(',')
		})
	},

	// 获取剪切板内容
	parse: function () {
		const that = this
		wx.getClipboardData({
			success: res => {
				console.log(res)
				that.setData({
					content: that.data.content + res.data
				})
			}
		})
	},

	// 内容输入
	contentInput: function (e) {
		console.log(e)
		const that = this
		that.setData({
			content: e.detail.value
		})
	},

	check: function (e) {
		// console.log(e)
		// console.log(e.currentTarget.dataset.target)
		const that = this
		let targetNum = e.currentTarget.dataset.target === 'save' ? '0' : '1'
		that.setData({
			isPublish: targetNum
		})
		if (that.data.title.trim() === '') {// 判断标题是否为空
			wx.showToast({
				title: '标题不能为空'
			})
		} else if (that.data.desc.trim() === '') { // 判断描述是否为空
			wx.showToast({
				title: '描述不能为空'
			})
		} else if (that.data.cover === '') { // 判断封面图是否为空
			wx.showToast({
				title: '请选择封面图'
			})
		} else if (that.data.content === '') { // 判断内容是否为空
			wx.showToast({
				title: '内容不能为空'
			})
		} else {
			console.log(targetNum)
			// 上传封面图到云存储中
			that.upload()
		}
	},

	upload: function () {
		// console.log(e)
		const that = this
		wx.showLoading({
			title: '保存中...'
		})
		wx.cloud.uploadFile({
			cloudPath: 'cover' + (new Date().getTime()) + '.png',
			filePath: that.data.cover,
			success: res => {
				console.log(res)
				that.setData({
					coverUrl: res.fileID
				})
				that.addDb();
			}
		})
	},

	addDb: function () {
		const that = this
		db.collection('articles').add({
			data: {
				title: that.data.title,
				desc: that.data.desc,
				content: that.data.content,
				kind: that.data.kind,
				cover: that.data.coverUrl,
				isPublish: that.data.isPublish,
				createTime: new Date(),
				updatedTime: new Date(),
				comments: 0, // 评论数
				views: 0, // 查看数
				likes: 0 // 点赞数
			},
			success: res => {
				console.log(res)
				const article_id = res._id
				wx.hideLoading()
				wx.showModal({
					title: '保存成功',
					content: '是否跳转到详情页',
					success: saveRes => {
						if (saveRes.confirm && that.data.isPublish === '1') {
							wx.navigateTo({
								url: `/pages/details/publish/publish?scene${article_id}`
							})
						} else if (saveRes.confirm && that.data.isPublish === '0') {
							wx.navigateTo({
								url: `/pages/details/draft/draft?scene${article_id}`
							})
						} else if ((saveRes.cancel && that.data.isPublish === '1') || (saveRes.cancel && that.data.isPublish === '0')) {
							wx.navigateTo({
								url: `/pages/admin/home/home`
							})
						}
					}
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '写文章',
			success: function (res) {
				// success
			}
		})

		this.getKind()
	},

	// 获取类别
	getKind: function () {
		const that = this
		db.collection('kind').get().then(res => {
			console.log(res)
			that.setData({
				kindList: res.data,
				kind: res.data[0].kindName
			})
		})
	},

	// 选择类别
	kindChange: function (e) {
		console.log(e)
		const that = this
		that.setData({
			kind: that.data.kindList[e.detail.value].kindName
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