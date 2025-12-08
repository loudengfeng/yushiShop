<template>
  <view>
    <view class="common">
      <view class="common-left">开户姓名</view>
      <view class="common-right">
        <input v-model="uname"
               disabled="true" />
      </view>
    </view>
    <view class="common">
      <view class="common-left">银行名称</view>
      <view class="common-right">
        <input v-model="bankName"
               disabled="true" />
      </view>
    </view>
    <view class="common">
      <view class="common-left">银行卡号</view>
      <view class="common-right">
        <input v-model="cardNum"
               disabled="true"
               type="number" />
      </view>
    </view>
    <view class="common">
      <view class="common-left">预留手机</view>
      <view class="common-right">
        <input v-model="phone"
               disabled="true"
               type="number" />
      </view>
    </view>
    <view class="reflect">
      <view class="reflect-title reflect-two">
        <view>提现FC <text>只能提现整百的倍数</text></view>
        <view class="reflect-box">
          <image src="/static/vip/r2.png"></image>
          <input v-model="money"
                 @blur="moneyBlur"
                 type="number"
                 placeholder="请输入提现金额" />
        </view>
        <view class="reflect-one">当前FC余额 {{available}}, <text @click="withdrawal">全部提现</text></view>
      </view>
      <view class="reflect-title">
        <view class="reflect-box">
          <image src="/static/vip/r1.png"></image>
          <input type="number"
                 v-model="password"
                 placeholder="请输入交易密码" />
        </view>
      </view>
    </view>
    <view class="footer">
      <view @click="submit">提交申请</view>
    </view>
    <view class="box">
      <view @click="goRecord">提现记录</view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      copyImg: '',
      // 开户姓名
      uname: '',
      // 银行名称
      bankName: '',
      // 银行卡号
      cardNum: '',
      // 预留手机号
      phone: '',
      // 查询到的微信数据
      cardObj: '',
      // 根据 查询到的 id 修改数据
      id: '',
      flag: '',
      // 可以提现金额
      available: '',
      // 提现金额输入框绑定的值
      money: '',
      // 交易密码
      password: '',
      userId: ''
    };
  },
  created () {
    // 查询银行卡、微信、支付宝
    this.getQuery();
    // 查询个人数字资产数据
    this.getAssets();
    this.userId = uni.getStorageSync('UserId');
  },
  methods: {
    // 去提现记录页面
    goRecord () {
      uni.navigateTo({
        url: '/pages/integralPages/assetManagement/record'
      });
    },
    // 点击提交申请
    async submit () {
      if (!this.flag) {
        return this.$api.msg('请先绑定银行卡')
      }
      if (this.password.trim() == '' || this.password.trim().length != 6) {
        return this.$api.msg('请输入正确位数的交易密码')
      }
      if (this.money == '') {
        return this.$api.msg('请输入整百的倍数的金额')
      }
      if (this.money > this.available) {
        return this.$api.msg('提现金额大于可用FC余额')
      }
      let data = {
        action: 'AddCommissions3',
        requesttype: 4,
        userid: this.userId,
        commissionmoney: this.money,
        TradePassword: this.password
      }
      let res = await this.$api.api.getMoney(data)
      console.log(res)
      return
      if (res.data.success == true) {
        this.$api.msg(res.data.msg, 2000, true, 'none')
        setTimeout(() => {
          uni.navigateBack({
            delta: 1
          });
        }, 1500);
      } else {
        this.$api.msg(res.data.msg, 2000, true, 'none')
        setTimeout(() => {
          uni.navigateBack({
            delta: 1
          });
        }, 1900);
      }
    },
    // 当金额输入框失去焦点的时候触发
    moneyBlur (e) {
      let num = parseInt(e.detail.value / 100) * 100
      if (num !== 0) {
        return this.money = num
      }
      return this.money = '', this.$api.msg('请输入整百的倍数', 2000, true, 'none');
    },
    // 点击全部提现
    withdrawal () {
      // this.money = this.available
      let num = parseInt(this.available / 100) * 100
      if (num !== 0) {
        return this.money = num
      }
      return this.money = '', this.$api.msg('提现金额未满一百, 无法提现', 2000, true, 'none');
    },
    async getAssets () {
      let data = {
        action: 'ReadBalanceAndFishCoid'
      }
      let res = await this.$api.api.assets(data)
      if (res.data.status == true) {
        res.data.data.forEach(item => {
          item.FishCoin = Number(item.FishCoin).toFixed(2)
        })
      }
      this.available = res.data.data[0].FishCoin
    },
    // 查询银行卡、微信、支付宝
    async getQuery () {
      let result = {};
      result = JSON.stringify(result);
      let datas = {
        action: 'ReadPaymentInformation',
        data: result,
      };
      let res = await this.$api.api.query(datas);
      if (res.data.status == true) {
        var list = res.data.data;
        for (var i = 0; i < list.length; i++) {
          if (list[i].Type == 10) {
            this.cardObj = list[i];
          }
        }
        if (this.cardObj == '') {
          this.flag = false
        } else {
          this.flag = true
        }
        this.uname = this.cardObj.Name;
        this.bankName = this.cardObj.AccountName;
        this.cardNum = this.cardObj.Account;
        this.phone = this.cardObj.Tel;
        this.img = this.cardObj.ImgUrl;
        this.id = this.cardObj.ID;
        this.copyImg = this.cardObj.ImgUrl;
      }
    },
  },
  computed: {

  },
};
</script>

<style lang="scss">
.common {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  line-height: 60rpx;
  .common-left {
    margin-right: 10rpx;
  }
  .common-right {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1rpx solid #b8b8b8;
    border-radius: 8rpx;
    padding: 20rpx;
    .placeholder-common {
      font-size: 28rpx;
    }
    input {
      width: 100%;
    }
    image {
      width: 40rpx;
      height: 40rpx;
    }
  }
}
.reflect {
  padding: 20rpx 30rpx;
  .reflect-title {
    .reflect-box {
      display: flex;
      border-bottom: 1rpx solid #c2c2c2;
      padding: 30rpx 0;
      > image {
        width: 46rpx;
        height: 46rpx;
        margin-right: 30rpx;
      }
    }
    .reflect-one {
      margin: 20rpx 0;
      font-size: 26rpx;
      color: #bbbbbb;
      > text {
        font-size: 28rpx;
        color: #00c09f;
        margin-left: 30rpx;
      }
    }
  }
  .reflect-two {
    > view {
      > text {
        margin-left: 20rpx;
      }
    }
  }
}
.footer {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
  > view {
    width: 648rpx;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    border-radius: 10rpx;
    background-color: #223041;
    font-size: 32rpx;
    color: #fff;
    font-weight: 600;
  }
}
.box {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
  > view {
    width: 648rpx;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    border-radius: 10rpx;
    background-color: #223041;
    font-size: 32rpx;
    color: #fff;
    font-weight: 600;
  }
}
</style>
