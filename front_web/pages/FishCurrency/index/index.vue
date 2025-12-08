<template>
  <view>
    <view class="swiper-container">
      <!-- <view class="swiper-wrapper" style="display: flex;text-align: center;justify-content: center;"> -->
      <!-- 	<view class="swiper-slide"><image src="../../../static/temp/ad2.jpg" mode=""></image></view>
				<view class="swiper-slide"><image src="../../../static/temp/ad2.jpg" mode=""></image></view>
				<view class="swiper-slide"><image src="../../../static/temp/ad2.jpg" mode=""></image></view> -->
      <!-- <view class="swiper-slide" style="background-image:url(../../../../../static/user-bg.jpg)"></view> -->
      <!-- <view class="swiper-slide" style="background-image:url(../../../../../static/user-bg.jpg)"></view>
				<view class="swiper-slide" style="background-image:url(../../../../../static/user-bg.jpg)"></view>
				<view class="swiper-slide" style="background-image:url(../../../../../static/user-bg.jpg)"></view>
				<view class="swiper-slide" style="background-image:url(../../../../../static/user-bg.jpg)"></view>
				<view class="swiper-slide" style="background-image:url(../../../../../static/user-bg.jpg)"></view>
				<view class="swiper-slide" style="background-image:url(../../../../../static/user-bg.jpg)"></view>
				<view class="swiper-slide" style="background-image:url(../../../../../static/user-bg.jpg)"></view>
				<view class="swiper-slide" style="background-image:url(../../../../../static/user-bg.jpg)"></view> -->
      <!-- </view> -->
      <!-- Add Pagination -->
      <!-- <view class="swiper-pagination"></view> -->
    </view>
    <view class="center">
      <text>市场行情</text>

    </view>
    <view class="flex-space-around">
      <view class="flex"
            v-for="(item, index) in tabText"
            :key="index">
        <text>{{item.text}}</text>
        <view class="flex-t">
          <image src="/static/selec02.png"></image>
          <image src="/static/select01.png"></image>
        </view>
      </view>
    </view>
    <view class="list">
      <view class="list-item"
            v-for="(item, index) in list"
            :key="index">
        <view class="item-title">
          <!-- <image src="/static/FC.jpg"></image> -->
          <view>
            <view>FC</view>
            <view>{{item.Deal}}</view>
          </view>
        </view>
        <view>¥{{item.Price}}</view>
        <view>
          <view class="item-text red"
                v-if="item.Chg > '0' ? true : false">{{item.Chg}}</view>
          <view class="item-text greed"
                v-else>{{item.Chg}}</view>
        </view>
      </view>
    </view>
    <!-- 底部导航 -->
    <Footer :num='num'></Footer>
  </view>
</template>

<script>
var swiper = require('../../../common/js/swiper.min.js')
// var myswiper = require('../../../common/js/swiper.js')
import Footer from '../../../components/footer.vue'
// import {
// 	swiper
// } from '../../../common/js/swiper.min.js';
import {
  myswiper
} from '../../../common/js/swiper.js';
export default {
  components: {
    Footer
  },
  data() {
    return {
      list: [],
      num: 0,
      // tab 栏数据
      tabText: [
        {
          id: 1,
          text: '成交额'
        },
        {
          id: 1,
          text: '最新价'
        },
        {
          id: 1,
          text: '涨跌幅'
        }
      ]
    };
  },
  onLoad() {
    // 获取涨幅度
    this.getFc()
  },
  methods: {
    async getFc() {
      let data = {
        action: 'CoidStatistics'
      }
      let res = await this.$api.api.fans(data)
      if (res.data.status == true) {
        res.data.data.forEach(item => {
          item.Deal = Number(item.Deal).toFixed(2)
          item.Price = Number(item.Price).toFixed(2)
        })
        this.list = res.data.data
      }
      console.log(res)
    }
  }
}
</script>
<style>
@import "../../../common/css/swiper.min.css";
</style>
<style lang="scss">
/deep/.uni-view {
  line-height: 0 !important;
}

.swiper-container {
  width: 100%;
  padding-top: 40rpx;
  padding-bottom: 40rpx;
}

.swiper-slide {
  background-position: center;
  background-size: cover;
  width: 600rpx;
  height: 314rpx;
  border-radius: 30rpx;
}

.center {
  text-align: center;
  color: #223041;
  font-size: 28rpx;
  font-weight: bold;
}

.flex {
  display: flex;
  justify-content: center;
  width: 33.33%;

  image {
    width: 16rpx;
    height: 10rpx;
    margin-left: 10rpx;
  }
}

.flex-t {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.flex-space-around {
  padding: 30rpx;
  display: flex;
  // justify-content: space-evenly;
  justify-content: space-between;
  color: #797979;
  border-bottom: 1rpx solid #f2f2f2;
}
.list {
  .list-item {
    padding: 30rpx;
    display: flex;
    align-items: center;
    border-bottom: 4rpx solid #f5f5f5;
    > view {
      display: flex;
      justify-content: center;
      width: 33.33%;
    }
    .item-title {
      display: flex;
      align-items: center;
      text-align: center;
      > image {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      // > view {
      //   display: flex;
      // }
    }
    .item-text {
      width: 140rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      font-weight: 600;
      color: #fff;
    }
    .red {
      background-color: #c34554;
    }
    .greed {
      background-color: #52b88a;
    }
  }
}
</style>
