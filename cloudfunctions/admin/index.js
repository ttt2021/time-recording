// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	const adminSet = await db.collection('usersinfo').doc(event._id).update({
		data: {
			isAdmin: event.isAdmin
		}
	})
}