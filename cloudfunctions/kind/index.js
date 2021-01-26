// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	// 将即将删除的类别的文章转成其他类别的文章
	const otherKind = await db.collection('articles').where({
		kind: event.kind.title
	}).update({
		data: {
			kind: '其他'
		}
	})
	// 将订阅中的该类别信息删除
	const deleteOrder = await db.collection('order').get()
	const kindId = event.kind._id
	const list = deleteOrder.data
	// const orderlist = deleteOrder.data[0].orderList
	for (let i = 0; i < list.length; i++) {
		const orderlist = list[i].orderList
		const orderId = list[i]._id
		for (let j = 0; j < orderlist.length; j++) {
			const id = orderlist[j].kindId
			if (id === kindId) {
				orderlist.splice(j,1)
				db.collection('order').doc(orderId).update({
					data: {
						orderList: orderlist
					}
				})
 				break
			}
		}
	}
	
	const deleteKind = await db.collection('kind').doc(event.kind._id).remove()
}