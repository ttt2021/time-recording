// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	const checkOrder = await db.collection('order').where({
		userId: event.userId
	}).get()
	if (checkOrder.data.length > 0) {
		const kindId = event.kind._id
		const orderInfo = checkOrder.data[0].orderList
		for (let i = 0; i < orderInfo.length; i++) {
			if (orderInfo[i].kindId === kindId) {
				orderInfo[i].isOrder = !orderInfo[i].isOrder
				break
			}
		}
		const updatedOrder = await db.collection('order').where({
			userId: event.userId
		}).update({
			data: {
				orderList: orderInfo
			}
		})
	} else {
		const kindlist = await db.collection('kind').get()
		const list = kindlist.data
		let kindOrder = []
		for (let i = 0; i < list.length; i++) {
			let kindId = list[i]._id
			kindOrder.push({
				kindId: kindId,
				isOrder: false,
				createTime: new Date()
			})
		}
		const insertOrder = await db.collection('order').add({
			data: {
				userId: event.userId,
				orderList: kindOrder
			}
		})
	}
}