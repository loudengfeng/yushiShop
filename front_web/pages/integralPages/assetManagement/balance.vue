<template>
  <view>
    <view class="reflect">
      <view class="reflect-title reflect-two">
        <view>提现到余额 <text>只能提现整百的倍数</text></view>
        <view class="reflect-box">
          <image src="/static/vip/r2.png"></image>
          <input v-model="money"
                 @blur="moneyBlur"
                 type="number"
                 placeholder="请输入提现金额" />
        </view>
        <view class="reflect-one">当前FC余额 {{available}}, <text @click="withdrawal">全部转入</text></view>
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
      <view @click="submit">确认转出</view>
    </view>
    <view class="box">
      <view @click="goBalanceList">转出记录</view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
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
    // 查询个人数字资产数据
    this.getAssets();
    this.userId = uni.getStorageSync('UserId');
  },
  methods: {
    // 去提现记录页面
    goBalanceList () {
      uni.navigateTo({
        url: '/pages/integralPages/assetManagement/balanceList'
      });
    },
    // 点击提交申请
    async submit () {
      if (this.password.trim() == '' || this.password.trim().length != 6) {
        return this.$api.msg('请输入正确位数的交易密码')
      }
      if (this.money <= 0) {
        return this.$api.msg('请输入大于零的金额')
      }
      if (this.money > this.available) {
        return this.$api.msg('转账金额大于可用FC余额')
      }
      let data = {
        action: 'AddCommissions4',
        userid: this.userId,
        requesttype: 4,
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
      this.money = e.detail.value
    },
    // 点击全部提现
    withdrawal () {
      this.money = this.available
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
  },
  computed: {

  },
};
</script>

<style lang="scss">
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
