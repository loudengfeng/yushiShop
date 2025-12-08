<template>
  <view class="recharge-wrap">
    <view class="recharge-wrap-hd">
      <view class="wrapper"
            v-for="(item, index) in payWay"
            :key="index"
            :class="item.id == current ? 'chooseClass' : ''"
            @click="choose(item.id)">
        <image :src="item.url"
               mode=""></image>
        <text>{{ item.name }}</text>
      </view>
    </view>
    <view class="local"><input type="number"
             v-model="money"
             @input="changeMoney"
             placeholder="请输入充值金额 :" /><text class="fc">CNY</text></view>
    <view class="submit"
          @click="submit">充值</view>
    <!-- 占位符 -->
    <view class="full"></view>
    <view class="czList"
          @click="jump('./rechargeDetail')">
      <view class="left">
        <image src="../../static/vip/mingxi-2.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <text>充值明细</text>
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
  data () {
    return {
      payWay: [
        {
          id: 0,
          name: '支付宝',
          url: '../../static/vip/pay3.png',
          checked: true,
        },
        {
          id: 1,
          name: '微信',
          url: '../../static/vip/pay2.png',
          cheked: false,
        },
      ],
      // 默认选中项目
      current: 0,
      // 金额输入框绑定的值
      money: '',
      isWeixin: ''
    };
  },
  onLoad () {
    this.isWeixin = uni.getStorageSync('isWeixin')
    console.log(uni.getStorageSync('isWeixin'))
  },
  methods: {
    // 当输入框里面的值发生变化的时候
    changeMoney (e) {
      var number = e.detail.value;
      number = Math.floor(number * 100) / 100;
      if (number != this.money) {
        uni.showModal({
          title: '温馨提示',
          content: '只能输入小数点后两位数的数值',
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              this.money = number;
            }
          },
        });
      }
    },
    // 点击充值
    async submit () {
      if (!this.isWeixin) {
        return this.$api.msg('请在浏览器中打开该页面', 2000, true, 'none');
      }
      if (this.money == '') {
        return this.$api.msg('请输入有效的金额数');
      }
      if (this.money[0] == 0 && this.money.length <= 1) {
        return this.$api.msg('请输入有效的金额数');
      }
      // 支付宝 h5 支付宝
      // #ifdef H5 || MP-WEIXIN
      let result = {
        Balance: this.money,
        PayWay: this.current,
      };
      result = JSON.stringify(result);
      let data = {
        action: 'SubmitRecharge',
        data: result,
      };
      let res = await this.$api.api.SubmitRecharge(data);
      if (res.data.status == true) {
        let VoucherNumber = res.data.data;
        this.getH5OrderInfo(VoucherNumber);
      }
      // #endif
      // 支付宝 app 支付宝
      // #ifdef APP-PLUS
      // PayWay 表示充值类型 0 表示是线上支付宝 1 线上微信
      let result = {
        Balance: this.money,
        PayWay: this.current,
      };
      result = JSON.stringify(result);
      let data = {
        action: 'SubmitRecharge',
        data: result,
      };
      let res = await this.$api.api.SubmitRecharge(data);
      if (res.data.status == true) {
        let VoucherNumber = res.data.data;
        this.getOrderInfo(VoucherNumber);
      }
      // #endif
    },
    // #ifdef H5 || MP-WEIXIN
    async getH5OrderInfo (VoucherNumber) {
      let data = {
        VoucherNumber: VoucherNumber,
        Driver: 'Wap',
        QuitUrl: 'http://xdkb2c.gup-group.cn/pages/user/surplusMoneny',
        ReturnUrl: 'http://xdkb2c.gup-group.cn/pages/user/surplusMoneny'
      }
      let res = await this.$api.api.aliPay(data)
      document.querySelector('body').innerHTML = res;
      const div = document.createElement('div') // 创建div
      div.innerHTML = res.data // 将返回的form 放入div
      document.body.appendChild(div)
      document.forms[0].submit()
    },
    // #endif
    // #ifdef APP-PLUS
    // 获取 支付宝 orderinf 并调用支付宝支付
    async getOrderInfo (VoucherNumber) {
      let data = {
        VoucherNumber: VoucherNumber,
      };
      let res = await this.$api.api.aliPay(data);
      let orderInfo = res;
      if (orderInfo.statusCode !== 200) {
        console.log('获得订单信息失败', orderInfo);
        uni.showModal({
          content: '获得订单信息失败',
          showCancel: false,
        });
        return;
      }
      uni.requestPayment({
        provider: 'alipay',
        orderInfo: orderInfo.data,
        success: (result) => {
          this.$api.msg('支付成功');
          setTimeout(() => {
            uni.navigateBack({
              delta: 2,
            });
          }, 600);
        },
        fail: (err) => {
          console.log(err);
          uni.navigateBack({
            delta: 2,
          });
        },
      });
    },
    // #endif
    jump (url) {
      uni.navigateTo({
        url: url,
      });
    },
    choose (id) {
      if (id == 1) {
        return this.$api.msg('暂未开通, 敬请期待');
      }
      this.current = id;
      // for (var i in this.payWay) {
      //   var obj = this.payWay[i];
      //   obj.checked = index == i;
      // }
      console.log(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.recharge-wrap {
  .recharge-wrap-hd {
    padding: 46rpx 20rpx;
    display: flex;
    justify-content: space-between;
    > view {
      width: 339rpx;
      height: 82rpx;
      border-radius: 9rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .chooseClass {
      box-shadow: 0px 0px 10px 0px rgba(205, 205, 205, 0.5);
      color: #ffffff;
      background-color: #223041 !important;
    }
    .wrapper {
      background-color: #f8f8f8;
      background: rgba(248, 248, 248, 1);
    }
    image {
      height: 45rpx;
      width: 44rpx;
      margin-right: 15rpx;
    }
  }
  .local {
    border: 1rpx solid #bbbbbb;
    height: 80rpx;
    padding: 0 10rpx;
    font-size: 28rpx;
    position: relative;
    border-radius: 15rpx;
    width: 710rpx;
    margin: 0 auto;
    input {
      width: 100%;
      height: 100%;
      font-size: 28rpx;
    }
  }
  .fc {
    position: absolute;
    right: 20rpx;
    top: 20%;
    color: #cf3e2d;
    font-size: 28rpx;
  }
  .submit {
    width: 711rpx;
    height: 82rpx;
    background: rgba(34, 48, 65, 1);
    border-radius: 9rpx;
    color: #223041;
    margin: 46rpx auto;
    color: #ffffff;
    font-size: 32rpx;
    text-align: center;
    line-height: 82rpx;
  }
  .full {
    height: 11rpx;
    width: 100%;
    background-color: #f5f5f5;
  }
  .czList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50rpx 30rpx;
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
}
</style>
