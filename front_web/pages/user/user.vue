<template>
  <view class="container">
    <view class="user-section">
      <image class="bg"
             src="/static/bg.png"></image>
      <view class="user-info-box">
        <view class="portrait-box">
          <image class="portrait"
                 src="/static/newShop/header.png"
                 @click="goUserInfo"></image>
        </view>
        <view class="info-box"
              v-if="hasLogin">
          <text class="username"
                style="font-size: 26rpx;">{{
            phoneName
          }}</text>
          <!-- <div class="vipImage">
            <image src="../../static/class.png"
                   mode=""></image><text>08</text>
          </div> -->
          <div class="className"></div>
        </view>
        <view v-else>
          <navigator url="../public/login"
                     class="username">登录/注册</navigator>
        </view>
      </view>
    </view>

    <view class="cover-container"
          :style="[
        {
          transform: coverTransform,
          transition: coverTransition,
        },
      ]"
          @touchstart="coverTouchstart"
          @touchmove="coverTouchmove"
          @touchend="coverTouchend">
      <image class="arc"
             src="/static/arc.png"></image>
      <!-- 订单 -->
      <view class="order-section-hd">
        <view class="orderMy">订单中心</view>
        <view class="allOrder"
              @click="navTo('/pages/order/order?state=0')">查看全部 ></view>
      </view>
      <view class="order-section">
        <view class="order-item"
              @click="navTo('/pages/order/order?state=1')"
              hover-class="common-hover"
              :hover-stay-time="50">
          <image src="../../static/daifukuanb.png"
                 mode=""></image>
          <text>待付款</text>
        </view>
        <view class="order-item"
              @click="navTo('/pages/order/order?state=2')"
              hover-class="common-hover"
              :hover-stay-time="50">
          <image src="../../static/daifahuo.png"
                 mode=""></image>
          <text>待发货</text>
          <view class="yuan"
                v-if="fnum">{{ fnum }}</view>
        </view>
        <view class="order-item"
              @click="navTo('/pages/order/order?state=3')"
              hover-class="common-hover"
              :hover-stay-time="50">
          <image src="../../static/wuliu.png"
                 mode=""></image>
          <text>待收货</text>
          <view class="yuan"
                v-if="snum">{{ snum }}</view>
        </view>
        <view class="order-item"
              @click="navTo('/pages/order/evaluateList?state=5&title=评价列表')"
              hover-class="common-hover"
              :hover-stay-time="50">
          <image src="../../static/daipingjia.png"
                 mode=""></image>
          <text>待评价</text>
        </view>
      </view>
	  
	  <!-- 买方 -->
	        <view class="order-section-hd">
	          <view class="orderMy">买方</view>
	          <view class="allOrder"></view>
	        </view>
	        <view class="order-section">
	          <view class="order-item"
	                @click="navTo('/pages/user/myHouse')"
	                hover-class="common-hover"
	                :hover-stay-time="50">
	            <image src="../../static/newShop/wdck.png"
	                   mode=""></image>
	            <text>我的仓库</text>
	          </view>
	          <view class="order-item"
	                @click="navTo('/pages/order/new_order?state=0')"
	                hover-class="common-hover"
	                :hover-stay-time="50">
	            <image src="../../static/newShop/mrdd.png"
	                   mode=""></image>
	            <text>买入订单</text>
	            <view class="yuan"
	                  v-if="fnum">{{ fnum }}</view>
	          </view>
	          <view class="order-item"
	                @click="navTo('/pages/order/new_order?state=1')"
	                hover-class="common-hover"
	                :hover-stay-time="50">
	            <image src="../../static/newShop/dfk.png"
	                   mode=""></image>
	            <text>待付款</text>
	            <view class="yuan"
	                  v-if="snum">{{ snum }}</view>
	          </view>
	          <view class="order-item"
	                @click="navTo('/pages/order/new_order?state=2')"
	                hover-class="common-hover"
	                :hover-stay-time="50">
	            <image src="../../static/newShop/yfk.png"
	                   mode=""></image>
	            <text>已付款</text>
	          </view>
	        </view>
			
			<!-- 卖方 -->
			<view class="order-section-hd">
			  <view class="orderMy">卖方</view>
			  <view class="allOrder"></view>
			</view>
			<view class="order-section">
			  <view class="order-item"
			        @click="navTo('/pages/order/mockOrder?state=0')"
			        hover-class="common-hover"
			        :hover-stay-time="50">
			    <image src="../../static/newShop/wdck.png"
			           mode=""></image>
			    <text>我的仓库</text>
			  </view>
			  <view class="order-item"
			        @click="navTo('/pages/order/mockOrder?state=1')"
			        hover-class="common-hover"
			        :hover-stay-time="50">
			    <image src="../../static/newShop/wtmd.png"
			           mode=""></image>
			    <text>委卖订单</text>
			    <view class="yuan"
			          v-if="fnum">{{ fnum }}</view>
			  </view>
			  <view class="order-item"
			        @click="navTo('/pages/order/mockOrder?state=2')"
			        hover-class="common-hover"
			        :hover-stay-time="50">
			    <image src="../../static/newShop/dsk.png"
			           mode=""></image>
			    <text>待收款</text>
			    <view class="yuan"
			          v-if="snum">{{ snum }}</view>
			  </view>
			  <view class="order-item"
			        @click="navTo('/pages/order/mockOrder?state=3')"
			        hover-class="common-hover"
			        :hover-stay-time="50">
			    <image src="../../static/newShop/ysk.png"
			           mode=""></image>
			    <text>已收款</text>
			  </view>
			</view>
			
		<!-- 我的服务 -->
			<view class="order-section-hd">
			  <view class="orderMy">我的服务</view>
			  <view class="allOrder"></view>
			</view>
			<view class="order-section" style="flex-wrap: wrap;justify-content: flex-start;">
			  <view class="order-item" style="width: 33%;margin-bottom: 40rpx;"
			        @click="navTo('/pages/user/userCertification')"
			        hover-class="common-hover"
			        :hover-stay-time="50">
			    <image src="../../static/newShop/smrz.png"
			           mode=""></image>
			    <text>实名认证</text>
			    <view class="yuan"
			          v-if="fnum">{{ fnum }}</view>
			  </view>
			  <view class="order-item" style="width: 33%;margin-bottom: 40rpx;"
			        @click="navTo('/pages/user/userInfo')"
			        hover-class="common-hover"
			        :hover-stay-time="50">
			    <image src="../../static/newShop/grzl.png"
			           mode=""></image>
			    <text>个人资料</text>
			    <view class="yuan"
			          v-if="snum">{{ snum }}</view>
			  </view>
			  <view class="order-item" style="width: 33%;margin-bottom: 40rpx;"
			        @click="navTo('/pages/address/address')"
			        hover-class="common-hover"
			        :hover-stay-time="50">
			    <image src="../../static/newShop/dzxx.png"
			           mode=""></image>
			    <text>地址信息</text>
			  </view>
			  <view class="order-item" style="width: 33%;margin-bottom: 40rpx;"
			        @click="navTo('/pages/binding/binding')"
			        hover-class="common-hover"
			        :hover-stay-time="50">
			    <image src="..../../static/newShop/skfs.png"
			           mode=""></image>
			    <text>收款方式</text>
			  </view>
			  <view class="order-item" style="width: 33%;margin-bottom: 40rpx;"
			        @click="logOut()"
			        hover-class="common-hover"
			        :hover-stay-time="50">
			    <image src="..../../static/newShop/logOut.png"
			           mode=""></image>
			    <text>退出</text>
			  </view>
			</view>
    </view>
  </view>
