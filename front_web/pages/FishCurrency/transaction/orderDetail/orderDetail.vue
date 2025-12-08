<template>
  <view style="padding: 30rpx 3%;">
    <view class="order-list"
          @click="jump">
      <view class="left">服务商：</view>
      <view class="right">
        <image src="/static/missing-face.png"
               mode=""
               style="width: 54rpx;height: 54rpx;"></image>
        <text>15151515151</text>
        <image src="/static/vip/right.png"
               mode=""
               style="width: 28rpx;height: 38rpx;"></image>
      </view>
    </view>
    <view class="order-list">
      <view class="left">订单号：</view>
      <view class="right">
        200000000000
      </view>
    </view>
    <view class="order-list">
      <view class="left">时间：</view>
      <view class="right">
        2020-04-13 13:11:33
      </view>
    </view>
    <view class="order-list">
      <view class="left">单价（CNY/FC）：</view>
      <view class="right">
        1.05
      </view>
    </view>
    <view class="order-list">
      <view class="left">总金额（CNY）：</view>
      <view class="right">
        10000
      </view>
    </view>
    <view class="order-list">
      <view class="left">总数量：</view>
      <view class="right">
        2000
      </view>
    </view>
    <view class="order-list">
      <view class="left">状态：</view>
      <view class="right">
        已完成
      </view>
    </view>

    <view class="pay-box">
      <view class="pay-hd">
        <view class="pay-name">
          <view style="font-size: 34rpx;">支付宝</view>
          <view>中国大陆地区</view>
        </view>
        <view>
          <image src="/static/vip/zfb.png"
                 mode=""></image>
        </view>
      </view>
      <view class="payName">18888888888</view>
      <view class="pay-hd">
        <view style="font-size: 32rpx;color: #FFFFFF;">李梅</view>
        <image src="/static/vip/ewCode.png"
               mode=""></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {
    jump() {
      uni.navigateTo({
        url: "./userInfo/userInfo"
      })
    }
  }
}
</script>

<style lang="scss">
.order-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 28rpx;
  height: 80rpx;

  .left {
    color: #223041;
  }

  .right {
    color: #5e5e5e;
    display: flex;
    align-items: center;

    text {
      margin-left: 15rpx;
      margin-right: 15rpx;
    }
  }
}
.pay-box {
  height: 305rpx;
  width: 100%;
  background-color: rgb(75, 122, 223);
  border-radius: 15rpx;
  margin-top: 48rpx;
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
</style>
