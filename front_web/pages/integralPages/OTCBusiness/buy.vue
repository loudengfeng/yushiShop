<template>
  <view class="center">
    <view>
      <text class="bold">一键买币</text>
      <text class="gray">FC参考单价</text>
    </view>
    <view>
      <text class="gray ">限额: </text><text class="kong"> 100-1000000</text>
      <text class="cny ">{{nowPrice}} CNY/FC</text>
    </view>

    <view class="local"><input type="number"
             placeholder="购买数量 :"
             v-model="num"><text class="fc">FC</text></view>
    <view class="local"><input type="number"
             placeholder="需要金额 :"
             v-model="price"
             disabled="false"><text class="cny fc"
            v-if="price">CNY</text><text class="cny fc"
            v-else>CNY</text></view>
    <view>支付方式</view>
    <view class="pay">
      <view class="card"
            style="background-color: #F3F3F3;"
            @click="choosePayWay(indexPay)"
            v-for="(itemPay,indexPay) in payWay"
            :key='indexPay'
            :class="itemPay.checked ?'choose' :''"><text>{{itemPay.name}}</text>
        <image src="../../../static/full.png"
               v-if="itemPay.checked"></image>
      </view>
      <!-- <view class="card"><text>支付宝</text></view> -->
      <!-- <view  class="card"><text>微信</text></view> -->
    </view>
    <view class="footer"
          @click="oneBuy"><text>一键买入</text></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      num: '',
      numCopy: '',
      price: '',
      nowPrice: "",
      payList: [],
      payId: [], //把payList放到这个数组里面
      payWay: [{
        type: 2,
        name: '余额',
        checked: true
      }, {
        type: 10,
        name: '银行卡',
        checked: false
      },
      {
        type: 11,
        name: '支付宝',
        checked: false
      },
      {
        type: 12,
        name: '微信',
        checked: false
      }
      ]
    };
  },
  created() {
    this.getPrice()
  },
  watch: {
    price: function (val) {
      let num = Number(val) / Number(this.nowPrice)
      if (isNaN(this.num)) {
        this.num = "";
      }
      this.num = num.toFixed()
    },
    num: function (val) {
      let price = parseFloat(val) * parseFloat(this.nowPrice)
      if (isNaN(this.price)) {
        this.price = "";
      }
      this.price = price.toFixed(2)
    }
  },
  methods: {
    async getPrice() {
      let data = {
        action: "ReadFishMoneyNew",
        data: ''
      }
      let res = await this.$api.api.FinishOrder(data)
      if (res.data.status == true) {
        let price = res.data.dataOne
        this.nowPrice = Number(price).toFixed(2)
      }
    },
    choosePayWay(index) {
      this.payId = []
      this.payList.forEach((item, index) => {
        if (item.Type) {
          this.payId.push(item.Type)
        }
      })
      var obj = {}
      this.payId.forEach((item, index) => {
        obj[item] = item
      })
      let pp = this.payWay[index].type
      if (obj[pp] == undefined) {
        uni.showModal({
          title: '提示',
          content: '请去绑定',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/binding/binding?info=1'
              })
            } else if (res.cancel) { }
          }
        });
        return
      }
      for (var i in this.payWay) {
        var obj = this.payWay[i]
        obj.checked = index == i
      }
    },
    async getPayWay() {
      let data = {
        data: ''
      }
      let StringData = JSON.stringify(data)
      let param = {
        action: 'ReadPaymentInformation',
        data: StringData
      }
      let res = await this.$api.api.query(param);
      if (res.data.status == true) {
        this.payList = res.data.data
      }
    },
    async oneBuy() {
      if (this.num == this.numCopy) {
        return
      }
      this.numCopy = this.num
      uni.showLoading({
        title: "正在卖出中..."
      })
      let payArr = []
      this.payWay.forEach((item, index) => {
        if (item.checked) {
          payArr.push(item.type)
        }
      })
      let data = {
        FishPrice: this.nowPrice,
        FishNumber: this.num,
        TransactionType: 0,
        AcceptPayWay: payArr
      }
      if (this.price == 0) return this.$api.msg('请输入金额')
      this.getPayWay()
      let StringData = JSON.stringify(data)
      let param = {
        data: StringData,
        action: "CreateFishOrder"
      }
      let res = await this.$api.api.seeShopEvaluate(param);
      if (res.data.status == true) {
        this.$api.msg('成功生成订单')
        uni.hideLoading()
        this.$emit("chooseTab", true)
      } else {
        uni.hideLoading()
        this.$api.msg(res.data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  padding: 40rpx 40rpx 0;

  > view {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40rpx;
  }
}

.gray {
  color: #bbbbbb;
}

.bold {
  font-size: 35rpx;
  color: #3f3f3f;
  font-weight: bold;
}

.cny {
  flex: 2;
  text-align: right;
  font-weight: bold;
}

.cny {
  color: #e21656;
  letter-spacing: 2rpx;
}

.kong {
  margin-left: 20rpx;
}

.local {
  border: 1rpx solid #bbbbbb;
  height: 80rpx;
  padding: 0 10rpx;
  font-size: 28rpx;
  position: relative;
  border-radius: 15rpx;

  input {
    width: 100%;
    height: 100%;
    font-size: 28rpx;
  }
}

.fc {
  position: absolute;
  right: 10rpx;
  top: 20%;
}

.pay {
  width: 100%;
  height: 80rpx;
  display: flex;
  flex-wrap: wrap;
}

.card {
  width: 23%;
  height: 80rpx;
  background-color: #f3f3f3;
  line-height: 80rpx;
  border-radius: 15rpx;
  color: #b0b0b0;
  position: relative;
  margin-bottom: 20rpx;

  text {
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: center;
  }
}

.choose {
  border: 1rpx solid #c34554;
  background-color: #fff;
  color: #e21656;
  font-weight: bold;
}

.card:last-child {
  background-color: #fff;
}

.footer {
  width: 100%;
  height: 80rpx;
  background-color: #c34554;
  line-height: 80rpx;
  border-radius: 15rpx;
  margin-top: 150rpx;
  color: #fff;

  text {
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: center;
  }
}

image {
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  right: 0rpx;
  bottom: 0rpx;
}
</style>