</template>
<script>
import listCell from '@/components/mix-list-cell';
import { mapState } from 'vuex';
let startY = 0,
  moveY = 0,
  pageAtTop = true;
export default {
  components: {
    listCell,
  },
  data() {
    return {
      coverTransform: 'translateY(0px)',
      coverTransition: '0s',
      moving: false,
      phoneName: '',
      hasLogin: '',
      userInfo: '',
      fnum: '', //待发货数量
      snum: '', //待收货数量
    }
  },
  onLoad() { },
  onShow() {
    this.phoneName =
      uni.getStorageSync('mobile').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') ||
      uni.getStorageSync('mobile');
    this.hasLogin = uni.getStorageSync('token');
    // this.getUserInfo();
    // this.getCount();
  },
  computed: {
    name() {
      if (this.userInfo.GradeId == 1) {
        return '普通会员';
      }
      else if (this.userInfo.GradeId == 2) {
        return ' 推广员1级';
      }
      else if (this.userInfo.GradeId == 3) {
        return ' 推广员2级';
      }
      else if (this.userInfo.GradeId == 4) {
        return ' 推广员3级';
      }
      else if (this.userInfo.GradeId == 5) {
        return ' 推广员4级';
      }
      else if (this.userInfo.GradeId == 6) {
        return ' 推广员5级';
      }
    },
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      this.navTo('/pages/set/set');
    } else if (index === 1) {
      // #ifdef APP-PLUS
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const currentWebview = page.$getAppWebview();
      currentWebview.hideTitleNViewButtonRedDot({
        index,
      });
      // #endif
      uni.navigateTo({
        url: '/pages/notice/notice',
      });
    }
  },
  // #endif
  methods: {
	  logOut(){
		uni.clearStorageSync('token');
		  uni.clearStorageSync('mobile')
		  uni.navigateTo({
		  	url: '/pages/public/login'
		  })
	  },
    goUserInfo() {
      uni.navigateTo({
        url: '/pages/user/userInfo',
      });    },
    async getCount() {
      let param = {
        action: 'GetOrderStatusCount',
        token: uni.getStorageSync('token'),
      };
      let res = await this.$api.api.evaluate(param);
      if (res.data.status == true) {
        res.data.data.forEach((item, index) => {
          if (item.OrderStatus == 2) {
            this.fnum = item.Counts;
          }
          if (item.OrderStatus == 3) {
            this.snum = item.Counts;
          }
        });
      }
    },
    //得到用户信息
    async getUserInfo() {
      let param = {
        action: 'GetMemberInfo',
      };
      let res = await this.$api.api.getUserInfo(param);
      if (res.data.status == true) {
        res.data.Data.allyue =
          res.data.Data.Points + res.data.Data.FrozenBalance;
        res.data.Data.allfish =
          res.data.Data.FishCoin + res.data.Data.FrozenFishCoin;
        uni.setStorageSync('userInfo', res.data.Data);
        this.userInfo = res.data.Data;
        this.OpenId = res.data.Data.OpenId
        uni.setStorageSync('openId', this.OpenId)
      }
    },
    /**
     * 统一跳转接口,拦截未登录路由
     * navigator标签现在默认没有转场动画，所以用view
     */
    navTo(url) {
      // if (!this.hasLogin) {
      //   url = '/pages/public/login';
      // }
      uni.navigateTo({
        url: url,
      });
    },

    /**
     *  会员卡下拉和回弹
     *  1.关闭bounce避免ios端下拉冲突
     *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
     *    transition设置0.1秒延迟，让css来过渡这段空窗期
     *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
     */
    coverTouchstart(e) {
      if (pageAtTop === false) {
        return;
      }
      this.coverTransition = 'transform .1s linear';
      startY = e.touches[0].clientY;
    },
    coverTouchmove(e) {
      moveY = e.touches[0].clientY;
      let moveDistance = moveY - startY;
      if (moveDistance < 0) {
        this.moving = false;
        return;
      }
      this.moving = true;
      if (moveDistance >= 80 && moveDistance < 100) {
        moveDistance = 80;
      }

      if (moveDistance > 0 && moveDistance <= 80) {
        this.coverTransform = `translateY(${moveDistance}px)`;
      }
    },
    coverTouchend() {
      if (this.moving === false) {
        return;
      }
      this.moving = false;
      this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
      this.coverTransform = 'translateY(0px)';
    },
  },
};
</script>
<style lang="scss" scoped>
.info-box {
  position: relative;

  .vipImage {
    position: absolute;
    top: 10rpx;
    left: 200rpx;
  }
}

