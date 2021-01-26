// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })
// 云函数入口函数
exports.main = async (event, context) => {
	// 先查找分类
	const findKind = await db.collection('kind').get()
	// return findKind

	// 查找该用户订阅中的分类项
	const orderKind = await db.collection('order').where({
		userId: event.userId
	}).get()
	// return orderKind

	// 比较分类项是否相等
	const findLength = findKind.data.length
	const orderLength = orderKind.data[0].orderList.length
	if (findLength !== orderLength) {
		const kindId = findKind.data[findLength - 1]._id
		const orderlist = orderKind.data[0].orderList
		orderlist.push({
			createTime: new Date(),
			isOrder: false,
			kindId: kindId
		})
		return await db.collection('order').where({
			userId: event.userId
		}).update({
			data: {
				orderList: orderlist
			}
		})
	}
	
}