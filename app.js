//app.js
var which = 0

App({
  onLaunch: function (res) {
		var that = this

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        var that = this
        // 发送 res.code(登录凭证) 到后台换取
        // openId, sessionKey, unionId
        if (res.code) {
          // 向自己的服务器注册
          wx.request({
            url: 'https://www.cxingyu.cn:5002/api/login',
            data: {
              code: res.code,
            },
            success: function (res) {
              if (res.statusCode === 200) {
                if (res.data.success === '1') {
                  that.globalData.openid = res.data.data.openid
                  that.globalData.session_key = res.data.data.session_key
                  that.globalData.lover_avatar = res.data.data.lover_avatar
                  console.log('注册成功:' + that.globalData.openid)
                  if (that.globalData.lover_avatar === '') {
                    console.log('single dog')
                  }

                  which++
                  if (which === 2) {
                    if (that.userInfoReadyCallback) {
                      that.userInfoReadyCallback({
                        userInfo: that.globalData.userInfo,
                        openid: that.globalData.openid,
                      })
                    }
                  }
                } else {
                  wx.showToast({
                    title: '连接服务器失败:' + res.data.error_msg,
                    icon: 'none',
                    duration: 3000
                  })
                  console.log('连接失败！！')
                }
              }
            },
            fail: (err) => {
              console.log(err)
              wx.showToast({
                title: '连接服务器失败',
                icon: 'none',
                duration: 3000
              })
              console.log('连接失败！！！')
            }
          })
          
        } else {
          console.log('wx.login FAIL')
        }
      }
    })

    // 获取用户状态 (如授权)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // 这里写的很好!!!!!!!!!!!!!!!!!!!!!!!!!!
              which++
              if (which === 2) {
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback({
                    userInfo: res.userInfo,
                    openid: this.globalData.openid,
                  })
                }
              }
            },
            fail: () => {
              wx.showToast({
                title: 'getUsrInfo failed!',
                icon: 'none'
              })
            }
          })
        }
      }
    })
    
  },


  globalData: {
    userInfo: null,
    openid: null,
    lover_avatar: null,
    session_key: null,
  }
})