.className {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #323f6c;
}

.vipImage {
  // width: 120rpx;
  // height: 50rpx;
  border-radius: 10rpx;
  // background-color: #323F6C;
  display: flex;
  align-items: center;

  image {
    width: 130rpx;
    height: 38rpx;
  }

  text {
    position: absolute;
    right: 20rpx;
    color: #cfae61;
    font-weight: bold;
    font-size: 26rpx;
  }
}

.className {
}

%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

%section {
  display: flex;
  justify-content: space-around;
  align-content: center;
  background: #fff;
  border-radius: 10upx;
}

.order-section-hd {
  display: flex;
  justify-content: space-between;
  height: 80rpx;
  margin-top: 20rpx;
  margin-bottom: 0rpx;
  background-color: #ffffff;
  align-items: center;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  .orderMy {
    font-size: 28rpx;
    font-weight: 500;
  }

  .allOrder {
    color: #808080;
    font-size: 26rpx;
  }
}

.user-section {
  height: 520upx;
  padding: 100upx 30upx 0;
  position: relative;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(1px);
    opacity: 1;
  }
}

.user-info-box {
  height: 180upx;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;

  .portrait {
    width: 130upx;
    height: 130upx;
    border: 5upx solid #fff;
    border-radius: 50%;
  }

  .username {
    font-size: $font-lg + 6upx;
    color: $font-color-dark;
    margin-left: 20upx;
  }
}

