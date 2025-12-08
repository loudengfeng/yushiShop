<template>
  <view style="padding: 0 3%;">
    <view class="order-hd"
          @click="jump">
      <view class="order-left">
        <view>订单号：{{ detail.FishRecordId }}</view>
        <view class="status"
              v-if="status == 0">{{
          order[status].status
        }}</view>
        <view class="status"
              v-if="status == 1">等待您付款</view>
        <view class="status"
              v-if="status == 2">等待对方确认</view>
        <view class="status"
              v-if="status == 10">已完成</view>
      </view>
      <view>
        <image src="../../../static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <!-- 支付宝 -->
    <view class="moneny-box">
      <view class="price-hd">
        <!-- <text v-if="status == 0">转账金额</text> -->
        <!-- <image src="/static/vip/money.png" mode="" v-if="status == 0"></image> -->
        <text v-if="status == 0 || status == 1 || status == 2 || status == 10">{{ payWay.AccountName }}</text>
        <image src=""
               mode=""></image>
      </view>
      <view class="price">
        <view class="RMB">RMB</view>
        <view style="font-size: 40rpx;">{{ detail.Balance | numFilter }}</view>
      </view>
    </view>
    <!-- 支付方式 -->
    <view class="pay-box"
          v-if="status == 0 || status == 1 || status == 2">
      <view class="pay-hd">
        <view class="pay-name">
          <view style="font-size: 34rpx;">{{ payWay.AccountName }}</view>
          <view>中国大陆地区</view>
        </view>
        <view>
          <image src=""
                 mode=""></image>
        </view>
      </view>
      <view class="payName">{{ payWay.Account }}</view>
      <view class="pay-hd">
        <view style="font-size: 32rpx; color: #ffffff;">{{ payWay.Name }}</view>
        <image src="/static/vip/ewCode.png"
               mode=""
               @click="alert()"></image>
      </view>
    </view>
    <!-- 提示 -->
    <view class="date-box"
          v-if="status == 0 || status == 1">
      {{ overTime }}
    </view>
    <!-- 付款时间 -->
    <view class="pay-date"
          v-if="status == 3">
      <view class="tip">按上述信息付款后，点击下面已付款按钮剩余时间</view>
      <view class="dated">{{ overTime }}</view>
    </view>
    <view class="tip"
          v-if="status == 0 || status == 1">
      提示:付款时,需先点击支付再去线下付款以避免
      卖方取消,买方线下付款币未到账
    </view>
    <view style="height: 200rpx; width: 100%;"></view>

    <!-- 底部按钮 -->
    <view class="footer1"
          v-if="status == 0 || status == 1 || status == 2">
      <view class="box"
            style="flex: 4;">
        <image src="/static/vip/phone.png"
               mode=""
               style="margin-right: 40rpx;"
               @click="call(detail)"></image>
        <image></image>
      </view>
      <view class="box1"
            style="flex: 6;">
        <view class="cancel"
              v-if="status == 0 || status == 1 "
              @click="cancelBtn">取消</view>
        <view class="ok"
              v-if="status == 0 || status == 1 || status == 2"
              @click="submit">{{ statusText }}</view>
        <view class="ok"
              v-if="status == 2"
              @click="appeal">申诉</view>
      </view>
    </view>
    <uniPopup ref="popup"
              type="center">
      <!-- <image :src="payWay.ImgUrl" mode="" style="height: 750rpx;"></image> -->
      <easyLoadimage :image-src="payWay.ImgUrl"
                     :scroll-top="scrollTop"></easyLoadimage>
    </uniPopup>
  </view>
</template>

<script>
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
  components: {
    uniPopup,
    easyLoadimage
  },
  data() {
    return {
      id: '',
      detail: '',
      payWay: '',
      dateFlag: false,
      status: 1, //0代表未接单1代表已付款 备注1和3差不多
      overTime: '',
      timeDifference: '',
      statusText: '付款',
      order: [{
        status: '等待您付款',
      },
      {
        status: '已付款',
      },
      {
        status: '已付款',
      },
      ],
      scrollTop: 0
    };
  },
  // computed:{
  // 	orderStatus(){
  // 		if(this.detail.OrderStatus == 0){
  // 			return "等待服务商确认"
  // 		}
  // 	}
  // },
  onLoad(options) {
    this.id = options.orderId;
    this.getInfo();
  },
  methods: {
    // 取消
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
        content: '用户的申诉机会只有一次,请慎重考虑',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: './appeal/appeal?id=' + this.detail.FishRecordId,
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    jump() {
      let userID = uni.getStorageSync('UserId');
      if (userID == this.detail.BuyerUserId) {
        uni.navigateTo({
          url: '/pages/FishCurrency/transaction/orderDetail/userInfo/userInfo?userID=' +
            this.detail.SellerUserId,
        });
      } else {
        uni.navigateTo({
          url: '/pages/FishCurrency/transaction/orderDetail/userInfo/userInfo?userID=' +
            this.detail.BuyerUserId,
        });
      }
    },
    alert() {
      this.$refs.popup.open();
    },
    call(detail) {
      let phone = uni.getStorageSync("phone")
      if (phone == detail.SellerUserBindName) {
        console.log(detail.BuyerUserBindName)
        uni.makePhoneCall({
          phoneNumber: detail.BuyerUserBindName
        });
      } else {
        console.log(detail.SellerUserBindName)
        uni.makePhoneCall({
          phoneNumber: detail.SellerUserBindName
        });
      }
    },
    async getInfo() {
      let data = {
        FishRecordId: this.id,
      };
      let StringData = JSON.stringify(data);
      let param = {
        action: 'ReadFishOrderRecord',
        data: StringData,
      };
      let res = await this.$api.api.getFish(param);
      console.log(res);
      if (res.data.status == true) {
        let result = res.data.data;
        this.detail = result[0];
        this.status = this.detail.OrderStatus;
        if (this.status == 1) {
          this.statusText = '付款';
        } else if (this.status == 2) {
          this.statusText = '已付款';
        }
        this.payWay = res.data.sellerPayInformation[0];
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
      }
    },
    // 先调用立刻接单接口，再调支付接口
    submit() {
      if (this.status == 2) return this.$api.msg('已经付过款了');
      if (this.timeDifference < 0) return this.$api.msg('订单已超时');
      uni.showModal({
        title: '提示',
        content: '确定付款?',
        success: (res) => {
          if (res.confirm) {
            this.submits();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    async submits() {
      let data = {
        FishRecordId: this.detail.FishRecordId,
      };
      let StringData = JSON.stringify(data);
      let param = {
        data: StringData,
        action: 'UserCommitProof',
      };
      let res = await this.$api.api.getFish(param);
      if (res.data.status == true) {
        this.statusText = '已付款';
        this.status = 2;
      } else {
        this.$api.msg(res.data.message);
      }
    },
  },
};
</script>

<style lang="scss">
/deep/.uni-popup__wrapper-box {
  height: 750rpx !important;
  width: 600rpx !important;
}

.easy-loadimage {
  height: 100%;
}

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
  height: 244rpx;
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
  margin-top: 14rpx;
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
  background-color: #ffffff;

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
      margin: 0 10rpx;
      color: #2d2d2d;
      width: 162rpx;
      height: 72rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
      border: 1rpx solid #3f3f3f;
      border-radius: 36rpx;
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
