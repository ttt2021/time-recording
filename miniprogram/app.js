//app.js
App({
  onLaunch: function () {
    const self = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'ttt-fzsgn',
        traceUser: true,
      })
    }

    // 调用API从本地缓存中获取数据，并将其挂载到全局上
    let userinfoLogs = wx.getStorageSync('userinfoLogs') || []
    self.globalData.userInfo = userinfoLogs

    wx.getSystemInfo({ // 获取系统信息
      success: e => {
        // console.log(e)
        // this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect(); // 获取菜单按钮（右上角胶囊按钮）的布局位置信息
        // self.globalData.Custom = custom;
        // self.globalData.Width =e. screenWidth;
        // self.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    // 查看是否授权登录
    // wx.getSetting({
    //   success(settingRes) {
    //     // console.log(settingRes);
    //     // 应经授权
    //     if (settingRes.authSetting['scope.userInfo']) {
    //       wx.getUserInfo({ // 获取用户信息
    //         success(infoRes) {
    //           console.log(infoRes);
    //           self.globalData.userInfo = infoRes.userInfo
    //           // 调用云函数
    //           wx.cloud.callFunction({
    //             name: 'userInfo',
    //             data: {
    //               avatarUrl: infoRes.userInfo.avatarUrl,
    //               name: '',
    //               nickName: infoRes.userInfo.nickName,
    //               sex: infoRes.userInfo.gender
    //             }
    //           })
    //         }
    //       })
    //     } else {
    //       wx.redirectTo({
    //         url: `pages/me/me?back=${options.path.split('/')[1]}`
    //       })
    //     }
    //   }
    // })

    // let userinfoLogs = wx.getStorageSync('userinfoLogs') || []

  },

  globalData: {
    userInfo: null
  }
})
