<template>
  <view class="container">
    <!-- <view class="left-bottom-sign"></view> -->
<!--    <view class="back-btn yticon icon-zuojiantou-up"
          @click="navBack"></view> -->
    <!-- <view class="right-top-sign"></view> -->
    <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
    <view class="wrapper">
	  	<view style="display: flex;justify-content: center;width: 100%;margin-top: 160upx;margin-bottom: 160upx;"><img src="../../static/newShop/logoA.png" mode="" class="imgLogo"></img></view>
      <!--      <view class="welcome">
        欢迎回来！
      </view> -->
      <view class="input-content">
        <view class="input-item">
          <text class="tit">手机号码</text>
          <input type="text"
                 :value="mobile"
                 placeholder="请输入手机号码"
                 maxlength="11"
                 data-key="mobile"
                 @input="inputChange" />
        </view>
        <view class="input-item">
          <text class="tit">密码</text>
          <input type="mobile"
                 value=""
                 placeholder="请输入密码"
                 placeholder-class="input-empty"
                 maxlength="20"
                 password
                 data-key="password"
                 @input="inputChange" />
        </view>
      </view>
      <button class="confirm-btn"
              @click="toLogin"
              :disabled="logining">
        登录
      </button>
	  <view style="display: flex;align-items: center;justify-content: center;margin-top: 30upx;">
		  <checkbox-group @change="changeChecked"><checkbox :checked="checked" value="checked" /></checkbox-group>已阅读并同意<text style="color: #fe5c2d;" @click="navTo('/pages/set/userAgreement')">《付费会员协议》</text>与<text style="color: #fe5c2d;" @click="navTo('/pages/set/privacyPolicy')">《隐私协议》</text></view>
<!--      <view class="forget-section"
            @click="forgetPassword">
        忘记密码?
      </view> -->
    </view>
<!--    <view class="register-section">
      还没有账号?
      <text @click="toRegist">马上注册</text>
    </view> -->
  </view>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
	  checked: false,
      mobile: '',
      password: '',
      logining: false,
      ID: ''
    };
  },
  methods: {
	  changeChecked(e){
		  this.checked = e.target.value[0] ? true : false
	  },
	navTo(url){
		uni.navigateTo({
			url: url
		})
	},
	
    // 跳转忘记密码页面
    forgetPassword() {
      uni.navigateTo({
        url: `./forgetPassword`,
      });
    },
    ...mapMutations(['login']),
    inputChange(e) {
      const key = e.currentTarget.dataset.key;
      this[key] = e.detail.value;
    },
    navBack() {
      uni.navigateBack();
    },
    toRegist() {
      // this.$api.msg('去注册');
      uni.navigateTo({
        url: `./register`,
      });
    },
    async toLogin() {
      var myreg=/^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;
      if (!myreg.test(this.mobile)){
      	uni.showToast({ title: '请正确填写手机号码', icon : "none"});
          return false;
      }
	  if(!this.password){
		  uni.showToast({ title: '请输入密码', icon : "none"});
		  return
	  }
	  if(!this.checked){
	  	uni.showToast({ title: '请阅读协议，并勾选', icon : "none"});
	  	return
	  }
      let data = {
		"username": this.mobile,
		"password": this.password
      };
      let res = await this.$api.api.login(data);
      if (res.code == '000000') {
        uni.setStorageSync('token', res.data.token)
		uni.setStorageSync('mobile',this.mobile)
		uni.setStorageSync('identified',res.data.identified)
        this.$api.msg('登录中...')
		if(res.data.identified){
			setTimeout(function () {
			  uni.switchTab({
				url: `../index/index`,
			  });
			}, 800)	
		}else{
			setTimeout(function () {
			  uni.navigateTo({
				url: `/pages/user/userCertification`,
			  });
			}, 800)	
		}
      } else {
        this.$api.msg('手机号码或密码错误');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ uni-checkbox-group{
	width: auto;
}
page {
  background: #fff;
}
.container {
  padding-top: 100rpx;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  .imgLogo{
	  width: 218upx;
	  height: 218upx;
  }
}
.wrapper {
  position: relative;
  z-index: 90;
  background: #fff;
  padding-bottom: 40upx;
}
.back-btn {
  position: absolute;
  left: 40upx;
  z-index: 9999;
  padding-top: var(--status-bar-height);
  top: 40upx;
  font-size: 40upx;
  color: $font-color-dark;
}
.left-top-sign {
  font-size: 120upx;
  color: $page-color-base;
  position: relative;
  left: -16upx;
}
.right-top-sign {
  // position: absolute;
  // top: 80upx;
  // right: -30upx;
  // z-index: 95;
  &:before,
  &:after {
    display: block;
    content: "";
    width: 400upx;
    height: 80upx;
    background: #b4f3e2;
  }
  &:before {
    transform: rotate(50deg);
    border-radius: 0 50px 0 0;
  }
  &:after {
    position: absolute;
    right: -198upx;
    top: 0;
    transform: rotate(-50deg);
    border-radius: 50px 0 0 0;
    /* background: pink; */
  }
}
// .left-bottom-sign {
//   position: absolute;
//   left: -270upx;
//   bottom: -320upx;
//   border: 100upx solid #d0d1fd;
//   border-radius: 50%;
//   padding: 180upx;
// }
.welcome {
  position: relative;
  left: 50upx;
  top: -90upx;
  font-size: 46upx;
  color: #555;
  text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
  padding: 0 60upx;
}
.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30upx;
  background: $page-color-light;
  height: 120upx;
  border-radius: 4px;
  margin-bottom: 50upx;
  &:last-child {
    margin-bottom: 0;
  }
  .tit {
    height: 50upx;
    line-height: 56upx;
    font-size: $font-sm + 10upx;
    color: $font-color-base;
  }
  input {
    height: 60upx;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    width: 100%;
  }
}

.confirm-btn {
  width: 630upx;
  height: 76upx;
  line-height: 76upx;
  border-radius: 50px;
  margin-top: 70upx;
  background: #fe5c2d;
  color: #fff;
  font-size: $font-lg;
  &:after {
    border-radius: 100px;
  }
}
.forget-section {
  font-size: $font-sm + 2upx;
  color: #606060;
  text-align: center;
  margin-top: 40upx;
}
.register-section {
  position: absolute;
  left: 0;
  bottom: 50upx;
  width: 100%;
  font-size: $font-sm + 2upx;
  color: $font-color-base;
  text-align: center;
  text {
    color: #606060;
    margin-left: 10upx;
  }
}
// 微信登录授权按钮
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300rpx;
  padding: 0;
  background-color: #fff;
  border: 1rpx solid #eee;
  &:after {
    width: 0;
    height: 0;
  }
  image {
    width: 50rpx;
    height: 50rpx;
    margin-right: 30rpx;
  }
}
</style>
