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
    - 获取头像和昵称   
      - 设置两个模板
        - login.wxml
          判断是否已登录
        - login-popup.wxml
          - 判断是否显示该模块
          - 若显示，则弹出遮罩层及获取用户信息的按钮
            1. button按钮绑定的事件获取用户信息，并调用云函数，查看是否存在该用户，若存在，则更新用户信息，若不存在，则添加用户信息
            2. 云函数调用成功，将是否登录的变量、用户信息、按钮是否禁用、遮罩层是否显示进行修改
            3. 将用户信息挂载到全局app.globalData上
          - 若不显示则为默认形式
      - 用户信息块
        - 若全局app.globalData上存在userInfo，则将用户信息显示出来
        - 若不存在，则放置一个按钮添加默认内容，按钮上绑定事件，用来修改遮罩层是否显示的值
    - 栏目
      4.1 热门排行 (面经的热门排行)
      4.2 最近浏览 (当前用户的浏览记录)
      4.3 我的收藏
      4.4 留言展板 
      4.5 智能聊天 (一个智能聊天机器人，可以讲笑话、聊天、算24点、看新闻、查天气)
      4.6 赞赏作者
      4.7 大前端技能栈
      4.8 意见反馈
      4.9 更新日志