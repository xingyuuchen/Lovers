
//获取应用实例
const app = getApp()
var heart_beat_anim
var heart_beat_anim_id

Page({
  data: {
    radio_value: 'good',
    heart_anim: null,

    bg_src: 'https://s2.ax1x.com/2020/02/22/3MoE9J.jpg',
    bg_src: '../../images/p1.jpg',
    content: '',
    degree: 0,
    star_src: ['../../images/unstar.png', '../../images/unstar.png',
                '../../images/unstar.png', '../../images/unstar.png',
              '../../images/unstar.png'],
  },
  
  tap_stars: function(e) {
    const cnt = Number(String(e.target.id).substring(4, 5))   // starx
    if (this.data.radio_value === 'good') {
      for (var i = 0; i < 5; i++) {
        let tmp = 'star_src[' + i + ']'
        if (i <= cnt)
          this.setData({[tmp]: '../../images/happy.png'})
        else
          this.setData({[tmp]: '../../images/unstar.png'})
      }
    } else {
      for (var i = 0; i < 5; i++) {
        let tmp = 'star_src[' + i + ']'
        if (i <= cnt)
          this.setData({[tmp]: '../../images/angry.png'})
        else
          this.setData({[tmp]: '../../images/unstar.png'})
      }
    }
    if (this.data.radio_value === 'bad')
      this.setData({degree: -cnt - 1})
    else
      this.setData({degree: cnt + 1})
    // console.log(this.data.degree)

  },

  onLoad: function () {
    
  },
  onShow() {
    this.heart_beat()
  },
  onUnload() {
    clearInterval(heart_beat_anim_id)
  },
  onHide() {
    clearInterval(heart_beat_anim_id)
  },

  commit_new: function() {
    wx.vibrateShort()
    if (this.data.content === '') {
      wx.showToast({
        title: '空的不行熬',
        icon: "none",
        duration: 2000
      })
      
    } else {
      wx.request({
        url: 'https://www.cxingyu.cn:5002/api/commit_new_event',
        data: {
          commit_usr: app.globalData.openid,
          content: this.data.content,
          degree: this.data.degree,
        },
        success: function(res) {
          if (res.statusCode === 200) {
            if (res.data.success === '1') {
              wx.showToast({
                title: '发送成功!',
                icon: 'success',
                duration: 2000,
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 800)

            } else {
              wx.showToast({
                title: '发送失败:' + res.data.error_msg,
                icon: 'none',
                duration: 3000
              })
              console.log('发送失败')
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
    }
    
  },

  upd_content: function(e) {
    this.setData({content: e.detail.value})
  },


  heart_beat() {
		const heart_beat_period = 1400
    heart_beat_anim = wx.createAnimation()
    const t1 = heart_beat_period * 5 / 7
    const t2 = heart_beat_period / 7
		heart_beat_anim_id = setInterval(() => {
			heart_beat_anim.scale(0.3).step({ duration: t1 })
				.scale(1).step({ duration: t2 })
			this.setData({
				heart_anim: heart_beat_anim.export()
      })
      wx.vibrateShort()
		}, heart_beat_period)
    
  },
  


  bindchanged(e) {
    this.setData({
      radio_value: e.detail.value,
    })
    if (this.data.radio_value === 'good') {
      for (var i = 0; i < 5; i++) {
        let tmp = 'star_src[' + i + ']'
        if (this.data.star_src[i] === '../../images/angry.png')
          this.setData({[tmp]: '../../images/happy.png'})
      }
      if (this.data.degree < 0)
        this.setData({degree: -this.data.degree})
      
    } else if (this.data.radio_value === 'bad') {
      for (var i = 0; i < 5; i++) {
        let tmp = 'star_src[' + i + ']'
        if (this.data.star_src[i] === '../../images/happy.png')
          this.setData({[tmp]: '../../images/angry.png'})
      }
      if (this.data.degree > 0)
        this.setData({degree: -this.data.degree})
    }
    // console.log(this.data.degree)
  },

})


