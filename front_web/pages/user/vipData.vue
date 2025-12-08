<template>
  <view>
    <view class="vip-box">
      <!-- 第一个列表 -->
      <view class="list-box">
        <view>
          <image src="/static/vip/list4.png"
                 mode=""></image>
          <text class="vip-list-name">发行总量</text>
          <text class="num">{{isSueObj.Issue | numFilter}}</text>
        </view>
        <view>
          <image src="/static/vip/list1.png"
                 mode=""></image>
          <text class="vip-list-name">剩余总数</text>
          <text class="num">{{isSueObj.Surplus | numFilter}}</text>
        </view>
        <view>
          <image src="/static/vip/list2.png"
                 mode=""></image>
          <text class="vip-list-name">流通总数</text>
          <text class="num">{{isSueObj.Circulate | numFilter}}</text>
        </view>
      </view>
      <!-- 第二个列表 -->
      <view>
        <view class="list-second">
          <view>
            <view class="image-box">
              <image src="/static/vip/jiageprice1.png"
                     mode=""
                     class="image"></image><text>今日价</text>
            </view>
            <view class="price">{{ price.todayPrice | numFilter }}</view>
          </view>
          <view>
            <view class="image-box">
              <image src="/static/vip/jiageprice2.png"
                     mode=""
                     class="image"></image><text>昨日价</text>
            </view>
            <view class="price">{{ price.yesterdayPrice | numFilter }}</view>
          </view>
          <view>
            <view class="one">历史价</view>
            <image src="/static/vip/tubiaozhexiantu.png"
                   mode=""
                   class="image2"></image>
          </view>
        </view>
      </view>
      <!-- 第三个列表 -->
      <view>
        <view class="list-second"
              style="border-top: none;">
          <view>
            <view class="image-box">
              <image src="/static/vip/xiangmuguanlifuzhi.png"
                     mode=""
                     class="image"></image><text>今日量</text>
            </view>
            <view class="price">{{ number.todayNumber | numFilter }}</view>
          </view>
          <view>
            <view class="image-box">
              <image src="/static/vip/xiangmuguanlifuzhi1.png"
                     mode=""
                     class="image"></image><text>昨日量</text>
            </view>
            <view class="price">{{ number.yesterdayNumber | numFilter }}</view>
          </view>
          <view>
            <view class="one">历史量</view>
            <image src="/static/vip/list3.png"
                   mode=""
                   class="image2"></image>
          </view>
        </view>
      </view>
      <!-- 第四个进度条 -->
      <view style="display: flex; justify-content: center; padding: 30rpx 0;"
            @click="navTo('/pages/integralPages/statisticsList/consumption')">
        <view class="progress-box">
          <view style="flex: 1;">消费情况</view>
          <view class="progress">
            <view class="consumption"
                  :style="{ width: consumptionWidth + '%' }">现金{{trade.xianjinAmount | numFilter}}</view><text>{{trade.yueAmount | numFilter}}</text>
          </view>
        </view>
      </view>
      <view style="display: flex; justify-content: center; padding: 30rpx 0;"
            @click="navTo('/pages/integralPages/statisticsList/fishCurrency')">
        <view class="progress-box">
          <view style="flex: 1;">鱼币交易</view>
          <view class="progress fish-progress">
            <view class="fish"
                  :style="{ width: fishWidth + '%' }">卖出{{fishTrade.outputBalance | numFilter}}</view><text>买入{{fishTrade.incomeBalance | numFilter}}</text>
          </view>
        </view>
      </view>
      <view style="display: flex; justify-content: center; padding: 30rpx 0;"
            @click="navTo('/pages/integralPages/statisticsList/team')">
        <view class="progress-box">
          <view style="flex: 1;">团队人数</view>
          <view class="progress team-progress">
            <view class="team-people"
                  :style="{ width: teamPeopleWidth + '%' }">有效{{teamPeople.Effective}}</view><text>无效{{teamPeople.Invalid}}</text>
          </view>
        </view>
      </view>
      <view style="display: flex; justify-content: center; padding: 30rpx 0;"
            @click="navTo('/pages/integralPages/statisticsList/teamAchievement')">
        <view class="progress-box">
          <view style="flex: 1;">团队业绩</view>
          <view class="progress achievement-progress">
            <view class="team-achievement"
                  :style="{ width: teamAchievementWidth + '%' }">达成{{teamCahievement.Achieved}}</view><text>剩余{{teamCahievement.NotAchieved}}</text>
          </view>
        </view>
      </view>
    </view>
    <view style="height: 100rpx"></view>
    <Footer :num="num"></Footer>
  </view>
</template>

