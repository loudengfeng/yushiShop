<template>
  <view class="about">
    <view class="about-title">
      <image src="../../static/FC.jpg"></image>
      <view class="title-name">雄登康商城</view>
      <!-- <view>版本号</view> -->
    </view>
    <view class="about-footer">
      <view class="footer-box">
        <view class="common"
              @click="handle">
          <view>用户协议</view>
          <view class="right"></view>
        </view>
        <view class="common"
              @click="goUserAgreement">
          <view>隐私政策</view>
          <view class="right"></view>
        </view>
        <view class="common"
              @click="goAboutIntroduce">
          <view>应用介绍</view>
          <view class="right"></view>
        </view>
      </view>
      <view>雄登康有限公司 版权所有</view>
      <view>备案号:浙ICP备20015239号-1</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad() {
    // uni.getSystemInfo({
    //   success: res => {
    //     console.log(res)
    //     this.phoneHeight = res.screenHeight - 100
    //   }
    // })
  },
  methods: {
    handle() {
      uni.navigateTo({
        url: '/pages/set/userAgreement',
      });
    },
    // 去隐私政策页面
    goUserAgreement() {
      uni.navigateTo({
        url: '/pages/set/privacyPolicy',
      });
    },
    // 去应用介绍
    goAboutIntroduce() {
      uni.navigateTo({
        url: '/pages/set/aboutIntroduce',
      });
    },
  },
};
</script>

<style lang="scss">
.about {
  width: 100%;
  .about-title {
    margin: 30rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    > image {
      width: 100rpx;
      height: 100rpx;
    }
    .title-name {
      font-weight: 700;
    }
  }
  .about-footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .footer-box {
      width: 100%;
      .common {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 30rpx;
        margin: 10rpx 0;
        // background-color: #f5f5f5;
        border-bottom: 1rpx solid #f5f5f5;
        .right {
          width: 20rpx;
          height: 20rpx;
          border-top: 1rpx solid #8a8a8a;
          border-right: 1rpx solid #8a8a8a;
          transform: rotate(45deg);
        }
      }
    }
  }
}
</style>
