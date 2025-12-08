<template>
  <view>
    <view class="moneny">
      <view class="money-box">
        <view class="money-common">
          <view class="money-text money-total">{{ userInfo.allyue }}</view>
          <view class="money-text money-title"
                style="font-weight: 400;">余额总数</view>
        </view>
        <view class="money-common"
              style="font-weight: 200; font-size: 36rpx;">
          <view class="money-text"
                style="font-weight: 600;">{{
            userInfo.Points
          }}</view>
          <view class="money-text money-title"
                style="font-size: 26rpx;">可用余额</view>
        </view>
        <view class="money-common">
          <view class="money-text"
                style="font-weight: 600;">{{
            userInfo.FrozenBalance
          }}</view>
          <view class="money-text money-title"
                style="font-size: 26rpx;">冻结余额</view>
        </view>
        <text class="name">余额（元）</text>
      </view>
      <!-- <text class="price">0.00</text> -->
      <!-- <text class="name">余额（元）</text> -->
    </view>
    <view class="czList"
          @click="navTo('/pages/integralPages/onlineRecharge')">
      <view class="left">
        <image src="../../static/vip/mx.png"
               mode=""></image>
        <text>线上充值</text>
      </view>
      <view class="right">
        <image src="../../static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <view class="czList"
          @click="navTo('/pages/integralPages/offlineTransaction')">
      <view class="left">
        <image src="../../static/vip/cz.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <text>线下充值</text>
      </view>
      <view class="right">
        <image src="../../static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <!--    <view class="czList"
          style="border-top: 10rpx solid #F5F5F5;"
          @click="navTo('/pages/integralPages/OTCBusiness/index')">
      <view class="left">
        <image src="../../static/vip/jiaoyi.png"
               mode=""
               style="width: 50rpx;height: 50rpx;"></image>
        <view><text>交易</text><text style="margin-left: 8rpx;color: rgb(167,167,167);">(C2C/OTC)</text></view>
      </view>
      <view class="right">
        <image src="../../static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <view class="czList">
      <view class="left">
        <image src="../../static/vip/jiaoyimingxi.png"
               mode=""
               style="width: 50rpx;height: 50rpx;"></image>
        <text>交易明细</text>
      </view>
      <view class="right">
        <image src="../../static/vip/right.png"
               mode=""></image>
      </view>
    </view> -->
    <view class="czList"
          @click="navTo('/pages/binding/binding')">
      <view class="left">
        <image src="../../static/vip/shoukuan.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <text>我的收款</text>
      </view>
      <view class="right">
        <image src="../../static/vip/right.png"
               mode=""></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: '',
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    //得到用户信息
    async getUserInfo() {
      let param = {
        action: 'GetMemberInfo',
      };
      let res = await this.$api.api.getUserInfo(param);
      if (res.data.status == true) {
        res.data.Data.allyue =
          res.data.Data.Points + res.data.Data.FrozenBalance;
        res.data.Data.allfish =
          res.data.Data.FishCoin + res.data.Data.FrozenFishCoin;
        this.userInfo = res.data.Data;
      }
    },
    navTo(url) {
      uni.navigateTo({
        url: url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.moneny {
  height: 250rpx;
  width: 100%;
  background-color: #7aa6f3;
  position: relative;
  .money-box {
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    // > view {
    //   width: 25%;
    // }
    .money-common {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #ffffff !important;
      .money-text {
        font-size: 30rpx;
        margin-top: 30rpx;
      }
      .money-title {
        font-size: 30rpx;
        font-weight: 700;
      }
      .money-total {
        line-height: 1;
        color: #fff;
        font-weight: 500;
        font-size: 60rpx;
      }
    }
  }
  .price {
    font-size: 80rpx;
    color: #ffffff;
    position: absolute;
    bottom: 20rpx;
    left: 80rpx;
  }
  .name {
    width: 20%;
    align-self: flex-end;
    // position: absolute;
    // right: 40rpx;
    // bottom: 10rpx;
    color: #ffffff;
    font-size: 24rpx;
  }
}
.czList {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50rpx 30rpx;
  border-bottom: 10rpx solid #f5f5f5;
  .left {
    display: flex;
    align-items: center;
    image {
      height: 58rpx;
      width: 58rpx;
      margin-right: 30rpx;
    }
    text {
      font-size: 28rpx;
      color: #2d2d2d;
    }
  }
  .right {
    image {
      height: 34rpx;
      width: 34rpx;
    }
  }
}
</style>
