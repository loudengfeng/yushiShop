<template>
  <view class="content">
    <view class="box">
      <view class="top">
        <view :class="current == item.id ? 'tabTextCurrent' : ''"
              v-for="(item, index) in tabText"
              :key="index"
              @click="changeTAab(item.id)">{{ item.text }}</view>
      </view>
    </view>
    <view class="common head">
      <view style="flex: 2;">订单号</view>
      <view style="flex: 2;">消费(元)</view>
      <view style="flex: 2;">状态</view>
    </view>
    <view class="head-copy"></view>
    <view class="list">
      <view class="common list-item"
            v-for="(item, index) in list"
            :key="index">
        <view style="flex: 2;">{{ item.OrderId }}</view>
        <view style="flex: 2;">{{ item.Amount | numFilter }}</view>
        <view style="flex: 2;"
              :class="item.status == '消费失败' ? 'fail' : ''">{{ item.status }}</view>
      </view>
    </view>
    <view class="footer-copy"></view>
    <view class="footer">
      <view class="f-l">统计
        <text class="today">今日</text>
      </view>
      <view class="f-r">
        <view>订单数: {{ statistics.orderNumber }}</view>
        <view>现金: {{ statistics.cash | numFilter }}</view>
        <view>余额: {{ statistics.balance | numFilter}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // tab 数据
      tabText: [
        {
          id: 1,
          text: '现金',
        },
        {
          id: 2,
          text: '余额',
        },
      ],
      // tab 栏默认选中项
      current: 1,
      // 分页
      page: {
        // 当前页码
        pageIndex: 0,
        // 当前页面展示的数据
        pageSize: 10,
      },
      // 总的数据条数
      total: '',
      // 节流阀
      flag: true,
      // 消费数据列表
      list: [],
      // 统计数据
      statistics: {},
    };
  },
  filters: {
    numFilter(value) {
      let realVal = '';
      if (!isNaN(value) && value != '') {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(value).toFixed(2);
      } else {
        realVal = '--';
      }
      return realVal;
    },
    numFilters(value) {
      let realVal = '';
      if (!isNaN(value) && value != '') {
        // 截取当前数据到小数前
        realVal = parseFloat(value).toFixed(0);
      } else {
        realVal = '--';
      }
      return realVal;
    },
  },
  // 监听页面滚动到底部
  onReachBottom() {
    this.page.pageIndex += 1;
    if (this.flag) {
      if (this.current == 1) {
        // 获取现金的消费情况的数据
        this.getConsumptionCash();
      } else if (this.current == 2) {
        // 获取余额的消费情况的数据
        this.getConsumptionBalance();
      }
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },
  onLoad() {
    if (this.current == 1) {
      // 获取现金的消费情况的数据
      this.getConsumptionCash();
    } else if (this.current == 2) {
      // 获取余额的消费情况的数据
      this.getConsumptionBalance();
    }
  },
  methods: {
    // 获取现金的消费情况的数据
    async getConsumptionCash() {
      let result = {};
      result = {
        Offset: this.page.pageIndex,
        RowNumber: this.page.pageSize,
      };
      result = JSON.stringify(result);
      let data = {
        action: 'ReadUserXianjinOrdersRecord',
        data: result,
      };
      let res = await this.$api.api.consumptionBalance(data);
      console.log(res);
      if (res.data.status == true) {
        res.data.data.forEach((item) => {
          if (item.status == 0) {
            item.status = '消费失败';
          } else if (item.status == 1) {
            item.status = '消费成功';
          }
        });
        this.flag = true;
        this.list.push(...res.data.data);
        this.statistics = res.data.statistics;
        this.total = res.data.sum;
        if (this.total == this.list.length) {
          this.flag = false;
        }
        if (this.statistics.balance == '') {
          this.statistics.balance = 0;
        }
        if (this.statistics.cash == '') {
          this.statistics.cash = 0;
        }
        if (this.statistics.orderNumber) {
          this.statistics.orderNumber = 0;
        }
      }
    },
    // 获取余额的消费情况的数据
    async getConsumptionBalance() {
      let result = {};
      result = {
        Offset: this.page.pageIndex,
        RowNumber: this.page.pageSize,
      };
      result = JSON.stringify(result);
      let data = {
        action: 'ReadUserYueOrdersRecord',
        data: result,
      };
      let res = await this.$api.api.consumptionBalance(data);
      console.log(res);
      if (res.data.status == true) {
        res.data.data.forEach((item) => {
          if (item.status == 0) {
            item.status = '消费失败';
          } else if (item.status == 1) {
            item.status = '消费成功';
          }
        });
        this.flag = true;
        this.list.push(...res.data.data);
        this.statistics = res.data.statistics;
        this.total = res.data.sum;
        if (this.total == this.list.length) {
          this.flag = false;
        }
        if (this.statistics.balance == '') {
          this.statistics.balance = 0;
        }
        if (this.statistics.cash == '') {
          this.statistics.cash = 0;
        }
        if (this.statistics.orderNumber) {
          this.statistics.orderNumber = 0;
        }
      }
    },
    // 点击 tab 栏触发的事件
    changeTAab(id) {
      this.page.pageIndex = 0;
      this.list = [];
      this.statistics = {};
      this.current = id;
      if (this.current == 1) {
        // 获取现金的消费情况的数据
        this.getConsumptionCash();
      } else if (this.current == 2) {
        // 获取余额的消费情况的数据
        this.getConsumptionBalance();
      }
    },
  },
};
</script>

