// miniprogram/pages/admin/home/home.js
import homeItems from '../../../api/homeMenu'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		listItems: homeItems,
		arrowSrc: '../../../images/arrow-right.jpg'
	},

	go: function (e) {
		console.log(e)
		let pageTo = e.currentTarget.dataset.to
		// let url = `/pages/admin/${pageTo}/${pageTo}`
		// console.log(pageTo, url)
		wx.navigateTo({
			url: `/pages/admin/${pageTo}/${pageTo}`
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log(this.data.listItems)
		wx.setNavigationBarTitle({
			title: '后台管理系统',
			success: function (res) {
				// success
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