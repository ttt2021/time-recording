// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	let replyList = []
	const getReplyInfo = await db.collection('replys').where({
		commentId: event.commentinfo._id
	}).get()
	let infos = getReplyInfo.data
	for (let i = 0; i < infos.length; i++) {
		const start = Date.parse(infos[i].commentTime)
		const end = Date.parse(new Date())
		let diffs = end - start
		let diff = 0
		if (diffs < 1000 * 60 * 60) {
			diff = Math.floor((end - start) / (1000 * 60))
			infos[i].commentTime = `${diff}分钟前`
		} else if (1000 * 60 * 60 <= diffs < 1000 * 60 * 60 * 24) {
			diff = Math.floor((end - start) / (1000 * 60 * 60))
			infos[i].commentTime = `${diff}小时前`
		} else {
			diff = Math.floor((end - start) / (1000 * 60 * 60 * 24))
			infos[i].commentTime = `${diff}天前`
		}
		replyList[i] = infos[i]
	}
	return replyList
}