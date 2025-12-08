<template>
  <view>
    <view class="num-box"
          @click="goFundDetails(1)">
      <view class="num-box1">
        <view>
          <view style="color: #6ec39c; font-size: 30rpx;">{{
            assetsList.sumPoints | numFilter
          }}</view>
          <view style="font-size: 30rpx;">余额总量</view>
        </view>
        <view>
          <view>{{ assetsList.Points | numFilter }}</view>
          <view>可用余额</view>
        </view>
        <view>
          <view>{{ assetsList.FrozenBalance | numFilter }}</view>
          <view>冻结余额</view>
        </view>
      </view>
      <view class="full"></view>
    </view>
    <view class="num-box"
          style="margin-top: 12rpx;"
          @click="goFundDetails(5)">
      <view class="num-box1">
        <view>
          <view style="color: #6ec39c; font-size: 30rpx;">{{
            assetsList.sumFishCoin | numFilter
          }}</view>
          <view style="font-size: 30rpx;">总量FC</view>
        </view>
        <view>
          <view>{{ assetsList.FishCoin | numFilter }}</view>
          <view>可用FC</view>
        </view>
        <view>
          <view>{{ assetsList.FrozenFishCoin | numFilter }}</view>
          <view>冻结FC</view>
        </view>
      </view>
      <view class="full"></view>
    </view>
    <view class="num-box"
          style="margin-top: 12rpx;">
      <view class="num-box1">
        <view>
          <view style="color: #6ec39c; font-size: 30rpx;">{{
            assetsList.Granted | numFilter
          }}</view>
          <view style="font-size: 30rpx;">还可以获得</view>
        </view>
        <view>
          <view>{{ assetsList.TodayGrant | numFilter }}</view>
          <view>今日获得</view>
        </view>
        <view>
          <view>{{ assetsList.NotGrant | numFilter }}</view>
          <view>累计总量</view>
        </view>
      </view>
      <view class="full"></view>
    </view>
    <view class="czList"
          @click="navTo('/pages/FishCurrency/transaction/transaction')">
      <view class="left">
        <image src="/static/vip/jiaoyi.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <view><text>交易</text><text style="margin-left: 8rpx; color: rgb(167, 167, 167);"></text></view>
      </view>
      <view class="right">
        <image src="/static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <!-- <view class="czList" @click="navTo('/pages/integralPages/rechargeDetail')">
      <view class="left">
        <image
          src="/static/vip/mingxi-2.png"
          mode=""
          style="width: 50rpx; height: 50rpx;"
        ></image>
        <text>交易明细</text>
      </view>
      <view class="right">
        <image src="/static/vip/right.png" mode=""></image>
      </view>
    </view> -->
    <view class="czList"
          @click="navTo('/pages/integralPages/OTCBusiness/index')">
      <view class="left">
        <image src="/static/vip/buySell.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <text>委托买卖</text>
      </view>
      <view class="right">
        <image src="/static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <view class="czList"
          @click="navTo('/pages/user/vipData')">
      <view class="left">
        <image src="/static/vip/tongji.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <view><text>统计分析</text></view>
      </view>
      <view class="right">
        <image src="/static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <view class="czList"
          @click="navTo('/pages/binding/binding')">
      <view class="left">
        <image src="/static/vip/shoukuan.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <view><text>我的收款</text></view>
      </view>
      <view class="right">
        <image src="/static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <view class="czList"
          @click="navTo('/pages/integralPages/giveDEtails')">
      <view class="left">
        <image src="/static/vip/give.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <view><text>赠送明细</text></view>
      </view>
      <view class="right">
        <image src="/static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <view class="czList"
          @click="navTo('/pages/integralPages/assetManagement/list')">
      <view class="left">
        <image src="/static/vip/mingxi-2.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <view><text>提现</text></view>
      </view>
      <view class="right">
        <image src="/static/vip/right.png"
               mode=""></image>
      </view>
    </view>
    <view class="czList"
          v-if="isleft"
          @click="goAdmin">
      <view class="left">
        <image src="/static/vip/admin.png"
               mode=""
               style="width: 50rpx; height: 50rpx;"></image>
        <view><text>管理员</text></view>
      </view>
      <view class="right">
        <image src="/static/vip/right.png"
               mode=""></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      // 资产的数据
      assetsList: {},
      // 判断是否是管理员
      isleft: '',
    };
  },
  onShow () {
    // 查询个人数字资产数据
    this.getAssets();
    // 获取用户信息
    this.getUserInfo();
  },
  methods: {
    goFundDetails (index) {
      // 1 余额资金明细 5 鱼币资金明细
      uni.navigateTo({
        url: '/pages/integralPages/assetManagement/fundDetails?Pattern=' + index,
      });
    },
    async getUserInfo () {
      let data = {
        action: 'GetMemberInfo',
      };
      let res = await this.$api.api.getUserInfo(data);
      if (res.data.status == true) {
        // console.log(res.data.Data.isleft);
        if (res.data.Data.isleft == 1) {
          this.isleft = true;
        } else {
          this.isleft = false;
        }
      }
    },
    // 查询个人数字资产数据
    async getAssets () {
      let data = {
        action: 'ReadBalanceAndFishCoid',
      };
      let res = await this.$api.api.assets(data);
      if (res.data.status == true) {
        res.data.data.forEach((item) => {
          // 可用鱼币
          item.FishCoin = item.FishCoin;
          // 冻结余额
          item.FrozenBalance = item.FrozenBalance;
          // 冻结鱼币
          item.FrozenFishCoin = item.FrozenFishCoin;
          // 鱼币总量
          item.sumFishCoin = item.sumFishCoin;
          // 总余额
          item.sumPoints = item.sumPoints;
          // 可用余额
          item.Points = item.Points;
          // 累计总量
          item.Granted = item.Granted;
          // 今日获得
          item.TodayGrant = item.TodayGrant;
          // 还可以获得
          item.NotGrant = item.NotGrant;
        });
        this.assetsList = res.data.data[0];
      }
    },
    goAdmin () {
      uni.navigateTo({
        url: '/pages/user/admin/admin',
      });
    },
    navTo (url) {
      uni.navigateTo({
        url: url,
      });
    },
  },
  filters: {
    numFilter (value) {
      let realVal = '';
      if (!isNaN(value) && value != '') {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(value).toFixed(2);
      } else {
        realVal = '--';
      }
      return realVal;
    },
  },
};
</script>

<style lang="scss" scoped>
.num-box {
  width: 698rpx;
  height: 154rpx;
  margin: 34rpx auto 12rpx;
  border-radius: 25rpx;
  box-shadow: 0px 0px 14rpx 0px rgba(213, 213, 213, 0.5);
  position: relative;
}
.full {
  position: absolute;
  background-color: #979797;
  height: 55rpx;
  width: 2rpx;
  top: 50rpx;
  left: 236rpx;
}
.num-box1 {
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  > view {
    flex: 1;
    text-align: center;
    color: #656565;
    font-size: 26rpx;
  }
}
.czList {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 30rpx;
  border-bottom: 5rpx solid #f5f5f5;

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
</style>
