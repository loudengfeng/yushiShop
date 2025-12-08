<template>
  <view class="content">
    <!-- 头 -->
    <view
      class="hd-box"
      style="
        display: flex;
        background-color: #223041;
        color: #ffffff;
        height: 80rpx;
      "
    >
      <text style="flex: 2;">凭证图片</text>
      <text style="flex: 3;">时间</text>
      <text style="flex: 2;">
        金额(元)
      </text>
      <text style="flex: 2;">
        状态
      </text>
    </view>
    <!-- 列表 -->
    <view
      class="hd-box"
      style="
        display: flex;
        padding: 40rpx 0 40rpx;
        border-bottom: 1rpx solid #eeeeee;
        align-items: center;
      "
      v-for="(item, index) in resList"
      @click="check(item)"
      :key="index"
    >
      <image
        :src="item.Proof"
        style="flex: 3; height: 120rpx; width: 105rpx;"
        @click.stop="jump(item.Proof)"
      ></image>
      <text style="flex: 3;">{{ item.CreateDate }}</text>
      <text style="flex: 2;">{{ item.Balance }}</text>
      <text style="flex: 2;">{{ item.PayStatus }}</text>
    </view>
    <uni-load-more :status="loadingType"></uni-load-more>
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
  components: {
    uniLoadMore,
  },
  data() {
    return {
      resList: [],
      start: 1,
      total: null,
      loadingType: 'more',
    };
  },
  onLoad() {
    this.czOrder(); //充值订单列表
  },
  onReachBottom() {
    this.czOrder();
  },
  methods: {
    check(item) {
      if (item.PayStatus == '失败') {
        uni.showModal({
          showCancel: false,
          title: '失败原因',
          content: item.Remark,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
          },
        });
      }
    },
    async czOrder() {
      let data = {
        RowNumber: 10,
        Offset: this.start,
      };
      let StringData = JSON.stringify(data);
      let param = {
        action: 'GetRechargeRecord',
        data: StringData,
      };
      let res = await this.$api.api.modifyQuery(param);
      if (res.data.status == true) {
        res.data.data.forEach((item, index) => {
          item.userBindName = item.userBindName.replace(
            /(\d{3})\d{4}(\d{4})/,
            '$1****$2'
          );
          if (item.PayStatus == 0) {
            item.PayStatus = '待审核';
          } else if (item.PayStatus == 1) {
            item.PayStatus = '成功';
          } else if (item.PayStatus == 2) {
            item.PayStatus = '失败';
          }
        });
        let result = res.data.data;
        this.total = res.data.sum;
        this.start += result.length;
        this.resList = this.resList.concat(result);
        this.loadingType = this.total > this.start ? 'more' : 'nomore';
      }
    },
    jump(url) {
      uni.navigateTo({
        url: './img?url=' + url,
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #fff;
}

.hd-box text {
  text-align: center;
}

.common-t {
  background-color: #7aa6f3 !important;
  color: rgba(255, 255, 255, 1);
}

.common {
  color: #545454;
  padding: 0 6rpx;
  margin-top: 20rpx;
}

.common,
.common-t {
  font-size: 26rpx;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #fff;

  .money {
    width: 22%;
  }

  .number {
    width: 17%;
  }

  .common-one {
    width: 5%;
  }

  > text {
    width: 20%;
    text-align: center;
    height: 80rpx;
    line-height: 80rpx;
    // border: 1px solid skyblue;
  }
  .buyin {
    color: #dfa15a;
  }
}

.footer {
  position: absolute;
  bottom: 30rpx;
  display: flex;

  .f-l {
    display: flex;
    flex-direction: column;
    color: #dfa15a;
    font-size: 40rpx;
    border-right: 1rpx solid #d7d7d7;
    width: 150rpx;
    height: 110rpx;
    text-align: center;
  }

  .today {
    font-size: 30rpx;
    color: #9f9f9f;
  }

  s .f-r {
    // margin-left: 50rpx;
  }

  .f-r text {
    display: inline-block;
    margin-left: 30rpx;
    color: #dfa15a;
    padding: 0 20rpx;
    height: 60rpx;
    background: rgba(250, 245, 241, 1);
    border-radius: 46rpx;
  }

  .f-f {
    margin-top: 20rpx;
  }
}
</style>
