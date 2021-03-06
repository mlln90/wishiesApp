//index.js
//获取应用实例
const $= getApp().globalData.$;
Page({
  data: {
      clientData:[],
      page:1,
      size:6,
      reachBtn:false
  },
  onLoad(){
    let personalData = wx.getStorageSync('loginData');//获取登录人员用户信息
    console.log("本地获取的数据",personalData)
    this.setData({
      personalData:personalData
    })

      console.log(getCurrentPages())

    this.getClientData()
  },
  getClientData(){//设置获取客户信息接口的参数
    let personalData=this.data.personalData,
        clientObj={
            page:this.data.page,
            size:this.data.size,
            plusType:personalData.plusType,
            plusId:personalData.plusId
        };
    if(personalData.uType>2){
        clientObj.userIdM=personalData.userId || '';
    }
        this.setData({
            clientObj:clientObj
        });
      this.clientRequset()
  },
  clientRequset(){//获取客户信息
      let _this=this,
          clientObj=this.data.clientObj,
          reachBtn=this.data.reachBtn,
          clientData=this.data.clientData;
      $.common('noteBankPlusManager/user/getUserListWechat.htm',clientObj,
          function (res) {
              console.log("获取成功",res);
              for(let item of res){
                  clientData.push(item)
              }
              _this.setData({
                  clientData:clientData
              })
              if(res.length<6){
                  wx.showToast({
                      title: '已全部加载',
                      icon: 'success',
                      duration: 1000
                  })
                  _this.setData({
                      reachBtn:true
                  })
              }
          },function (err) {
              console.log("获取失败",err)
          }
      )
  },
  //事件处理函数
  goDemand(){//跳转到查询
    wx.navigateTo({
        url: '/pages/client/clientDemand/index'
    })
  },
    onReachBottom(){//加载更多信息
      console.log('111')
        let _this=this,
            clientObj=this.data.clientObj,
            reachBtn=this.data.reachBtn;
        if(!reachBtn){
            clientObj.page++;
            this.setData({
                clientObj:clientObj
            });
            this.clientRequset()
        }
    },
    modifyUser(e){//进入客户信息详情
        let index=e.currentTarget.id,
            specificInfo=this.data.clientData[index],
            personalData=this.data.personalData;
        if(personalData.uType<2){
            wx.setStorage({
                key:"specificInfo",
                data:specificInfo,
                success:res => {
                    console.log("数据储存成功",res)
                }
            })
            wx.navigateTo({
                url: '/pages/client/clientDetail/index?demand=false'
            });
        }
    }
})
