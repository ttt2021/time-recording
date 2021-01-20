// miniprogram/pages/admin/people/people.js
const wxCharts = require("../../../utils/wxcharts.js");
let yuelineChart = null;
const db = wx.cloud.database();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// list,
		imageWidth: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const that = this
		// 获取用户列表
		that.getList()
	},

	getList: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		// 获取用户列表 限制返回数量为10条
		db.collection('usersinfo').where({}).limit(10).orderBy('createTime', 'openId').get({
			success: res => { // 获取成功
				console.log(res.data)
				that.setData({
					page: 0,
					["list[0]"]: res.data
				})
				wx.hideLoading()
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
		var windowWidth = 320;
		try {
		 var res = wx.getSystemInfoSync();
		 windowWidth = res.windowWidth;
		} catch (e) {
		 console.error('getSystemInfoSync failed!');
		}
		yuelineChart = new wxCharts({ //当月用电折线图配置
		 canvasId: 'yueEle',
		 type: 'line',
		 categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'], //categories X轴
		 animation: true,
		 series: [{
			name: 'A',
			data: [1, 6, 9, 1, 0, 2, 9, 2, 8, 6, 0, 9, 8, 0, 3, 7, 3, 9, 3, 8, 9, 5, 4, 1, 5, 8, 2, 4, 9, 8, 7],
			format: function (val, name) {
			 return val + '';
			}
		 }, {
			name: 'B',
			data: [0, 6, 2, 2, 7, 6, 2, 5, 8, 1, 8, 4, 0, 9, 7, 2, 5, 2, 8, 2, 5, 2, 9, 4, 4, 9, 8, 5, 5, 5, 6],
			format: function (val, name) {
			 return val + '';
			}
		 },
		 ],
		 xAxis: {
			disableGrid: true
		 },
		 yAxis: {
			title: '数值',
			format: function (val) {
			 return val;
			},
			/*max: 20,*/
			min: 0
		 },
		 width: windowWidth - 50,
		 height: 200,
		 dataLabel: true,
		 dataPointShape: true,
		 extra: {
			lineStyle: 'curve'
		 }
		});
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