// 获取应用实例
const app = getApp()
import util from '../../utils/util.js'
var bg_anim_id = 0
var events_cnt = 0

var from_id_t = ''

class Event {
  constructor(isme, time, content, degree) {
    this.id = events_cnt
    // console.log(this.id)
    this.isme = isme
    this.time = util.formatTime1(time)
    // this.time = time
    this.content = content
    this.degree = degree
    this.star_src = ['../../images/unstar.png', '../../images/unstar.png',
                '../../images/unstar.png', '../../images/unstar.png',
              '../../images/unstar.png']
    this.rendor_stars()
    events_cnt++
  }
  rendor_stars() {
    if (this.degree > 0) {
      for (let i = 0; i < this.degree; i++) {
        this.star_src[i] = '../../images/happy.png'
      }
    } else {
      for (let i = 0; i > this.degree; i--) {
        this.star_src[-i] = '../../images/angry.png'
      }
    }
  }
  show() {
    // console.log(this.usr +"!" + this.time+ "!" + this.content+ "!" + this .degree)
    console.log(this.isme)
  }
}

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    lover_avatar: '',
    events: [],
    bg_src: null,
    bg_desc: '',
    bg_anim: null,
    refresh_trigger: false,

  },

  onLoad: function (query) {
    from_id_t = query.from_id     // 这写的不太好，暂时只能用全局变量传参

    if (app.globalData.userInfo && app.globalData.openid) {
      this.setData({
        userInfo: app.globalData.userInfo,
        lover_avatar: app.globalData.lover_avatar,
      })
      console.log(this.data.userInfo)

      if (wx.getLaunchOptionsSync().scene === 1007) {
        // check whether this launching is to binding lovers
        // 1007: single chat page sharing
        this.pair_to_another(query.from_id)
      } else {
        util.upd_usr_info({
          userInfo: this.data.userInfo,
          openid: app.globalData.openid,
        })
        this.request_events()
      }
      this.rendor_background()

    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          lover_avatar: app.globalData.lover_avatar,
        })
        console.log(res.userInfo)
        if (wx.getLaunchOptionsSync().scene === 1007) {
          this.pair_to_another(query.from_id)
        } else {
          util.upd_usr_info({
            userInfo: this.data.userInfo,
            openid: app.globalData.openid,
          })
          this.request_events()
        }
        this.rendor_background()

      }
    } else {
      // 在没有 open-type = getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }

  },
  onShow() {
    this.start_bg_anim()
  },
  onHide() {
    clearInterval(bg_anim_id)
  },
  onUnload() {
    clearInterval(bg_anim_id)
  },


  request_events: function() {
    var that = this
    wx.request({
      url: 'https://www.cxingyu.cn:5002/api/get_events',
      data: {
        request_usr: 'of6CL5eJ9Rdv0iIPHAlxJakDw84Q',
        // request_usr: app.globalData.openid,
      },

      success: function(res) {
        if (res.statusCode === 200) {
          if (res.data.success === '1') {          
            var event_arr = []  
            for (let i = 0; i < res.data.data.length; i++) {
              var obj = new Event(res.data.data[i].commit_user === app.globalData.openid,
                res.data.data[i].commit_time, res.data.data[i].content,
                res.data.data[i].degree)
              // obj.show()
              event_arr.push(obj)
            }
            that.setData({
              events: event_arr
            })

          } else {
            wx.showToast({
              title: '请求失败:' + res.data.error_msg,
              icon: 'none',
              duration: 3000
            })
            console.log('请求失败')
          }

        } else {
          wx.showToast({
            title: '失败, status_code=' + res.statusCode,
            icon: 'none',
            duration: 3000
          })
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
  },

  refresh_events: function() {
    // console.log('refresh')
    events_cnt = 0
    this.setData({
      events: [],
      refresh_trigger: true,
    })

    var that = this
    wx.request({
      url: 'https://www.cxingyu.cn:5002/api/get_events',
      data: {
        request_usr: 'of6CL5eJ9Rdv0iIPHAlxJakDw84Q',
        // request_usr: app.globalData.openid,
      },

      success: function(res) {
        if (res.statusCode === 200) {
          if (res.data.success === '1') {    
            var event_arr = []  
            for (let i = 0; i < res.data.data.length; i++) {
              var obj = new Event(res.data.data[i].commit_user === app.globalData.openid,
                res.data.data[i].commit_time, res.data.data[i].content,
                res.data.data[i].degree)
              // obj.show()
              event_arr.push(obj)
            }
            that.setData({
              events: event_arr,
              refresh_trigger: false,
            })      

          } else {
            wx.showToast({
              title: '请求失败:' + res.data.error_msg,
              icon: 'none',
              duration: 3000
            })
            console.log('请求失败')
          }

        } else {
          wx.showToast({
            title: '失败, status_code=' + res.statusCode,
            icon: 'none',
            duration: 3000
          })
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
  },


  navigate2new: function() {
    wx.navigateTo({
      url: '../new/new',
    })
    wx.vibrateShort()
  },

  bind_getUser_info: function(res) {
    this.setData({
      userInfo: res.detail.userInfo
    })
    app.globalData.userInfo = res.detail.userInfo
    // console.log(res)
    
    if (wx.getLaunchOptionsSync().scene === 1007) {
      this.pair_to_another(from_id_t)
    } else {
      util.upd_usr_info({
        userInfo: this.data.userInfo,
        openid: app.globalData.openid,
      })
      this.request_events()
    }
  },
  
  rendor_background() {
    const bg_arr = [['https://s2.ax1x.com/2020/03/02/3W1AeJ.md.png', '2018/7/22'],
                    ['https://s2.ax1x.com/2020/03/02/3W1VoR.md.png', '2018/7/22'],
                    ['https://s2.ax1x.com/2020/03/02/3W1nW6.md.png', '2018/7/23'],
                    ['https://s2.ax1x.com/2020/03/02/3W1eF1.md.png', '2018/7/24'],
                    ['https://s2.ax1x.com/2020/03/02/3W1KSK.md.png', '2018/7/27'],
                    ['https://s2.ax1x.com/2020/03/02/3W1QyD.md.png', '2018/7/27'],
                    ['https://s2.ax1x.com/2020/03/02/3W1lOe.md.png', '2018/7/27'],
                    ['https://s2.ax1x.com/2020/03/02/3W1SJ0.md.png', '2018/7/27'],
                    ['https://s2.ax1x.com/2020/03/02/3W13eH.md.png', '2018/7/28'],
                    ['https://s2.ax1x.com/2020/03/02/3W1GTA.md.png', '2018/7/28'],
                    ['https://s2.ax1x.com/2020/03/02/3W18wd.md.png', '2018/7/28'],
                    ['https://s2.ax1x.com/2020/03/02/3W1YFI.md.png', '2018/8/14'],
                    ['https://s2.ax1x.com/2020/03/02/3W1NfP.md.png', '2018/8/19'],
                    ['https://s2.ax1x.com/2020/03/02/3W1dl8.md.png', '2018/8/26'],
                    ['https://s2.ax1x.com/2020/03/02/3W1w6S.md.png', '2018/8/29'],
                    ['https://s2.ax1x.com/2020/03/02/3W10Og.md.png', '2018/8/30'],
                    ['https://s2.ax1x.com/2020/03/02/3W1DmQ.md.png', '2018/9/9'],
                    ['https://s2.ax1x.com/2020/03/02/3W1rwj.md.png', '2018/9/9'],
                    ['https://s2.ax1x.com/2020/03/02/3W16kn.md.png', '2018/9/9'],
                    ['https://s2.ax1x.com/2020/03/02/3W1cYq.md.png', '2018/11/11'],
                    ['https://s2.ax1x.com/2020/03/02/3W1gf0.md.png', '2018/10/3'],
                    ['https://s2.ax1x.com/2020/03/02/3W1RpV.md.png', '2018/11/17'],
                    ['https://s2.ax1x.com/2020/03/02/3W1WlT.md.png', '2018/11/18'],
                    ['https://s2.ax1x.com/2020/03/02/3W19zT.md.png', '2019/8/16'],
                    ['https://s2.ax1x.com/2020/03/02/3W1pWV.md.png', '2019/8/20'],
                    ['https://s2.ax1x.com/2020/03/02/3Wlziq.md.png', '2019/8/20'],
                    ['https://s2.ax1x.com/2020/03/02/3Wljds.md.png', '2019/9/30'],
                    ['https://s2.ax1x.com/2020/03/02/3W1PQU.md.png', '2020/2/17'],
                    ['https://s2.ax1x.com/2020/03/02/3W1iyF.md.png', '2020/2/17'],
                    ['https://s2.ax1x.com/2020/03/02/3W1FL4.md.png', '2020/2/23'],
                    ['https://s2.ax1x.com/2020/02/22/3MoE9J.jpg', '2019/10/27'],
                    ['https://s2.ax1x.com/2020/03/02/3WyQeA.md.png', '2020/1/25'],
                    ['https://s2.ax1x.com/2020/03/02/3Wy4T1.md.png', '2018/12/23'],
                    ['https://s2.ax1x.com/2020/03/02/3WyHSO.md.png', '2018/12/25'],
                    ['https://s2.ax1x.com/2020/03/02/3Wyq6e.md.png', '2019/1/14'],
                    ['https://s2.ax1x.com/2020/03/02/3WyLOH.md.png', '2019/2/17'],
                    ['https://s2.ax1x.com/2020/03/02/3Wyj0A.md.png', '2019/2/24'],
                    ['https://s2.ax1x.com/2020/03/02/3WyvTI.md.png', '2019/2/27'],
                    ['https://s2.ax1x.com/2020/03/02/3Wyzkt.md.png', '2019/2/26'],
                    ['https://s2.ax1x.com/2020/03/02/3W6StP.md.png', '2019/2/28'],
                    ['https://s2.ax1x.com/2020/03/02/3W6pff.md.png', '2019/3/9'],   // !!
                    ['https://s2.ax1x.com/2020/03/02/3W6Cp8.md.png', '2019/5/1'],
                    ['https://s2.ax1x.com/2020/03/02/3W6P1S.md.png', '2019/5/3'],
                    ['https://s2.ax1x.com/2020/03/02/3W6i6g.md.png', '2019/5/10'],
                    ['https://s2.ax1x.com/2020/03/02/3W6Amj.md.png', '2019/5/20'],
                    ['https://s2.ax1x.com/2020/03/02/3WyhwR.md.png', '2019/5/25'],
                    ['https://s2.ax1x.com/2020/03/02/3WyROJ.md.png', '2019/6/23'],
                    ['https://s2.ax1x.com/2020/03/02/3WyIFx.md.png', '2019/7/10'],
                    ['https://s2.ax1x.com/2020/03/02/3W1SJ0.md.png', '2018/7/27']]
    var idx = Math.floor(Math.random() * bg_arr.length)
    if (app.globalData.openid !== 'of6CL5eJ9Rdv0iIPHAlxJakDw84Q')
      idx = 10
    const now = new Date()
    const thatDay = new Date(bg_arr[idx][1])
    var days_gone = parseInt((now.getTime() - thatDay.getTime())/1000/3600/24)
    this.setData({
      bg_src: bg_arr[idx][0],
      bg_desc: '背景图拍摄于' + bg_arr[idx][1] + '，已经过' + days_gone + '天...'
    })
  },

  start_bg_anim() {
    var anim = wx.createAnimation()
    const heart_beat_period = 1400
    const t1 = heart_beat_period * 5 / 7
    const t2 = heart_beat_period / 7
		bg_anim_id = setInterval(() => {
			anim.scale(0.3).step({ duration: t1 })
				.scale(1).step({ duration: t2 })
			this.setData({
				bg_anim: anim.export()
      })
		}, heart_beat_period)
  },


  onShareAppMessage: function(res) {
    console.log(res)

    // costomize sharing content
    return {
      title: this.data.userInfo.nickName + '邀请你使用时间线',
      path: '/pages/browse/browse?from_id=' + app.globalData.openid,
      imageUrl: '/images/happy.png',
    }
  },

  pair_to_another(from_id) {
    var that = this

    util.upd_usr_info({
      userInfo: this.data.userInfo,
      openid: app.globalData.openid,
      bind_lovers: () => {
        wx.showModal({
          title: '我想与你配对',
          content: '你是否同意？',
          confirmText: '我愿意',
          cancelText: '不行！',
          success: (res) => {
            if (res.confirm === true) {
              wx.request({
                url: 'https://www.cxingyu.cn:5002/api/bind_lovers',
                data: {
                  lover1: from_id,
                  lover2: app.globalData.openid,
                },
                success: (res) => {
                  if (res.data.success === '1') {
                    
                    // 更新对象的头像
                    wx.request({
                      url: 'https://www.cxingyu.cn:5002/api/get_lover_avatar',
                      data: {
                        lover_id: from_id,
                      },
                      success: (res) => {
                        that.setData({
                          lover_avatar: res.data.data.lover_avatar,
                        })
                        that.request_events()
                      },
                    })
                    
                    wx.showToast({
                      title: '配对成功',
                      icon: 'success',
                      duration: 1000,
                    })
                  } else {
                    wx.showToast({
                      title: '绑定失败',
                      icon: 'none',
                    })
                  }
                },
              })
            }
          }
        })
      },
    })
  },

})

