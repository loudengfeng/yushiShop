<template>
  <view class="content">
    <!-- 头 -->
    <view
      class="hd-box content-hd"
      style="
        display: flex;
        background-color: #7aa6f3;
        color: #ffffff;
        height: 80rpx;
      "
    >
      <text style="flex: 3;">订单编号</text>
      <text style="flex: 2;">
        金额
        <text>(元)</text>
      </text>
      <text style="flex: 2;">
        状态
      </text>
      <text style="flex: 2;">银源</text>
      <text style="flex: 3;">日期</text>
    </view>
    <view class="content-hd-copy"></view>
    <!-- 列表 -->
    <view>
      <view
        class="hd-box hd-content"
        v-for="(item, index) in list"
        :key="index"
      >
        <text style="flex: 3;">{{ item.RechargeOrderId }}</text>
        <text style="flex: 2;">{{ item.Balance | numFilter }}</text>
        <text style="flex: 2;">{{ item.PayStatus | PayStatus }}</text>
        <text style="flex: 2;">{{ item.PayWay | PayWays }}</text>
        <text class="data" style="flex: 3;">{{ item.CreateDate }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 交易数据列表
      list: [],
      // 分页
      page: {
        // 当前页码
        pageIndex: 1,
        // 当前页面展示的数据条数
        pageSize: 20,
      },
      // 数据总条数
      total: '',
      // 节流阀
      flag: true,
    };
  },
  onLoad() {
    // 查询交易明细接口
    this.getTransactionDetails();
  },
  // 监听页面滚动到底部的事件
  onReachBottom() {
    this.page.pageIndex += 1;
    if (this.flag) {
      this.getTransactionDetails();
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },
  methods: {
    // 查询交易明细接口
    async getTransactionDetails() {
      let result = {};
      result = {
        Offset: this.page.pageIndex,
        RowNumber: this.page.pageSize,
      };
      result = JSON.stringify(result);
      let data = {
        action: 'GetRechargeRecord',
        data: result,
      };
      let res = await this.$api.api.modifyQuery(data);
      console.log(res);
      if (res.data.status == true) {
        res.data.data.forEach((item) => {
          // item.Balance = Number(item.Balance).toFixed(2);
          // item.FishNumber = Number(item.FishNumber).toFixed(2);
          // item.FishPrice = Number(item.FishPrice).toFixed(2);
          item.CreateDate = item.CreateDate.split(' ')[0];
          // if (item.PayWay == 0) {
          //   item.PayWay = '线上支';
          // } else if (item.PayWay == 1) {
          //   item.PayWay = '线上微';
          // } else if (item.PayWay == 2) {
          //   item.PayWay = '余额';
          // } else if (item.PayWay == 3) {
          //   item.PayWay = '鱼币';
          // } else if (item.PayWay == 10) {
          //   item.PayWay = '银';
          // } else if (item.PayWay == 11) {
          //   item.PayWay = '线下支';
          // } else if (item.PayWay == 12) {
          //   item.PayWay = '线下微';
          // }
          // if (item.PayStatus == 1) {
          //   item.PayStatus = '成功';
          // } else if (item.PayStatus == 0) {
          //   item.PayStatus = '审核中';
          // } else if (item.PayStatus == 2) {
          //   item.PayStatus = '失败';
          // }
        });
        this.list.push(...res.data.data);
        // console.log(this.list)
        this.total = res.data.sum;
        this.flag = true;
        if (this.total == this.list.length) {
          this.flag = false;
        }
      }
    },
  },
  filters: {
    PayWays(val) {
      if (val == 0) {
        return (val = '线上支');
      } else if (val == 1) {
        return (val = '线上微');
      } else if (val == 2) {
        return (val = '余额');
      } else if (val == 3) {
        return (val = '鱼币');
      } else if (val == 10) {
        return (val = '银');
      } else if (val == 11) {
        return (val = '线下支');
      } else if (val == 12) {
        return (val = '线下微');
      }
    },
    PayStatus(val) {
      if (val == 1) {
        return (val = '成功');
      } else if (val == 0) {
        return (val = '审核中');
      } else if (val == 2) {
        return (val = '失败');
      }
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #fff;
}
.content-hd {
  position: fixed;
  height: 68rpx;
  width: 100%;
}
.content-hd-copy {
  height: 68rpx;
}
.hd-box text {
  text-align: center;
}
.hd-content {
  display: flex;
  padding: 40rpx 0 15rpx;
  border-bottom: 1rpx solid #eee;
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
    > text {
      font-style: normal;
      color: rgba(255, 255, 255, 1);
      font-size: 6upx;
    }
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