<style lang="scss">
.box {
  position: fixed;
  width: 100%;
  height: 80rpx;
}
.head {
  position: fixed;
  top: 160rpx;
  width: 100%;
  background-color: #606060;
  > view {
    color: #fff;
  }
}
.head-copy {
  height: 160rpx;
}
.common {
  height: 80rpx;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  > view {
    text-align: center;
    width: 25%;
  }
}
.list-item {
  margin-bottom: 10rpx;
  background-color: #fff;
  // 消费失败的颜色
  .fail {
    color: #d16767;
  }
}
.top {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  text-align: center;
  > view {
    font-size: 35rpx;
    width: 100%;
    color: #9f9f9f;
    border-bottom: 1rpx solid transparent;
  }
  .tabTextCurrent {
    color: #000;
    border-bottom: 1rpx solid #000;
  }
}
.footer-copy {
  height: 280rpx;
}
.footer {
  position: fixed;
  bottom: 0rpx;
  display: flex;
  width: 100%;
  align-items: center;
  z-index: 22;
  padding: 20rpx 0;
  border-top: 1rpx solid #f5f5f5;
  background-color: #fff;
  .f-l {
    font-size: 40rpx;
    display: flex;
    flex-direction: column;
    border-right: 1rpx solid #d7d7d7;
    padding: 20rpx;
    color: #000;
  }
  .today {
    font-size: 30rpx;
    color: #9f9f9f;
  }
  .f-r {
    margin-left: 30rpx;
    > view {
      font-size: 24rpx;
      color: #000;
      padding: 10rpx;
      margin-bottom: 10rpx;
      background: rgba(236, 236, 236, 1);
      border-radius: 46rpx;
    }
  }
  .f-f {
    margin-top: 20rpx;
  }
}

// .footer {
//   position: fixed;
//   bottom: 0rpx;
//   display: flex;
//   width: 100%;
//   background-color: #fff;

//   .f-l {
//     display: flex;
//     flex-direction: column;
//     color: #3a3a3a;
//     font-size: 40rpx;
//     border-right: 1rpx solid #d7d7d7;
//     width: 150rpx;
//     height: 110rpx;
//     text-align: center;
//   }
//   .today {
//     font-size: 30rpx;
//     color: #9f9f9f;
//   }
//   s .f-r {
//     // margin-left: 50rpx;
//     color: #515151;
//   }
//   .f-r text {
//     background-color: #ececec;
//     display: inline-block;
//     margin-left: 30rpx;

//     padding: 0 30rpx;
//     height: 60rpx;
//     background: rgba(236, 236, 236, 1);
//     border-radius: 46rpx;
//     margin-top: 20rpx;
//   }
// }
</style>
