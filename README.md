# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)



# time-recording
时光录：一个记录时光过程中技术心得的小程序

- 模块
  1. 
  2. 
  3. 
  4. 我
    - 获取头像和昵称   open-data的type属性
    - 栏目
      4.1 热门排行 (面经的热门排行)
        2.2 最近浏览 (当前用户的浏览记录)
        2.3 我的收藏
        2.4 留言展板 
        2.5 智能聊天 (一个智能聊天机器人，可以讲笑话、聊天、算24点、看新闻、查天气)
        2.6 赞赏作者
        2.7 大前端技能栈
        2.8 意见反馈
        2.9 更新日志
        columnItems: [
      {
        Icon: '../../images/rank.png',
        name: '热门排行',
      },
      {
        Icon: '../../images/footer.png',
        name: '最近浏览',
      },
      {
        Icon: '../../images/collection.png',
        name: '我的收藏',
      },
      {
        Icon: '../../images/message.png',
        name: '留言展板',
      },
      {
        Icon: '../../images/idea.png',
        name: '大前端技能栈',
      },
      {
        Icon: '../../images/robot.png',
        name: '智能聊天',
      },
      {
        Icon: '../../images/reward.png',
        name: '赞赏作者',
      },
      {
        Icon: '../../images/feedback.png',
        name: '意见反馈',
      },
      {
        Icon: '../../images/journal.png',
        name: '更新日志',
      }
    ],