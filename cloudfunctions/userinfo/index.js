// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	const userInfo = event.userInfo
	let userinfos = {}

	// 先查看usersInfo库里面有没有这个openId
	const checkUser = await db.collection('usersinfo').where({
		openId: userInfo.openId
	}).get()

	// 已经存在该用户,更新用户信息
	if (checkUser.data.length > 0) {
		const updatedResult = await db.collection('usersinfo').doc(checkUser.data[0]._id).update({
			data: {
				avatarUrl: event.avatarUrl,
				nickName: event.nickName,
				sex: event.sex,
				latestLogin: new Date()
			}
		})
		// 获取修改后的信息
		userinfos = await db.collection('usersinfo').where({
			openId: userInfo.openId
		}).get()
	} else {
		const insertResult = await db.collection('usersinfo').add({
			data: {
				avatarUrl: event.avatarUrl,
				nickName: event.nickName,
				sex: event.sex,
				name: '',
				openId: event.userInfo.openId,
				createTime: new Date(),
				latestLogin: new Date(),
				isAdmin: false
			}
		})
		// 获取插入后的信息
		userinfos = await db.collection('usersinfo').where({
			_id: insertResult._id
		}).get()
	}

	return {
		userinfos
	}

}