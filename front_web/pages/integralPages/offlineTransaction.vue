<template>
  <view>
    <view class="offline-hd">
      <view class="offline-hd-left">
        <view class="offline-name">
          <image src="../../static/vip/pay2.png"
                 mode=""></image>
          <text>微信</text>
        </view>
        <view class="code">
          <image src="../../static/weixin.png"></image>
        </view>
      </view>
      <view class="offline-hd-right">
        <view class="offline-name">
          <image src="../../static/vip/pay3.png"
                 mode=""></image>
          <text>支付宝</text>
        </view>
        <view class="code">
          <image src="../../static/zhifubaoReceivables.jpg"></image>
        </view>
      </view>
    </view>
    <view class="yh-code">
      <image src="../../static/vip/pay4.png"
             mode=""></image><text>银行卡</text>
    </view>
    <view class="yh-detail">
      <view>银行账户：201000239076778</view>
      <view>单位名称：诸暨市雄登康网络科技有限公司</view>
      <view>开户银行：浙江诸暨农村商业银行-城中支行浣江分理处</view>
    </view>
    <view class="offline-btn">
      <view @click="navTo('/pages/integralPages/uploadVoucher')">上传凭证</view>
      <view @click="navTo('./result')">查看结果</view>
      <view @click="navTo('./rechargeDetail')">充值明细</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    navTo(url) {
      uni.navigateTo({
        url: url,
      });
    },
  },
};
</script>

<style lang="scss">
.offline-hd {
  display: flex;
  justify-content: space-between;
  padding: 40rpx 24rpx;
  .offline-name {
    display: flex;
    align-items: center;
    image {
      width: 40rpx;
      height: 37rpx;
      margin-right: 10rpx;
    }
    text {
      color: #5e5e5e;
      font-size: 26rpx;
    }
  }
  .code {
    height: 500rpx;
    width: 337rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    font-size: 36rpx;
    color: #919191;
    border-radius: 9rpx;
    margin-top: 20rpx;
    > image {
      width: 100%;
      height: 100%;
    }
  }
}
.yh-code {
  display: flex;
  align-items: center;
  padding-left: 24rpx;
  image {
    margin-right: 20rpx;
    height: 28rpx;
    width: 45rpx;
  }
  text {
    color: #5e5e5e;
    font-size: 26rpx;
  }
}
.yh-detail {
  height: 348rpx;
  width: 697rpx;
  background-color: #223041;
  border-radius: 9px;
  margin: 40rpx auto 10rpx;
  padding: 54rpx 35rpx;
  view {
    color: #ffffff;
    font-size: 28rpx;
    margin-bottom: 10rpx;
  }
}
.offline-btn {
  padding: 60rpx 40rpx 40rpx 40rpx;
  display: flex;
  justify-content: space-between;
  view {
    height: 70rpx;
    width: 200rpx;
    line-height: 70rpx;
    text-align: center;
    background-color: #223041;
    border-radius: 10rpx;
    font-size: 28rpx;
    color: #ffffff;
  }
}
</style>
