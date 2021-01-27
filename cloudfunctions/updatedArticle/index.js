// 云函数入口文件
const cloud = require('wx-server-sdk')
const env = 'ttt-fzsgn'

cloud.init()
const db = cloud.database({ env })

// 云函数入口函数
exports.main = async (event, context) => {
	const articleInfo = event.articleInfo
	const updatedResult = await db.collection('articles').doc(articleInfo._id).update({
		data: {
			content: articleInfo.content,
			cover: articleInfo.cover,
			desc: articleInfo.desc,
			isPublish: articleInfo.isPublish,
			kind: articleInfo.kind,
			title: articleInfo.title,
			updatedTime: articleInfo.updatedTime
		}
	})
	return updatedResult
}