<template>
  <view class="container">
    <view class="list-cell b-b m-t"
          @click="navTo('/pages/address/address')"
          hover-class="cell-hover"
          :hover-stay-time="50">
      <text class="cell-tit">地址管理</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view class="list-cell b-b m-t"
          hover-class="cell-hover"
          @click="navTo('/pages/set/accountSecurity')"
          :hover-stay-time="50">
      <text class="cell-tit">账户安全</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view class="list-cell b-b m-t"
          hover-class="cell-hover"
          @click="navTo('/pages/set/payPsw')"
          :hover-stay-time="50">
      <text class="cell-tit">设置支付密码</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view class="list-cell b-b m-t"
          hover-class="cell-hover"
          @click="navTo('/pages/public/resetPay')"
          :hover-stay-time="50">
      <text class="cell-tit">重置支付密码</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view class="list-cell b-b"
          @click="navTo('/pages/set/about')"
          hover-class="cell-hover"
          :hover-stay-time="50">
      <text class="cell-tit">关于我们</text>
      <text class="cell-more yticon icon-you"></text>
    </view>
    <view class="list-cell log-out-btn"
          @click="toLogout">
      <text class="cell-tit">退出登录</text>
    </view>
  </view>
</template>

<script>
import {
  mapMutations
} from 'vuex';
export default {
  data() {
    return {
      hasLogin: '',
    };
  },
  onShow() {
    this.hasLogin = uni.getStorageSync('token')
  },
  methods: {
    ...mapMutations(['logout']),

    navTo(url) {
      if (!this.hasLogin) {
        url = '/pages/public/login';
      }
      uni.navigateTo({
        url,
      });
    },
    //退出登录
    toLogout() {
      uni.showModal({
        content: '确定要退出登录么',
        success: (e) => {
          if (e.confirm) {
            let data = {
              action: 'LoginOut'
            }
            this.$api.api.logout(data).then((res) => {
              if (res.data.status == true) {
                this.$store.commit('logout')
                uni.removeStorageSync('userInfo')
                setTimeout(() => {
                  uni.navigateBack();
                }, 200)
              }
            })
          }
        }
      });
    },
    //switch
    switchChange(e) {
      let statusTip = e.detail.value ? '打开' : '关闭';
      this.$api.msg(`${statusTip}消息推送`);
    },

  }
}
</script>

<style lang='scss'>
page {
  background: $page-color-base;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.list-cell {
  display: flex;
  align-items: baseline;
  padding: 20upx $page-row-spacing;
  line-height: 60upx;
  position: relative;
  background: #fff;
  justify-content: center;

  &.log-out-btn {
    margin-top: 40upx;

    .cell-tit {
      color: $uni-color-primary;
      text-align: center;
      margin-right: 0;
    }
  }

  &.cell-hover {
    background: #fafafa;
  }

  &.b-b:after {
    left: 30upx;
  }

  &.m-t {
    /* margin-top: 16upx; */
  }

  .cell-more {
    align-self: baseline;
    font-size: $font-lg;
    color: $font-color-light;
    margin-left: 10upx;
  }

  .cell-tit {
    flex: 1;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    margin-right: 10upx;
  }

  .cell-tip {
    font-size: $font-base;
    color: $font-color-light;
  }

  switch {
    transform: translateX(16upx) scale(0.84);
  }
}
</style>
