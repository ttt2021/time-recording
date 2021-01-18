// miniprogram/pages/user/idea/idea.js
import category from '../../../api/category'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		itemLeftToTop: '', // 滚动的高度
		list: category,
		tabCur: 0, // 当前项
		rightCur: 0 // 用于实现左边联动右边
	},

	// 切换左右联动
	tabNav(e) {
		console.log(e)
		const self = this
		let index = e.currentTarget.dataset.index
		self.setData({
			tabCur: index,
			rightCur: index,
			itemLeftToTop: (index - 4) * 50 // 实现左边自动滑动到某个位置
		})
	},

	// 滑动时右边对应左边的菜单栏切换
	// 拿到该栏目的高度，设置它的 top 和 buttom 的值
	// 判断滑动的距离是否大于设置的 top 但小于设定的 buttom 值，然后对应上左边的菜单的滑动
	scrollList (e) {
		console.log(e)
		const self = this
		let list = self.data.list
		let itemHeight = 0
		for (let i = 0; i < list.length; i++) {
			// 获取到每一个栏目
			let item = wx.createSelectorQuery().select("#scroll-" + i)
			item.fields({
				size: true
			}, function (res) {
				list[i].top = itemHeight
				itemHeight += res.height
				list[i].buttom = itemHeight
			}).exec()
		} 

		// console.log(list)
		self.setData({
			list
		})

		// 拿到滚动的高度
		let scrollTop = e.detail.scrollTop
		for (let i = 0; i < list.length; i++) {
			if (scrollTop > list[i].top && scrollTop < list[i].buttom) {
				self.setData({
					tabCur: i,
					scrollTop: (i - 4) * 50
				})
				return false
			}
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '大前端技能栈',
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