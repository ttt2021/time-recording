// miniprogram/pages/admin/people/people.js
const formatTime = require("../../../utils/formatTime.js");
const Charts = require("../../../utils/wxcharts.js");
let newpeopleChart = null;
let visitChart = null;
const db = wx.cloud.database();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [[]],
		imageWidth: 0,
		page: 0,
		noMore: false,
		totalPeople: 0,
		dayPeople: 0,
		totalVisits: 0,
		dayAvgVisits: 0,
		todaynewPeople: 0,
		todayVisits: 0,
		currentMonth: '',
		peopleList: [],
		curMonthVisits: [],
		curMonthDays: [],
		daynewpeople: [],
		newpeopleMonth: '',
		visitMonth: '',
		visitMonthDays: [],
		dayvisitsList: [],
		newpeopleList: [],
		newpeopleMonthDays: [],
	},

	getTotal: function () {
		const that = this
		const peopleList = that.data.peopleList
		// console.log(peopleList)
		const days = formatTime.diffDays()
		// 获取当前日期
		let todayDate = new Date()
		todayDate = formatTime.dayDate(todayDate)
		let currentMonth = that.data.currentMonth // 当前月份
		// 计算每月的天数
		let daysOfMonth = formatTime.getDaysOfMonth(currentMonth)
		// 当月每一天访问的次数
		let dayvisitList = (new Array(daysOfMonth)).fill(0)
		// 当月每天新用户
		let daynewpeople = (new Array(daysOfMonth)).fill(0)
		// console.log(dayvisitList)
		// console.log(daysOfMonth)
		// console.log(peopleList, currentMonth)
		// console.log(todayDate)
		// 获取用户总统计
		// 用户总人数
		const totalPeople = peopleList.length
		// 获取天数
		const dayPeople = Math.floor(totalPeople / days)

		let totalVisits = 0, todaynewPeople = 0, todayVisits = 0
		for (let i = 0; i < totalPeople; i++) {
			// 单个用户访问的总数
			let length = peopleList[i].dayVisitList.length
			// 访问总次数
			totalVisits += length
			// 今日新用户人数
			let createtime = peopleList[i].createTime
			let isnew = formatTime.dayDate(createtime)
			// console.log(isnew)
			if (isnew === todayDate) {
				todaynewPeople++
			}
			// 加入时的月份
			let joinMonth = formatTime.currentMonths(createtime)
			// console.log(joinMonth)
			if (currentMonth === joinMonth) {
				let createIndex = createtime.getDate() - 1
				daynewpeople[createIndex]++
			}
			// console.log(daynewpeople)
			// 今日访问次数
			for (let j = 0; j < length; j++) {
				const visitTime = peopleList[i].dayVisitList[j]
				// console.log(visitTime)
				let isVisit = formatTime.dayDate(visitTime)
				// console.log(isVisit, todayDate)
				if (isVisit === todayDate) {
					todayVisits++
				}
				let visitMonth = formatTime.currentMonths(visitTime) // 访问时间
				// console.log(visitMonth, currentMonth)
				if (visitMonth === currentMonth) {
					let index = visitTime.getDate() - 1
					dayvisitList[index]++
				}
			}
		}
		// console.log(dayvisitList)
		let curMonthDays = []
		for (let k = 0; k < daysOfMonth; k++) {
			curMonthDays[k] = k + 1
		}
		// 日均访问次数
		const dayAvgVisits = Math.floor(totalVisits / days)
		that.setData({
			totalPeople,
			dayPeople,
			totalVisits,
			dayAvgVisits,
			todaynewPeople,
			todayVisits,
			curMonthVisits: dayvisitList,
			curMonthDays,
			daynewpeople,
			newpeopleMonthDays: curMonthDays,
			visitMonthDays: curMonthDays,
			dayvisitsList: dayvisitList,
			newpeopleList: daynewpeople
		})
	},

	changeData: function (month, flag) {
		const that = this
		const peopleList = that.data.peopleList

		// 计算每月的天数
		let daysOfMonth = formatTime.getDaysOfMonth(month)
		const totalPeople = peopleList.length
		let lists = (new Array(daysOfMonth)).fill(0)
		let curMonthDays = []
		for (let k = 0; k < daysOfMonth; k++) {
			curMonthDays[k] = k + 1
		}

		if (flag === 'visits') {
			// 当月每一天访问的次数
			for (let i = 0; i < totalPeople; i++) {
				// 单个用户访问的总数
				let length = peopleList[i].dayVisitList.length
				for (let j = 0; j < length; j++) {
					const visitTime = peopleList[i].dayVisitList[j]
					let visitMonth = formatTime.currentMonths(visitTime) // 访问时间
					if (visitMonth === month) {
						let index = visitTime.getDate() - 1
						lists[index]++
					}
				}
			}
			// console.log(lists)
			that.setData({
				dayvisitsList: lists,
				visitMonthDays: curMonthDays
			})
		} else {
			for (let i = 0; i < totalPeople; i++) {
				let createtime = peopleList[i].createTime
				// 加入时的月份
				let joinMonth = formatTime.currentMonths(createtime)
				if (month === joinMonth) {
					let createIndex = createtime.getDate() - 1
					lists[createIndex]++
				}
			}
			that.setData({
				newpeopleList: lists,
				newpeopleMonthDays: curMonthDays
			})
		}
	},

	// 前一个月
	preMonth: function (e) {
		// console.log(e)
		const target = e.currentTarget.dataset.to
		// console.log(target)
		const that = this
		let showMonth = target === 'visits' ? that.data.visitMonth : that.data.newpeopleMonth
		showMonth = formatTime.prevMonths(showMonth, -1)
		if (target === 'visits') {
			that.setData({
				visitMonth: showMonth
			})
			that.changeData(showMonth, target)
			that.getVisitCanvas()
		} else {
			that.setData({
				newpeopleMonth: showMonth
			})
			that.changeData(showMonth, target)
			that.getNewpeopleCanvas()
		}
	},

	// 后一个月
	nextMonth: function (e) {
		// console.log(e)
		const target = e.currentTarget.dataset.to
		// console.log(target)
		const that = this
		let showMonth = target === 'visits' ? that.data.visitMonth : that.data.newpeopleMonth
		showMonth = formatTime.prevMonths(showMonth, 1)
		if (target === 'visits') {
			that.setData({
				visitMonth: showMonth
			})
			that.changeData(showMonth, target)
			that.getVisitCanvas()
		} else {
			that.setData({
				newpeopleMonth: showMonth
			})
			that.changeData(showMonth, target)
			that.getNewpeopleCanvas()
		}
	},

	go: function (e) {
		// console.log(e)
		const target = e.currentTarget.dataset.to
		wx.navigateTo({
			url: `/pages/admin/distribution/${target}/${target}`
		})
	},

	getVisitCanvas: function () {
		let windowWidth = 320;
		try {
			let res = wx.getSystemInfoSync(); // 获取屏幕宽高
			windowWidth = res.windowWidth; // 宽度
		} catch (e) {
			console.error('getSystemInfoSync failed!');
		}
		// 月度访问次数分布
		const that = this
		visitChart = new Charts({
			canvasId: 'MonthVisits',
			type: 'line',
			animation: true, //是否开启动画
			categories: that.data.visitMonthDays, //categories X轴
			series: [
				{
					name: '日',
					data: that.data.dayvisitsList,
					format: function (val) {
						return val
					}
				}
			],
			xAxis: {
				disableGrid: true
			},
			yAxis: {
				title: '日访问总次数',
				format: function (val) {
					return val;
				},
				min: 0
			},
			width: windowWidth - 50, // 图表展示内容宽度
			height: 200, // 图表展示内容高度
			dataLabel: false, // 是否在图表上显示数据
			dataPointShape: true, // 是否在图标上显示数据点标志
			extra: {
				lineStyle: 'curve' // 曲线
			}
		})
	},

	getNewpeopleCanvas: function () {
		let windowWidth = 320;
		try {
			let res = wx.getSystemInfoSync(); // 获取屏幕宽高
			windowWidth = res.windowWidth; // 宽度
		} catch (e) {
			console.error('getSystemInfoSync failed!');
		}
		const that = this
		newpeopleChart = new Charts({
			canvasId: 'dayNewpeople',
			type: 'line',
			animation: true, //是否开启动画
			categories: that.data.newpeopleMonthDays, //categories X轴
			series: [
				{
					name: '日',
					data: that.data.newpeopleList,
					format: function (val) {
						return val
					}
				}
			],
			xAxis: {
				disableGrid: true
			},
			yAxis: {
				title: '日新用户人数',
				format: function (val) {
					return val;
				},
				min: 0
			},
			width: windowWidth - 50, // 图表展示内容宽度
			height: 200, // 图表展示内容高度
			dataLabel: false, // 是否在图表上显示数据
			dataPointShape: true, // 是否在图标上显示数据点标志
			extra: {
				lineStyle: 'curve' // 曲线
			}
		})
	},

	touchHandler: function (e) {
		// console.log(e)
		const touch = e.currentTarget.dataset.touch
		if (touch === 'visits') {
			visitChart.showToolTip(e, {
				format: function (item, category) {
					// console.log(item)
					return `${category} ${item.name} : ${item.data}`
				}
			})
		} else {
			newpeopleChart.showToolTip(e, {
				format: function (item, category) {
					// console.log(item)
					return `${category} ${item.name} : ${item.data}`
				}
			})
		}
	},

	setAdmin: function (e) {
		const that = this
		console.log(e)
		const isAdmin = e.currentTarget.dataset.set
		const id = e.currentTarget.dataset.id
		wx.cloud.callFunction({
			name: 'admin',
			data: {
				_id: id,
				isAdmin: isAdmin
			},
			complete: updatedRes => {
				that.getList()
				wx.showToast({
					title: '操作成功',
					icon: 'success'
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const that = this
		
		that.getData()
	},

	getData: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})

		// 获取当前月份
		let currentMonth = new Date()
		currentMonth = formatTime.currentMonths(currentMonth)
		// console.log(currentMonth)
		that.setData({
			currentMonth,
			visitMonth: currentMonth,
			newpeopleMonth: currentMonth
		})

		// 获取所有用户信息列表
		db.collection('usersinfo').get({
			success: res => {
				// console.log(res.data)
				that.setData({
					peopleList: res.data
				})

				// 获取用户总统计
				that.getTotal()
				// console.log(that.data)
				that.getVisitCanvas()
				that.getNewpeopleCanvas()
			}
		})

		wx.hideLoading()

		// 获取用户列表
		that.getList()
	},

	getList: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		// 获取用户列表 限制返回数量为10条
		db.collection('usersinfo').where({}).limit(10).orderBy('createTime', 'desc').orderBy('openId', 'asc').get({
			success: res => { // 获取成功
				// console.log(res.data)
				let result = res.data
				for (let i = 0; i < result.length; i++) {
					// console.log(result[i].createTime)
					if (result[i].sex === 0) {
						result[i].sex = '女'
					} else {
						result[i].sex = '男'
					}
					result[i].createTime = formatTime.datetime(result[i].createTime)
					result[i].latestLogin = formatTime.datetime(result[i].latestLogin)
				}
				console.log(result)
				that.setData({
					page: 0,
					["list[0]"]: result
				})
				wx.hideLoading()
			}
		})
		// console.log(that.data.list)
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

	onRefresh: function () {
		const that = this
		wx.showNavigationBarLoading()
		wx.showLoading({
			title: '刷新中...'
		})
		that.getData()
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
		const that = this
		that.loadingMore()
	},

	loadingMore: function () {
		const that = this
		wx.showLoading({
			title: '加载中...'
		})
		let page = that.data.page + 10
		// 跳过前面page条，从page+1条开始返回 限制返回10条数据
		db.collection('usersinfo').where({}).skip(page).limit(10).orderBy('createTime', 'desc').orderBy('openId', 'asc').get({
			success: res => {
				let result = res.data
				wx.hideLoading()
				if (res.data.length === 0) {
					that.setData({
						noMore: true
					})
					return
				}
				for (let i = 0; i < result.length; i++) {
					console.log(result[i].createTime)
					if (result[i].sex === 0) {
						result[i].sex = '女'
					} else {
						result[i].sex = '男'
					}
					result[i].createTime = formatTime.datetime(result[i].createTime)
					result[i].latestLogin = formatTime.datetime(result[i].latestLogin)
				}
				console.log(result)
				that.setData({
					page: page,
					["list[" + page + "]"]: res.data
				})
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})