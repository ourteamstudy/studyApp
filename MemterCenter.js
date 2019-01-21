// pages/MemterCenter/MemterCenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      currentTab:0,
      is_SignIn:true,
      userInfo: {},
      hasUserInfo: false,
      is_sign:false,
      num:[{id:1,n:2},{id:2,n:5},{id:3,n:2},{id:4,n:1}],
      GamesTime:0,
      FriendsNum:0,
      videoTime:0,
      sign:{
          sign:0,
          is_sign:0
      },
      canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  RankTypeTap: function (e) {
      var that = this;
      var newId = e.currentTarget.dataset.id;
      if (this.data.currentTab == newId) {
          return false;
      } else {
          that.setData({
              currentTab: newId
          })
      }
  },
  //签到框显示
  SignBoxtap:function () {
      this.setData({
          is_SignIn:!this.data.is_SignIn
      })
  },
  //抽奖
  luckDraw:function () {
      wx.showToast({
          title: "正在建设中..",
          icon:"none",
          duration: 2000
      })
  },
  //签到
  SignIntap:function () {
      var that = this
      if(app.globalData.userInfo){
          wx.request({
              url: 'https://caige1.sanliwenhua.com/program/sign?app=9',
              method: "post",
              data:{
                  x_token: app.globalData.userInfo.token
              },
              success: function (res) {
                  console.log(res.data)
                  var gold
                  if(that.data.sign.sign==7){
                      gold = 100
                  }else if(that.data.sign.sign<6){

                      gold = 100+(that.data.sign.sign)*10
                  }else{
                      gold = 200
                  }
                  wx.showToast({
                      title: "签到成功，获得"+gold+"金币",
                      icon:"none",
                      duration: 2000
                  })
                  that.getUser()
              }
          })
      }else{
          wx.showToast({
              title: "请先登录",
              icon:"none",
              duration: 2000
          })
      }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      clearTimeout(app.globalData.userInfo);
      console.log(app.globalData.userInfo)
      if(app.globalData.userInfo){
          that.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo:true
          })
          that.userApplist()
          that.getUser()
          setTimeout(function () {
              // f1的任务代码
              that.taskOver()
          }, 1000);
      }
      that.advterObj()
      that.GamesObj()
      that.friendsObj()
      //轮播数据请求
      wx.request({
          url: 'https://caige1.sanliwenhua.com/program/column?app=9',
          method: "get",
          success: function (res) {
              if (res.data.code = 200) {
                  console.log(res.data)
                  var  data= res.data.data;
                  var rankAdv = []
                  var SignIntapAdv =[]
                  for(var i=0;i<data.length;i++){
                      if(data[i].type=="userCenter_adv"){
                          rankAdv.push(data[i])
                      }
                  }
                  for(var y=0;y<data.length;y++){
                      if(data[y].type=="SignIntap_adv"){
                          SignIntapAdv.push(data[y])
                      }
                  }
                  that.setData({
                      rankAdv:rankAdv,
                      SignIntapAdv:SignIntapAdv
                  })
              }
          }
      })
      that.taskList()
  },
  //任务列表数据请求
  taskList:function(){
        var that = this
        var token = ''
        if(app.globalData.userInfo){
            token = app.globalData.userInfo.token
        }
        wx.request({
            url: 'https://caige1.sanliwenhua.com/program/task?app=9',
            method: "get",
            data:{x_token:token},
            success: function (res) {
                if (res.data.code = 200) {
                    console.log(res.data)
                    var taskList = res.data.data;
                    var num = that.data.num
                    for(var i=0;i<taskList.length;i++){

                        if(taskList[i].id==1){
                            taskList[i].sum = that.data.GamesTime
                        }
                        if(taskList[i].id==2){
                            taskList[i].sum = that.data.GamesTime
                        }
                        if(taskList[i].id==3){
                            taskList[i].sum = that.data.FriendsNum
                        }
                        if(taskList[i].id==4){
                            taskList[i].sum = that.data.videoTime
                            app.globalData.video_complete = taskList[i].is_complete
                        }
                    }
                    for(var y=0;y<num.length;y++){
                        for(var r=0;r<taskList.length;r++){
                            if(taskList[r].id==num[y].id){
                                taskList[r].num = num[y].n
                            }
                        }
                    }
                    that.setData({
                        taskList:taskList
                    })
                }
            }
        })
    },
  //任务的完成请求
  taskButton:function (e) {
      var that = this
      if(app.globalData.userInfo){
          wx.request({
              url: 'https://caige1.sanliwenhua.com/program/task/complete?app=9',
              method: "post",
              data:{
                  x_token:app.globalData.userInfo.token,
                  task_id:e
              },
              success: function (res) {
                  console.log(res.data)
                  that.getUser()
              }
          })
      }
  },
  //任务完成处理
  taskOver:function () {
      var that = this
        var taskList = that.data.taskList;
        for(var i=0;i<taskList.length;i++){
            if(taskList[i].id==1){
                taskList[i].sum = that.data.GamesTime
                if(that.data.GamesTime ==taskList[i].num&&taskList[i].is_complete==0){
                    that.taskButton(taskList[i].id)
                }
            }
            if(taskList[i].id==2){
                taskList[i].sum = that.data.GamesTime
                if(that.data.GamesTime ==taskList[i].num&&taskList[i].is_complete==0){
                    that.taskButton(taskList[i].id)
                }
            }
            if(taskList[i].id==3){
                taskList[i].sum = that.data.FriendsNum
                if(that.data.FriendsNum ==taskList[i].num&&taskList[i].is_complete==0){
                    that.taskButton(taskList[i].id)
                }
            }
            if(taskList[i].id==4){
                taskList[i].sum = that.data.videoTime
                if(that.data.videoTime ==taskList[i].num&&taskList[i].is_complete==0){
                    app.globalData.video_complete = 1
                    that.taskButton(taskList[i].id)
                }
            }
        }
        that.setData({
            taskList:taskList
        })
    },
  //用户中心数据请求
  getUser:function () {
        var that = this
        wx.request({
            url: 'https://caige1.sanliwenhua.com/program/user/'+app.globalData.userInfo.userid+'?app=9',
            method: "get",
            data:{x_token:app.globalData.userInfo.token},
            success: function (res) {
                if (res.data.code = 200) {
                    console.log(res.data)
                    var getUser = {}
                    getUser.is_sign = res.data.data.is_sign
                    getUser.sign = res.data.data.values.sign
                    app.globalData.userInfo.gold = res.data.data.values.gold
                    that.setData({
                        sign:getUser,
                        userInfo:app.globalData.userInfo
                    })
                }
            }
        })
    },
  //用户游戏列表数据请求
  userApplist:function(){
      var that = this
        wx.request({
            url: 'https://caige1.sanliwenhua.com/program/user_app?app=9',
            method: "get",
            data:{x_token:app.globalData.userInfo.token},
            success: function (res) {
                if (res.data.code = 200) {
                    console.log(res.data)
                    var GreamList = res.data.data.data
                    that.setData({
                        GreamList: GreamList
                    })

                }
            }
        })
    },
  //用户访问小程序接口
  userApp:function (e){
      var that = this
        if(app.globalData.userInfo){
            wx.request({
                url: 'https://caige1.sanliwenhua.com/program/user_app?app=9',
                method: "post",
                data:{
                    x_token:app.globalData.userInfo.token,
                    appid: e.currentTarget.dataset.appid,
                },
                success: function (res) {
                    console.log(res)
                    if(res.data.code == 200){
                        // wx.showToast({
                        //     title: "成功了录取记录",
                        //     icon:"none",
                        //     duration: 2000
                        // })
                        that.NumberGamesObj(e.currentTarget.dataset.appid)
                        setTimeout(function () {
                            // f1的任务代码
                            that.taskOver()
                        }, 1000);

                    }
                },
                fail:function (res) {

                }
            })
        }
    },
  //玩游戏数量处理
  GamesObj:function () {
        var that = this
        var myTime = new Date();
        var today = myTime.getDate();
        wx.getStorage({
            key: 'NumberGames',
            success: function (res) {
                var NumberGames = JSON.parse(res.data)
                //console.log('ChallengeObj', ChallengeObj)
                if (today != NumberGames.day) {
                    NumberGames = {
                        day: today,
                        GamesTime: 0,
                        GamesAppid: []
                    }
                }
                wx.setStorage({
                    key: 'NumberGames',
                    data: JSON.stringify(NumberGames)
                })
                app.globalData.NumberGames = NumberGames
                that.setData({
                    GamesTime:NumberGames.GamesTime
                })

            }, fail: function (res) {
                //console.log(res)
                var NumberGames = {
                    day: today,
                    GamesTime: 0,
                    GamesAppid: []
                }
                wx.setStorage({
                    key: 'NumberGames',
                    data: JSON.stringify(NumberGames)
                })
                app.globalData.NumberGames = NumberGames
                that.setData({
                    GamesTime:NumberGames.GamesTime
                })
            }
        })

    },
  NumberGamesObj:function (e) {
        var that = this
        var myTime = new Date();
        var today = myTime.getDate();
        wx.getStorage({
            key: 'NumberGames',
            success: function (res) {
                var NumberGames = JSON.parse(res.data)
                //console.log('ChallengeObj', ChallengeObj)
                var GamesAppid = NumberGames.GamesAppid;
                if (today != NumberGames.day){
                    NumberGames = {
                        day: today,
                        GamesTime: 0,
                        GamesAppid: []
                    }
                }else{
                    if(GamesAppid.length>0){
                        for(var i=0;i<GamesAppid.length;i++){
                            if(NumberGames.GamesAppid[i]==e){
                                NumberGames = {
                                    day: today,
                                    GamesTime: NumberGames.GamesTime,
                                    GamesAppid: GamesAppid
                                }
                                break;
                            }else {
                                if(i+1==GamesAppid.length){
                                    GamesAppid.push(e)
                                    NumberGames = {
                                        day: today,
                                        GamesTime: NumberGames.GamesTime+1,
                                        GamesAppid: GamesAppid
                                    }
                                }
                            }
                        }
                    }else{
                        GamesAppid.push(e)
                        NumberGames = {
                            day: today,
                            GamesTime: NumberGames.GamesTime+1,
                            GamesAppid: GamesAppid
                        }
                    }
                }
                wx.setStorage({
                    key: 'NumberGames',
                    data: JSON.stringify(NumberGames)
                })
                app.globalData.NumberGames = NumberGames
                that.setData({
                    GamesTime:NumberGames.GamesTime
                })

            }, fail: function (res) {
                //console.log(res)
                var NumberGames = {
                    day: today,
                    GamesTime: 0,
                    GamesAppid:[]
                }
                wx.setStorage({
                    key: 'NumberGames',
                    data: JSON.stringify(NumberGames)
                })
                app.globalData.NumberGames = NumberGames
                that.setData({
                    GamesTime:NumberGames.GamesTime
                })
            }
        })

    },
  //邀请好友缓存处理
  friendsObj:function () {
      var that = this
      var myTime = new Date();
      var today = myTime.getDate();
      wx.getStorage({
          key: 'NumberFriends',
          success: function (res) {
              var NumberFriends = JSON.parse(res.data)
              //console.log('ChallengeObj', ChallengeObj)
              if (today != NumberFriends.day) {
                  NumberFriends = {
                      day: today,
                      FriendsNum: 0,
                  }
              }
              wx.setStorage({
                  key: 'NumberFriends',
                  data: JSON.stringify(NumberFriends)
              })
              app.globalData.NumberFriends = NumberFriends
              that.setData({
                  FriendsNum:NumberFriends.FriendsNum
              })

          }, fail: function (res) {
              //console.log(res)
              var NumberFriends = {
                  day: today,
                  FriendsNum: 0,
              }
              wx.setStorage({
                  key: 'NumberFriends',
                  data: JSON.stringify(NumberFriends)
              })
              app.globalData.NumberFriends = NumberFriends
              that.setData({
                  FriendsNum:NumberFriends.FriendsNum
              })
          }
      })
      
  },
  NumberfriendsObj:function () {
      var that = this
      var myTime = new Date();
      var today = myTime.getDate();
      wx.getStorage({
          key: 'NumberFriends',
          success: function (res) {
              var NumberFriends = JSON.parse(res.data)
              //console.log('ChallengeObj', ChallengeObj)
              if (today != NumberFriends.day) {
                  NumberFriends = {
                      day: today,
                      FriendsNum: 0,
                  }
              }else{
                  NumberFriends = {
                      day: today,
                      FriendsNum: NumberFriends.FriendsNum+1,
                  }
              }
              wx.setStorage({
                  key: 'NumberFriends',
                  data: JSON.stringify(NumberFriends)
              })
              app.globalData.NumberFriends = NumberFriends
              that.setData({
                  FriendsNum:NumberFriends.FriendsNum
              })

          }, fail: function (res) {
              //console.log(res)
              var NumberFriends = {
                  day: today,
                  FriendsNum: 0,
              }
              wx.setStorage({
                  key: 'NumberFriends',
                  data: JSON.stringify(NumberFriends)
              })
              app.globalData.NumberFriends = NumberFriends
              that.setData({
                  FriendsNum:NumberFriends.FriendsNum
              })
          }
      })
  },
  //观看广告处理
  advterObj:function () {
        var that = this
        var myTime = new Date();
        var today = myTime.getDate();
        wx.getStorage({
            key: 'NumberAdvter',
            success: function (res) {
                var NumberAdvter = JSON.parse(res.data)
                //console.log('ChallengeObj', ChallengeObj)
                if (today != NumberAdvter.day) {
                    NumberAdvter = {
                        day: today,
                        videoTime: 0,
                    }
                }
                wx.setStorage({
                    key: 'NumberAdvter',
                    data: JSON.stringify(NumberAdvter)
                })
                app.globalData.NumberAdvter = NumberAdvter
                that.setData({
                    videoTime:NumberAdvter.videoTime
                })

            }, fail: function (res) {
                //console.log(res)
                var NumberAdvter = {
                    day: today,
                    videoTime: 0,
                }
                wx.setStorage({
                    key: 'NumberAdvter',
                    data: JSON.stringify(NumberAdvter)
                })
                app.globalData.NumberAdvter = NumberAdvter
                that.setData({
                    videoTime:NumberAdvter.videoTime
                })
            }
        })

    },
  //登录接口
  login:function () {
        var that = this
        console.log(app.globalData)
        if(app.globalData.userInfo){
            var dataSend = {
                code: app.globalData.code,
                icon: app.globalData.userInfo.avatarUrl,
                nickname: app.globalData.userInfo.nickName
            }
            console.log(app.globalData.code)
            wx.request({
                url: 'https://caige1.sanliwenhua.com/program/wx/onLogin?app=9',
                method: "get",
                data: dataSend,
                success: function (res) {
                    console.log(res)
                    if(res.data.code == 200){
                        var token = res.data.data.x_token;
                        var gold = res.data.data.values.gold;
                        var userid = res.data.data.values.user_id;
                        app.globalData.userInfo.token = token;
                        app.globalData.userInfo.gold = gold;
                        app.globalData.userInfo.userid = userid
                        that.setData({
                            userInfo: app.globalData.userInfo,
                            hasUserInfo: true
                        })
                        that.userApplist()
                        that.getUser()
                        that.taskList()
                    }
                },
                fail:function (res) {
                    wx.showToast({
                        title: res.data.message,
                        icon:"none",
                        duration: 2000
                    })
                }
            })
        }
    },
  getUserInfo: function(e) {
        console.log(e)
        if(e.detail.userInfo){
            app.globalData.userInfo = e.detail.userInfo
            this.login()
        }
  },
    /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function (res) {
        var that = this
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
            return {
                title: '小姐姐们发现了一个超级好玩的！',
                path: 'pages/index/index',
                imageUrl:'http://pbkva7be7.bkt.clouddn.com/image/tw_35.png',
                success: function (res) {
                    wx.showToast({
                        title: '分享成功!',
                        icon: 'success',
                        duration: 2000
                    })
                    that.NumberfriendsObj()
                    setTimeout(function () {
                        // f1的任务代码
                        that.taskOver()
                    }, 1000);

                },fail: function (res) {
                    console.log(res)
                    wx.showToast({
                        title: '分享失败！',
                        image: '/image/errIcon.png',
                        duration: 2000
                    })
                }
            }
        }else{
            return {
                title: '小姐姐们发现了一个超级好玩的！',
                path: 'pages/index/index',
                imageUrl:'http://pbkva7be7.bkt.clouddn.com/image/tw_35.png',
                success: function (res) {
                    wx.showToast({
                        title: '分享成功!',
                        icon: 'success',
                        duration: 2000
                    })

                },fail: function (res) {
                    console.log(res)
                    wx.showToast({
                        title: '分享失败！',
                        image: '/image/errIcon.png',
                        duration: 2000
                    })
                }
            }

        }
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
  */
  onShow: function () {
      var that = this
      wx.showShareMenu({
          withShareTicket: true
      })
      if(app.globalData.userInfo){
          that.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo:true
          })
          that.userApplist()
          that.getUser()
          setTimeout(function () {
              // f1的任务代码
              that.taskOver()
          }, 1000);
      }
      that.taskList()
      that.GamesObj()
      that.friendsObj()
      that.advterObj()
      clearTimeout(app.globalData.timer);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

})