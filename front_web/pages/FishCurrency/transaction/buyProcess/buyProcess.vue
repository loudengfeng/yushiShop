<template>
  <view style="padding: 0 3%;">
    <view class="order-hd"
          @click="jump">
      <view class="order-left">
        <view>订单号：{{detail.FishOrderId}}</view>
        <view class="status">{{detail.OrderStatus | OrderStatus}}</view>
      </view>
      <view>
        <image src="/static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <!-- 支付宝 -->
    <view class="moneny-box">
      <view class="price-hd">
        <text>收款金额</text>
        <image src="/static/vip/money.png"
               mode=""></image>
      </view>
      <view class="price">
        <view class="RMB">RMB</view>
        <view style="font-size: 40rpx;">{{detail.Balance}}</view>
      </view>
    </view>
    <view class="date-box"
          v-if="status != 12 && status != 10">
      {{overTime}}
    </view>
    <!-- 支付方式 -->
    <!-- 		<view class="pay-box" v-if="status == 1 || status == 2 || status == 3">
			<view class="pay-hd">
				<view class="pay-name">
					<view style="font-size: 34rpx;">支付宝</view>
					<view>中国大陆地区</view>
				</view>
				<view><image src="/static/vip/zfb.png" mode=""></image></view>
			</view>
			<view class="payName">18888888888</view>
			<view class="pay-hd">
				<view style="font-size: 32rpx;color: #FFFFFF;">李梅</view>
				<image src="/static/vip/ewCode.png" mode=""></image>
			</view>
		</view> -->
    <!-- 提示 -->
    <!-- 付款时间 -->
    <!-- <view class="pay-date" v-if="status == 1 || status == 3">
			<view class="tip">按上述信息付款后，点击下面已付款按钮剩余时间</view>
			<view class="dated">29:40:33</view>
		</view> -->
    <view class="tip"
          v-if="false">
      提示:付款时,需先点击支付再去线下付款以避免
      卖方取消,买方线下付款币未到账
    </view>

    <!-- 底部按钮 -->
    <view class="footer1">
      <view class="box"
            v-if="status != 10"
            style="flex: 4;">
        <image @click="call"
               src="/static/vip/phone.png"
               mode=""
               style="margin-right: 40rpx;"></image>
        <image></image>
      </view>
      <view class="box1"
            style="flex:6">
        <view class="cancel"
              v-if="status == 0 || status == 1"
              @click="cancelBtn">取消</view>
        <!-- <view class="ok"
              @click="confirm">{{text}}</view> -->
        <view class="ok"
              @click="isConfirmCollection"
              v-if="status != 12">{{collection}}</view>
        <view class="ok"
              v-if="status == 2"
              @click="appeal">申诉</view>
        <view class="ok"
              v-if="status == 12">申诉中</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      collection: '确认收款',
      id: '',
      detail: '',
      dateFlag: false,
      status: 1, //0代表未接单1代表已付款 备注1和3差不多
      overTime: '',
      text: '确认接单',
      timeDifference: null,
      order: [{
        status: '等待服务商确认接单',
        name: "转账金额",
        image: '/static/vip/money.png',
        price: 100,
      },
      {
        status: '等待您付款',
        name: "支付宝",
        image: '/static/vip/pay3.png',
        price: 100,
      },
      {
        status: '已完成',
        name: "支付宝",
        image: '/static/vip/pay3.png',
        price: 100,
      },
      {
        status: '等待服务商确认',
        name: "支付宝",
        image: '/static/vip/pay3.png',
        price: 100,
      },
      ],
    };
  },
  // computed:{
  // 	orderStatus(){
  // 		if(this.detail.OrderStatus == 0){
  // 			return "等待服务商确认"
  // 		}
  // 	}
  // },
  // onBackPress(e) {
  //   if (e.from == 'backbutton') {
  //     uni.navigateBack({
  //       delta: 1
  //     });
  //   }
  // },
  onLoad(options) {
    this.id = options.orderId
    this.getInfo()
  },
  methods: {
    //取消
    cancelBtn() {
      uni.showModal({
        title: '提示',
        content: '取消会影响您的信用分',
        success: (res) => {
          if (res.confirm) {
            this.getCancel()
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    },
    async getCancel() {
      let data = {
        FishRecordId: this.detail.FishRecordId
      }
      let StringData = JSON.stringify(data)
      let param = {
        action: 'CancelFishRecord',
        data: StringData
      }
      let res = await this.$api.api.getFish(param)
      if (res.data.status == true) {
        this.$api.msg("取消成功")
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/FishCurrency/transaction/transaction'
          });
        }, 500)
      }
    },
    // 申诉
    appeal() {
      uni.showModal({
        title: '提示',
        content: '用户的申诉机会只有一次，请慎重考虑',
        success: res => {
          if (res.confirm) {
            uni.navigateTo({
              url: '/pages/FishCurrency/transaction/appeal/appeal?id=' + this.detail.FishRecordId
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    isConfirmCollection() {
      if (this.timeDifference < 0) return this.$api.msg("订单已超时")
      if (this.collection == "已收款") return
      uni.showModal({
        content: '确认收款?',
        success: (res) => {
          if (res.confirm) {
            if (this.collection == '已确认收款') {
              this.$api.msg('已确认收款,请勿重复点击')
            } else {
              this.confirmCollection()
            }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    // 确认收款
    async confirmCollection() {
      let result = {
        FishRecordId: this.detail.FishRecordId
      }
      result = JSON.stringify(result)
      let data = {
        data: result,
        action: 'UserConfirmFishRecord'
      }
      let res = await this.$api.api.fcDistributionRecord(data)
      console.log(res)
      if (res.data.status == true) {
        this.value = 10
        this.collection = '已收款'
        this.status = 10
      }
    },
    // // 确认接单
    // async confirm() {
    //   this.state = uni.getStorageSync('state')
    //   if (this.state == 2) {
    //     return this.$api.msg('请勿重复提交')
    //   }
    //   let result = {
    //     FishRecordId: this.detail.FishRecordId
    //   }
    //   result = JSON.stringify(result)
    //   let data = {
    //     action: 'InitiatorRecvivingFishRecord',
    //     data: result
    //   }
    //   let res = await this.$api.api.fcDistributionRecord(data)
    //   if (res.data.status == true) {
    //     this.text = '已接单'
    //     this.detail.OrderStatus = 1
    //     this.state = 2
    //     uni.setStorageSync('state', this.state)
    //   }
    // },
    jump() {
      let userID = uni.getStorageSync('UserId')
      if (userID == this.detail.BuyerUserId) {
        uni.navigateTo({
          url: '/pages/FishCurrency/transaction/orderDetail/userInfo/userInfo?userID=' + this.detail.SellerUserId
        })
      } else {
        uni.navigateTo({
          url: '/pages/FishCurrency/transaction/orderDetail/userInfo/userInfo?userID=' + this.detail.BuyerUserId
        })
      }
    },
    call() {
      let phone = uni.getStorageSync("phone")
      if (phone == this.detail.SellerUserBindName) {
        uni.makePhoneCall({
          phoneNumber: this.detail.BuyerUserBindName
        });
      } else {
        uni.makePhoneCall({
          phoneNumber: this.detail.SellerUserBindName
        });
      }
    },
    async getInfo() {
      let data = {
        FishRecordId: this.id
      }
      let StringData = JSON.stringify(data)
      let param = {
        action: "ReadFishOrderRecord",
        data: StringData
      }
      let res = await this.$api.api.getFish(param)
      if (res.data.status == true) {
        let result = res.data.data
        result[0].Balance = Number(result[0].Balance).toFixed(2)
        this.detail = result[0]
        this.status = this.detail.OrderStatus
        // this.status = this.detail.OrderStatus
        let now = new Date().getTime();
        let finsh = new Date(result[0].LimitDate).getTime();
        var timeDifference = finsh - now;
        this.timeDifference = timeDifference;
        this.overTime = this.$util.TimeTo(this.timeDifference);
        var timer = setInterval(() => {
          this.timeDifference = this.timeDifference - 1000
          this.overTime = this.$util.TimeTo(this.timeDifference);
          if (this.timeDifference <= 0) {
            clearInterval(timer)
            uni.reLaunch({
              url: '/pages/FishCurrency/transaction/transaction'
            })
          }
        }, 1000)
        if (this.detail.OrderStatus == 10) {
          this.collection = '已收款'
        }
        console.log(this.detail)
        // console.log(this.overTime)
      }
    }
  },
  filters: {
    OrderStatus(value) {
      if (value == 0) {
        return '等待对方付款';
      } else if (value == 1) {
        return '等待对方付款';
      } else if (value == 2) {
        return '对方已支付';
      } else if (value == 10) {
        return '已完成';
      } else if (value == 11) {
        return '已取消';
      } else if (value == 12) {
        return '申诉中';
      } else if (value == 13) {
        return '拒绝接单';
      } else if (value == 14) {
        return '接单超时';
      } else if (value == 15) {
        return '已关闭';
      } else if (value == 20) {
        return '申诉成功';
      } else if (value == 21) {
        return '申诉失败';
      }
    }
  }
}
</script>

<style lang="scss">
.pay-date {
  width: 70%;
  margin: 50rpx auto;

  view {
    text-align: center;
  }

  .dated {
    font-size: 44rpx;
    color: #2d2d2d;
    font-weight: 600;
  }
}

.pay-box {
  height: 305rpx;
  width: 100%;
  background-color: rgb(75, 122, 223);
  border-radius: 15rpx;
  margin-top: 28rpx;
  padding: 30rpx;

  .pay-hd {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pay-name {
      color: #ffffff;
      font-size: 28rpx;
    }

    image {
      height: 56rpx;
      width: 56rpx;
    }
  }

  .payName {
    margin-top: 35rpx;
    color: #ffffff;
  }
}

.order-hd {
  height: 160rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  image {
    width: 38rpx;
    height: 48rpx;
  }

  .order-left {
    font-size: 28rpx;
    color: #223041;

    .status {
      font-size: 28rpx;
      color: #223041;
      font-weight: 600;
    }
  }
}

.moneny-box {
  width: 100%;
  height: 180rpx;
  border-radius: 14rpx;
  background-color: #223041;
  color: #ffffff;
  padding: 30rpx;

  .price-hd {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;

    image {
      height: 56rpx;
      width: 56rpx;
    }
  }

  .price {
    display: flex;
    justify-content: center;
    align-items: center;

    .RMB {
      height: 37rpx;
      width: 80rpx;
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1rpx solid #ffffff;
      margin-right: 20rpx;
    }
  }
}

.date-box {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35rpx;
  font-weight: 600;
  width: 100%;
  height: 305rpx;
  background-color: #223041;
  border-radius: 14rpx;
  margin-top: 28rpx;
  color: #ffffff;
  padding: 0 30rpx;
}

.tip {
  color: #737373;
  font-size: 22rpx;
  text-align: center;
  margin-top: 104rpx;
}

.footer {
  position: fixed;
  width: 70%;
  left: 50%;
  display: flex;
  justify-content: space-between;
  margin-left: -35%;
  bottom: 100rpx;

  image {
    height: 84rpx;
    width: 84rpx;
  }
}

.footer1 {
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 60rpx;
  width: 100%;

  .box {
    justify-content: center;
    align-items: center;
    display: flex;
  }

  .box1 {
    justify-content: center;
    align-items: center;
    display: flex;

    view {
      color: #2d2d2d;
      width: 162rpx;
      height: 72rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
      border: 1rpx solid #3f3f3f;
      border-radius: 36rpx;
      margin: 0 10rpx;
    }

    .cancel {
      margin-right: 30rpx;
    }
  }

  image {
    height: 84rpx;
    width: 84rpx;
  }
}
</style>
