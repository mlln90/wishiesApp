/**
 * Created by terrorblade on 2018/2/25.
 */
const date = new Date();
const years = [];
const months = [];
const days = [];
const $= getApp().globalData.$;
for (let i = 0; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1 ; i <= 12; i++) {
    months.push(i)
}

for (let i = 1 ; i <= 31; i++) {
    days.push(i)
}
Page({
    data:{
        incomeData:[],
        businessTotal:{},
        years: years,
        startYear: date.getFullYear(),
        endYear: date.getFullYear(),
        months: months,
        startMonth: $.util.formatNumber(date.getMonth()+1),
        endMonth: $.util.formatNumber(date.getMonth()+1),
        days: days,
        startDay: $.util.formatNumber(date.getDate()),
        endDay: $.util.formatNumber(date.getDate()),
        startValue: [date.getFullYear(), date.getMonth(), date.getDate()-1],
        endValue:[date.getFullYear(), date.getMonth(), date.getDate()-1],
        dateShow:false,
        startDateSel:false,
        endDateSel:false,
        bankShow:false,
        bankValue:["工商银行","农业银行","招商银行"],
        bankValues:0,
        bankValueItem:"",
        page:1,
        size:3,
        payStateShow:false,
        StateValues:Number,
        payStateValue:['全部','未完成','完成'],
        payStatusValueItem:0,
        payFinishValueItem:0,
        isFinishValueItem:0,
        receiveTypeShow:false,
        receiveTypeValues:0,
        receiveTypeValue:['全部','应收','应付'],
        payStateNum:0
    },
    onLoad(options){
        let  queryType=options.queryType || '3',
            _this=this,
            personalData = wx.getStorageSync('loginData');
        console.log(this.data.page);
        console.log("adminDemand",personalData);
        this.setData({
            personalData:personalData,
            queryType:queryType,
            startValue:[date.getFullYear(), date.getMonth(), date.getDate()-1],
            endValue:[date.getFullYear(), date.getMonth(), date.getDate()-1],
            page:1,
            size:3
        });
        this.bankRequest();
        switch (queryType){
            case '1':
                _this.incomeData();
                break;
            case '2':
                _this.bankBalance();
                break;
            default:
                _this.otherIncome()
        }
    },
    incomeData(type){
        let personalData=this.data.personalData,
            dataObj={
                page:this.data.page,
                size:this.data.size,
                plusType:personalData.plusType,
                plusId:personalData.plusId,
            },
            _this=this;
            console.log("incomeData")
        if(type==1){
            dataObj.startTime=this.data.startYear.toString()+this.data.startMonth.toString()+this.data.startDay.toString();
            dataObj.userName=this.data.userName;
            dataObj.endTime=this.data.endYear.toString()+this.data.endMonth.toString()+this.data.endDay.toString();
            dataObj.bankId=this.data.bankValueItem;
            console.log(this.data.userName)
        }
        $.common('noteBankPlusManager//bank/findBankProfitListWechat.htm',"GET",dataObj,function (res,resData) {
                console.log("获取成功",res);
                if(!res.length){
                    wx.showToast({
                        title: '查询无结果',
                        icon: 'none',
                        duration: 1000
                    })
                }
                _this.setData({
                    incomeData:res,
                    incomeTotal:resData.total
                })
            },function (err) {
                wx.showToast({
                    title: '查询失败',
                    icon: 'none',
                    duration: 1000
                })
                console.log("获取失败",err)
            }
        )
    },
    bankBalance(type){
        console.log("bankBalance")
        let personalData=this.data.personalData,
            dataObj={
                page:this.data.page,
                size:this.data.size,
                plusType:personalData.plusType,
                plusId:personalData.plusId,
            },
            _this=this;
        if(type==2){
            dataObj.bankId=this.data.bankValues;
            console.log("银行查询")
        }
        $.common('noteBankPlusManager//bank/findBankListWechat.htm',"GET",dataObj,function (res) {
                console.log("获取成功",res);
                if(!res.length){
                    wx.showToast({
                        title: '查询无结果',
                        icon: 'none',
                        duration: 1000
                    })
                }
                _this.setData({
                    bankBalanceData:res
                })
            },function (err) {
                wx.showToast({
                    title: '查询失败',
                    icon: 'none',
                    duration: 1000
                })
                console.log("获取失败",err)
            }
        )
    },
    otherIncome(type){
        let personalData=this.data.personalData,
            dataObj={
                page:this.data.page,
                size:this.data.size,
                plusType:personalData.plusType,
                plusId:personalData.plusId,
            },
            _this=this;
        console.log("otherIncome")
        if(type==1){
            dataObj.bankEvent=this.data.bankEvent || '';
            dataObj.bankNum=this.data.bankNum || '';
            dataObj.startTime=this.data.startYear.toString()+"-"+this.data.startMonth.toString()+"-"+this.data.startDay.toString()+" "+"00:00:00";
            dataObj.userName=this.data.userName || '';
            dataObj.endTime=this.data.endYear.toString()+"-"+this.data.endMonth.toString()+"-"+this.data.endDay.toString()+" "+"00:00:00";
            dataObj.bankId=this.data.bankValue[this.data.bankValues].bankId;
            dataObj.receiveType = this.data.receiveTypeValues!=0 ? this.data. receiveTypeValues :'';
            dataObj.payStatus = this.data.payStatusValueItem != 0 ? this.data.payStatusValueItem-1 :'';
            dataObj.payFinish = this.data.payFinishValueItem != 0 ? this.data.payFinishValueItem-1 :'';
            dataObj.isFinish = this.data.isFinishValueItem != 0 ? this.data.isFinishValueItem-1 :'';
        }
        console.log('收支',dataObj);
        $.common('noteBankPlusManager//bank/findBankReceiveListWechat.htm',"POST",$.util.fjson2Form(dataObj),function (res,resData) {
                console.log("获取成功",res);
                if(!res.length){
                    wx.showToast({
                        title: '查询无结果',
                        icon: 'none',
                        duration: 1000
                    })
                }else {
                    for(let i of res){
                        if(i.payFinish==0){
                            i.payFinishName='否'
                        }else {
                            i.payFinishName='是'
                        }
                        if(i.payStatus==0){
                            i.payStatusName='否'
                        }else {
                            i.payStatusName='是'
                        }
                        if(i.isFinish==0){
                            i.isFinishName='否'
                        }else {
                            i.isFinishName='是'
                        }
                    }
                }

                _this.setData({
                    otherIncomeData:res,
                    otherIncomeTotal:resData.total
                })
            },function (err) {
                wx.showToast({
                    title: '查询失败',
                    icon: 'none',
                    duration: 1000
                })
                console.log("获取失败",err)
            }
        )
    },
    bankRequest(){
        let personalData=this.data.personalData,
            _this=this,
            bankObj={};
        bankObj.plusId=personalData.plusId;
        bankObj.plusType=personalData.plusType;
        $.common('noteBankPlusManager//bank/findBankListWechat.htm',"GET",bankObj,function (res,resData) {
            console.log('111222',res)
                _this.setData({
                    bankValue:res,
                    bankValueItem:res[_this.data.bankValues].bankName
                })
            },function (err) {
                wx.showToast({
                    title: '查询失败',
                    icon: 'none',
                    duration: 1000
                })
                console.log("获取失败",err)
            }
        )
    },
    query(){
        this.incomeData(1)
    },
    bankQuery(){
        this.bankBalance(2)
    },
    userNameInput(e){
        this.setData({
            userName:e.detail.value
        })
    },
    eventInput(e){
        this.setData({
            bankEvent:e.detail.value
        })
    },
    bankNumerInput(e){
        this.setData({
            bankNum:e.detail.value
        })
    },
    bankSel(){
        console.log("11")
        this.setData({
            dateShow:true,
            bankShow:true
        })
    },
    receiveTypeTap(){
        this.setData({
            dateShow:true,
            receiveTypeShow:true
        })
    },
    receiveTypeChange(e){
        let val = e.detail.value;
        this.setData({
            receiveTypeValuesVal:val
        })
    },
    receiveTypeEns(){
        let val=this.data.receiveTypeValuesVal || 0;
        this.setData({
            receiveTypeValues:val
        })
    },
    startBtn(){
        this.setData({
            dateShow:true,
            startDateSel:true
        })
    },
    endBtn(){
        this.setData({
            dateShow:true,
            endDateSel:true
        })
    },
    bindStartChange(e){
        let val = e.detail.value;
        this.setData({
            startValue:val
        })
    },
    bindEndChange(e){
        let val = e.detail.value;
        this.setData({
            endValue:val
        })
    },
    bankChange(e){
        let val = e.detail.value;
        this.setData({
            bankValues:val
        })
    },
    bindStartEns(){
        let val=this.data.startValue;
        this.setData({
            startYear: this.data.years[val[0]],
            startMonth: $.util.formatNumber(this.data.months[val[1]]),
            startDay: $.util.formatNumber(this.data.days[val[2]]),
            dateShow:false,
            startDateSel:false
        })
    },
    bindEndEns(){
        let val=this.data.endValue;
        this.setData({
            endYear: this.data.years[val[0]],
            endMonth: $.util.formatNumber(this.data.months[val[1]]),
            endDay: $.util.formatNumber(this.data.days[val[2]]),
            endShow:false,
            endDateSel:false
        })
    },
    bankEns(){
        let val=this.data.bankValues,
            bankValue=this.data.bankValue;
        this.setData({
            bankValueItem:bankValue[val].bankName
        })
    },
    payStatusTap(){
        let StateValues=this.data.payStatusValueItem;
        this.setData({
            dateShow:true,
            payStateShow:true,
            payStateNum:0,
            StateValues:StateValues
        })
    },
    payFinishTap(){
        let StateValues=this.data.payFinishValueItem;
        this.setData({
            dateShow:true,
            payStateShow:true,
            payStateNum:1,
            StateValues:StateValues
        })
    },
    isFinishTap(){
        let StateValues=this.data.isFinishValueItem;
        this.setData({
            dateShow:true,
            payStateShow:true,
            payStateNum:2,
            StateValues:StateValues
        })
    },
    payStateChange(e){
        let val=e.detail.value;
        this.setData({
            StateValues:val
        })
    },
    payStateEns(){
        let payStateNum=this.data.payStateNum,
            StateValues=this.data.StateValues,
            payStatusValueItem=this.data.payStatusValueItem,
            payFinishValueItem=this.data.payFinishValueItem,
            isFinishValueItem=this.data.isFinishValueItem;
        if(payStateNum==0){
            this.setData({
                payStatusValueItem:StateValues
            })
        }
        if(payStateNum==1){
            this.setData({
                payFinishValueItem:StateValues
            })
        }
        if(payStateNum==2){
            this.setData({
                isFinishValueItem:StateValues
            })
        }
    },
    paymentQuery(){
        this.otherIncome(1)
    },
    hideShade(){
        this.setData({
            dateShow:false,
            startDateSel:false,
            endDateSel:false,
            bankShow:false,
            payStateShow:false,
            receiveTypeShow:false
        })
    }
})