.vip-card-box {
  display: flex;
  flex-direction: column;
  color: #f7d680;
  height: 240upx;
  background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
  border-radius: 16upx 16upx 0 0;
  overflow: hidden;
  position: relative;
  padding: 20upx 24upx;

  .card-bg {
    position: absolute;
    top: 20upx;
    right: 0;
    width: 380upx;
    height: 260upx;
  }

  .b-btn {
    position: absolute;
    right: 20upx;
    top: 16upx;
    width: 132upx;
    height: 40upx;
    text-align: center;
    line-height: 40upx;
    font-size: 22upx;
    color: #36343c;
    border-radius: 20px;
    background: linear-gradient(left, #f9e6af, #ffd465);
    z-index: 1;
  }

  .tit {
    font-size: $font-base + 2upx;
    color: #f7d680;
    margin-bottom: 28upx;

    .yticon {
      color: #f6e5a3;
      margin-right: 16upx;
    }
  }

  .e-b {
    font-size: $font-sm;
    color: #d8cba9;
    margin-top: 10upx;
  }
}

.cover-container {
  background: $page-color-base;
  margin-top: -150upx;
  padding: 0 30upx;
  position: relative;
  background: #f5f5f5;
  padding-bottom: 20upx;

  .arc {
    position: absolute;
    left: 0;
    top: -34upx;
    width: 100%;
    height: 36upx;
  }
}

.tj-sction {
  @extend %section;
  justify-content: space-evenly;

  .tj-item {
    width: 100%;
    @extend %flex-center;
    flex-direction: column;
    height: 210upx;
    font-size: $font-sm;
    color: #75787d;
    .dj {
      color: #3b3b3b;
      display: flex;
      text:nth-child(1) {
        color: #6271a8;
        margin-right: 10rpx;
        font-size: 26rpx;
      }
    }
  }

  .num {
    font-size: $font-lg;
    color: #6271a8;
    margin-bottom: 8upx;
    font-weight: 600;
  }
}

.order-section {
  @extend %section;
  padding: 28upx 0;

  // margin-top: 20upx;
  .order-item {
    @extend %flex-center;
    position: relative;
    width: 120upx;
    height: 120upx;
    border-radius: 10upx;
    font-size: $font-sm;
    color: $font-color-dark;

    image {
      height: 40rpx;
      width: 40rpx;
      margin-bottom: 30rpx;
    }
    .yuan {
      position: absolute;
      right: 15rpx;
      top: -10rpx;
      height: 30rpx;
      width: 30rpx;
      background-color: #d04545;
      border-radius: 50%;
      color: #ffffff;
      line-height: 30rpx;
      text-align: center;
      font-size: 18rpx;
    }
  }

  .yticon {
    font-size: 48upx;
    margin-bottom: 18upx;
    color: #fa436a;
  }

  .icon-shouhoutuikuan {
    font-size: 44upx;
  }
}

.history-section {
  padding: 30upx 0 0;
  margin-top: 20upx;
  background: #fff;
  border-radius: 10upx;

  .sec-header {
    display: flex;
    align-items: center;
    font-size: $font-base;
    color: $font-color-dark;
    line-height: 40upx;
    margin-left: 30upx;

    .yticon {
      font-size: 44upx;
      color: #5eba8f;
      margin-right: 16upx;
      line-height: 40upx;
    }
  }

  .h-list {
    white-space: nowrap;
    padding: 30upx 30upx 0;

    image {
      display: inline-block;
      width: 160upx;
      height: 160upx;
      margin-right: 20upx;
      border-radius: 10upx;
    }
  }
}
</style>
