<template>

  <view class="find_psw">
    <form @submit="formSubmit"
          class="form1">
      <input type="number"
             placeholder="请输入手机号码"
             maxlength=11
             class="phone1"
             v-model="phone1" />
      <input type="password"
             placeholder="请输入登录密码"
             class="newpassword1"
             v-model="newpassword1" />
      <input type="password"
             placeholder="确认密码"
             class="newpassword2"
             v-model="newpassword2" />
      <view class="code">
        <input type="number"
               maxlength="6"
               v-model="code"
               placeholder="请输入验证码"
               class="code1" /><text class="getcode"
              @click="send">{{getcode}}</text>
      </view>
      <input type="number"
             class="newpassword2"
             disabled="true"
             v-model="ID" />
      <!-- <view class="treaty">
                <label class="radio"><radio value="r1" :checked="agree" @click="agreelaw" color="#0A94ED" style="transform: scale(0.65);"/><text style="display: inline;">同意服务使用协议</text> <view style="color: #0A94ED; display: inline;" @click="agree_con">用户注册协议</view></label>
            </view> -->
      <button class="finish"
              formType="submit">完成</button>
    </form>
  </view>
</template>

<script>
export default {
  data () {
    return {
      // agree:true,//是否同意协议
      phone1: '',//手机号
      newpassword1: '',//登录密码
      newpassword2: '',//确认密码
      getcode: '获取验证码',
      countNum: 60,//倒计时
      timer: null,
      code: '',//验证码
      type: '',
      ID: '',
      Referral2Id: ''
    };
  },
  onLoad () {
    this.ID = uni.getStorageSync('Referral2Id')
    // this.type = this.$status.document_type.register;
  },
  methods: {
    // agreelaw:function(){
    // 	this.agree = !this.agree
    // },
    // agree_con(){
    // 	uni.navigateTo({
    // 		url: '../Agreement/Agreement?type='+this.type
    // 	});
    // },
    async send () {
      var that = this;
      var myreg = /^[1][1,2,3,4,5,7,8,9][0-9]{9}$/;
      if (!myreg.test(this.phone1)) {
        uni.showToast({ title: '请正确填写手机号码', icon: "none" });
        return false;
      }
      if (this.getcode != '获取验证码' && this.getcode != '重新发送') { return; }
      this.getcode = "发送中...";
      // 倒计时
      this.countNum = 60;
      this.timer = setInterval(function () { this.countDown(); }.bind(this), 1000);
      let data = {
        phone: this.phone1,
        action: 'GetCode'
      }
      let res = await this.$api.api.sendcode(data);
      uni.hideLoading();
      if (res.data.status == true) {
        uni.showToast({
          title: '发送成功',
        })
      }
      else {
        uni.showToast({ title: res.data.message, icon: "none" });
      }
    },
    countDown: function () {
      if (this.countNum < 1) {
        clearInterval(this.timer);
        this.getcode = "重新发送";
        return;
      }
      this.countNum--;
      this.getcode = this.countNum + '秒重发';
    },
    formSubmit: function (e) {
      var that = this
      if (this.phone1 == '') {
        uni.showToast({ title: '手机号码不能为空', icon: "none" });
        return false;
      }
      if (!/^[1][1,2,3,4,5,7,8,9][0-9]{9}$/.test(this.phone1)) {
        uni.showToast({ title: '请正确填写手机号码', icon: "none" });
        return false;
      }
      if (this.newpassword1.length < 6) {
        uni.showToast({ title: '密码最短为 6 个字符', icon: "none" });
        return false;
      }
      if (this.newpassword1 != this.newpassword2) {
        uni.showToast({ title: '两次输入的密码不一样', icon: "none" });
        return false;
      }
      if (this.code == '') {
        uni.showToast({ title: '验证码不能为空', icon: "none" });
        return false;
      }

      uni.showLoading({
        title: '加载中...',
        mask: true
      });
      // if(this.agree==false){
      // 	uni.showToast({ title: '请同意服务协议', icon : "none"});
      // 	return false;
      // }
      let data = {
        phone: this.phone1,
        code: this.code,
        password: this.newpassword1,
        ReferralUserId: this.ID,
        action: 'RegisterMember',
        openId: uni.getStorageSync('openId')
      }
      this.$api.api.register(data).then((res) => {
        if (res.data.status == true) {
          uni.setStorageSync('phone', this.phone1)
          uni.showToast({
            title: '注册成功',
            icon: 'none'
          });
          uni.hideLoading();
          uni.navigateBack()
        } else {
          uni.hideLoading();
          uni.showToast({ title: res.data.message, icon: "none" });
        }
      })
    }
  }
}
</script>

<style>
button::after {
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  outline: none;
}
.find_psw {
  padding-top: 50upx;
  position: relative;
  overflow-y: hidden;
}
.phone1,
.newpassword1,
.newpassword2 {
  font-size: 28upx;
  height: 100upx;
  width: 668upx;
  margin-left: 52upx;
  border-bottom: 2upx solid rgba(220, 220, 220, 1);
}
.code {
  font-size: 28upx;
  height: 100upx;
  width: 668upx;
  margin-left: 52upx;
  border-bottom: 2upx solid rgba(220, 220, 220, 1);
  position: relative;
}
.code1 {
  height: 100upx;
  width: 60%;
  position: absolute;
  font-size: 28rpx;
}
.getcode {
  width: 160upx;
  height: 55upx;
  line-height: 48upx;
  text-align: center;
  font-size: 26upx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #323f6c;
  border: 2px solid #323f6c;
  border-radius: 10px;
  position: absolute;
  right: 12upx;
  top: 27.5upx;
}
.treaty {
  font-size: 24upx;
  margin-top: 30upx;
  margin-left: 52upx;
}
.finish {
  height: 88upx;
  width: 690upx;
  margin: 480upx auto 0;
  border-radius: 40upx;
  background-color: #323f6c;
  color: #fff;
}
</style>
