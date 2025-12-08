<template>
  <view>
    <view class="userInfo-hd">
      <image src="/static/newShop/header.png"
             mode=""></image>
      <view class="userName">
        <view>{{userInfo.userMobile}}</view>
        <view class="date">注册时间：{{userInfo.createTime}}</view>
      </view>
    </view>
<!--    <view class="user-list">
      <view>
        <view class="up">买入量</view>
        <view class="blew">{{userInfo.Deal}}</view>
      </view>
      <view>
        <view class="up">买入量</view>
        <view class="blew">{{userInfo.Appeal}}</view>
      </view>
      <view>
        <view class="up">总量</view>
        <view class="blew">{{userInfo.AppealSuccess}}</view>
      </view>
    </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      let res = await this.$api.api.getUserInfo({});
	  this.userInfo = res.data
    },
  },
};
</script>

<style lang="scss">
.userInfo-hd {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 50rpx 30rpx 30rpx 30rpx;

  image {
    height: 88rpx;
    width: 88rpx;
    margin-right: 30rpx;
  }

  .userName {
    font-size: 28rpx;
    color: #223041;
    font-weight: 500;

    .date {
      font-size: 22rpx;
      color: #878787;
    }
  }
}

.user-list {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  padding: 30rpx 0;

  .up {
    font-size: 24rpx;
    color: #878787;
  }

  .blew {
    font-size: 30rpx;
    color: #223041;
    font-weight: 500;
  }

  view {
    width: 33%;
    text-align: center;
    padding: 12rpx 0;

    view {
      width: 100%;
    }
  }
}

.mou {
  height: 90rpx;
  line-height: 90rpx;
  padding-left: 30rpx;
  color: #777778;
  letter-spacing: 1rpx;
  font-size: 30rpx;
  border-top: 10rpx solid #f5f5f5;
  border-bottom: 1rpx solid #f5f5f5;
}

.item-box {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  border-bottom: 1rpx solid #ececec;

  // 单独盒子的左边
  .item-left {
    // 左边的上部分
    .left-top {
      display: flex;
      align-items: center;

      // 用户头像照片
      .head-img {
        margin-right: 34rpx;
        width: 68rpx;
        height: 68rpx;
      }

      // 名称区域
      .top-content {
        .content-box {
          display: flex;
          align-items: center;

          // 商品名称
          .content-name {
            font-weight: 700;
            font-size: 28rpx;
            color: #223041;
            margin-right: 26rpx;
          }

          // 认证
          .content-authentication {
            width: 68rpx;
            height: 33rpx;
            line-height: 33rpx;
            font-size: 24rpx;
            text-align: center;
            color: #fff;
            border-radius: 9rpx;
            background-color: #eda257;
          }
        }

        .content-img {
          margin: 20rpx 0;
          width: 40rpx;
          height: 40rpx;
        }
      }
    }

    // 左边的下部分
    .left-bottom {
      font-size: 22rpx;
      color: #848484;
    }
  }

  // 单独盒子的右边
  .item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;

    // 买卖
    .right-common {
      width: 118rpx;
      height: 46rpx;
      line-height: 46rpx;
      text-align: center;
      border-radius: 23rpx;
      font-size: 24rpx;
      color: #fff;
    }

    .right-buy {
      background-color: #c34554;
    }

    .right-sell {
      background-color: #52b88a;
    }

    // 单价
    .right-unit-price {
      font-size: 22rpx;
      color: #848484;
    }

    // 价格
    .right-price {
      font-size: 40rpx;
      color: #223041;
    }
  }
}
</style>
