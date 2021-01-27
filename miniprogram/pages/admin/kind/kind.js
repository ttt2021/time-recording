// miniprogram/pages/admin/kind/kind.js
const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		addModel: true,
		poster: '',
		title: '',
		desc: '',
		posterUrl: '',
		kindList: []
	},

	goList: function (e) {
		console.log(e)
		const url = e.currentTarget.dataset.detail
		wx.navigateTo({
			url: `/pages/details/kind/kind?detail=${url.title}&isAdmin=true` // 跳转到分类文章页面
		})
	},

	del: function (e) {
		const that = this
		const kind = e.currentTarget.dataset.kind
		const delArr = [kind.poster]
		// console.log(delArr)
		// console.log(id)
		wx.showLoading({
			title: '删除中...'
		})
		wx.cloud.deleteFile({
			fileList: delArr
		}).then(res => {
			console.log(res.fileList)
			wx.cloud.callFunction({
				name: 'kind',
				data: {
					kind: kind
				},
				complete: res => {
					console.log(res)
					that.getList()
					wx.hideLoading()
				}
			})
		})
	},

	titleInput: function (e) {
		this.data.title = e.detail.value
	},

	descInput: function (e) {
		this.data.desc = e.detail.value
	},

	showModal: function (e) {
		this.setData({
			addModel: false
		})
	},

	hideModal: function (e) {
		this.setData({
			addModel: true
		})
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
					poster: tempFilePaths
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

	add: function () {
		const that = this
		if (that.data.title === '') {
			wx.showToast({
				title: '标题不能为空'
			})
		} else if (that.data.desc === '') {
			wx.showToast({
				title: '描述不能为空'
			})
		} else if (that.data.poster === '') {
			wx.showToast({
				title: '封面图不能为空'
			})
		} else {
			that.upload()
		}
	},

	upload: function () {
		const that = this
		wx.showLoading({
			title: '保存中...'
		})
		wx.cloud.uploadFile({
			cloudPath: 'poster' + (new Date().getTime()),
			filePath: that.data.poster,
			success: res => {
				console.log(res)
				that.setData({
					posterUrl: res.fileID
				})
				that.addDb();
			}
		})
	},

	addDb: function () {
		const that = this
		db.collection('kind').add({
			data: {
				title: that.data.title,
				desc: that.data.desc,
				poster: that.data.posterUrl,
				createTime: new Date()
			},
			success: res => {
				// const title = that.data.title
				// console.log(res._id)
				// const _id = res._id // 分类id
				console.log(res)
				that.setData({
					addModel: true,
					title: '',
					desc: '',
					poster: '',
					posterUrl: ''
				})
				wx.hideLoading()
				that.getList()
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getList()
	},

	getList: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		db.collection('kind').get().then(res => {
			// console.log(res)
			that.setData({
				kindList: res.data
			})
			wx.hideLoading()
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