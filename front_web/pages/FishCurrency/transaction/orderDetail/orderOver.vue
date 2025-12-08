<template>
  <view style="padding: 0 3%;">
    <view class="order-hd"
          @click="jump">
      <view class="order-left">
        <view>订单号：{{detail.FishRecordId}}</view>
        <view class="status">{{getStatus(detail.OrderStatus)}}</view>
      </view>
      <view>
        <image src="/static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <!-- 支付宝 -->
<!--    <view class="moneny-box">
      <view class="price-hd">
        <text>收款金额</text>
        <image src="/static/vip/money.png"
               mode=""></image>
      </view>
      <view class="price">
        <view class="RMB">RMB</view>
        <view style="font-size: 40rpx;">{{detail.Balance}}</view>
      </view>
    </view> -->
    <view class="footer1">
      <view class="box"
            style="flex: 4;">
        <image @click="call(detail.CellPhone)"
               src="/static/vip/phone.png"
               mode=""
               style="margin-right: 40rpx;"></image>
        <image></image>
      </view>
      <view class="box1"
            style="flex:6">
        <view class="ok"
             >已完成</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      detail: ''
    };
  },
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
			let result = res.data.data[0]
			result.Balance = Number(result.Balance).toFixed(2)
	      this.detail = result
	      // console.log(this.overTime)
	    }
	  },
	  getStatus(value){
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
	  },
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
		if(phone == this.detail.SellerUserBindName){
			uni.makePhoneCall({
			  phoneNumber: this.detail.BuyerUserBindName
			});
		}else{
			uni.makePhoneCall({
			  phoneNumber: this.detail.SellerUserBindName
			});
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