<script>
import Footer from '@/components/footer.vue';
export default {
  components: {
    Footer,
  },
  data() {
    return {
      num: 2,
      // 发行总量
      isSueObj: {},
      // 今日价格
      price: {},
      // 今日量
      number: {},
      // 消费情况
      trade: {},
      // 鱼币交易
      fishTrade: {},
      // 团队人数
      teamPeople: {},
      // 团队业绩
      teamCahievement: {},
      // 消费的现金占比
      consumptionWidth: '',
      // 鱼币交易的卖出占比
      fishWidth: '',
      // 团队人数有效占比
      teamPeopleWidth: '',
      // 团队业绩占比
      teamAchievementWidth: ''
    };
  },
  onLoad() {
    // 获取统计分析的数据
    this.getTotal();
  },
  methods: {
    // 获取统计分析的数据
    async getTotal() {
      let data = {
        action: 'FishStatistics',
      };
      let res = await this.$api.api.total(data);
      if (res.data.status == true) {
        console.log(res)
        this.isSueObj = res.data.issue;
        this.price = res.data.price;
        this.number = res.data.number;
        this.trade = res.data.trade;
        this.fishTrade = res.data.fishTrade;
        this.teamPeople = res.data.teamPeople;
        this.teamCahievement = res.data.teamCahievement;
        // this.trade.incomeFishNumber = Number(this.trade.incomeFishNumber).toFixed(2)
        // this.trade.outputFishNumber = Number(this.trade.outputFishNumber).toFixed(2)
        // this.fishTrade.incomeBalance = Number(this.fishTrade.incomeBalance).toFixed(2)
        // this.fishTrade.outputBalance = Number(this.fishTrade.outputBalance).toFixed(2)
        this.fishWidth = (this.fishTrade.outputBalance / this.fishTrade.incomeBalance).toFixed(2) * 100
        this.teamPeopleWidth = (this.teamPeople.Effective / this.teamPeople.Invalid) * 100
        this.teamAchievementWidth = (this.teamCahievement.Achieved / this.teamCahievement.NotAchieved) * 100
        this.consumptionWidth = (parseFloat(this.trade.xianjinAmount) / parseFloat(this.trade.yueAmount)) * 100
      }
    },
    navTo(url) {
      uni.navigateTo({
        url: url,
      });
    },
  },

  filters: {
    numFilter(value) {
      let realVal = ''
      if (!isNaN(value) && value !== '') {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(value).toFixed(2)
      } else {
        realVal = '--'
      }
      return realVal
    }
  }
};
</script>

<style lang="scss">
.vip-box {
  .progress-box {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 30rpx;
    > view {
      font-size: 26rpx;
      color: #414141;
    }
    .progress {
      flex: 4;
      width: 100%;
      height: 36rpx;
      background-color: #d8d8d8;
      display: flex;
      align-items: center;
      border-radius: 36rpx;
      > view {
        font-size: 22rpx;
        color: #fff;
        padding-left: 10rpx;
        border-radius: 36rpx;
        height: 100%;
        line-height: 36rpx;
        color: #fff;
        background-color: #606060;
        overflow: hidden; //超出一行文字自动隐藏
        text-overflow: ellipsis; //文字隐藏后添加省略号
        white-space: nowrap; //强制不换行
      }
      // 消费情况的进度
      .consumption {
        // width: 20%;
        background-color: #606060;
      }
      // 鱼币交易的情况
      .fish {
        // width: 40%;
        background-color: #dfa15a;
      }
      // 团队人数的情况
      .team-people {
        // width: 50%;
        background-color: #85b0e1;
      }
      // 团队业绩的情况
      .team-achievement {
        // width: 70%;
        background-color: #897171;
      }
      > text {
        font-size: 22rpx;
        color: #434343;
        margin-left: 10rpx;
        height: 100%;
        line-height: 36rpx;
        overflow: hidden; //超出一行文字自动隐藏
        text-overflow: ellipsis; //文字隐藏后添加省略号
        white-space: nowrap; //强制不换行
      }
    }
    .fish-progress {
      background-color: #f5dec6;
    }
    .team-progress {
      background-color: #cdddef;
    }
    .achievement-progress {
      background-color: #c6b8b8;
    }
  }

  .list-box {
    display: flex;
    margin-top: 20rpx;
    padding: 30rpx 0;

    > view {
      flex: 1;
      text-align: center;

      image {
        width: 70rpx;
        height: 70rpx;
      }

      text {
        display: block;
        text-align: center;
      }

      .vip-list-name {
        color: #7b7b7b;
        font-size: 26rpx;
      }

      .num {
        font-size: 22rpx;
        color: #000;
        font-weight: bold;
      }
    }
  }

  .list-second {
    display: flex;
    border-top: 10rpx solid #f5f5f5;
    border-bottom: 10rpx solid #f5f5f5;
    padding: 30rpx 0;

    > view {
      flex: 1;
      text-align: center;

      .price {
        font-size: 26rpx;
        font-weight: bold;
        margin-top: 18rpx;
      }

      .image-box {
        display: flex;
        align-items: center;
        justify-content: center;

        > text {
          margin-left: 20rpx;
          font-size: 28rpx;
          color: #7b7b7b;
        }
      }

      .image {
        height: 40rpx;
        width: 50rpx;
      }

      .image2 {
        width: 37rpx;
        height: 32rpx;
        margin-top: 16px;
      }

      .one {
        font-size: 28rpx;
        color: #7b7b7b;
      }
    }
  }
}
</style>
