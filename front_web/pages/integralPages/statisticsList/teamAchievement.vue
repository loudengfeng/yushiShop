<template>
  <view class="content">
    <view class="common head">
      <view style="flex: 1">序号</view>
      <view style="flex: 2">用户名</view>
      <view style="flex: 2">业绩总额(元)</view>
      <view style="flex: 2">注册日期</view>
    </view>
    <view class="head-copy"></view>
    <view class="list">
      <view class="common list-item"
            v-for="(item, index) in list"
            :key="index">
        <view style="flex: 1">{{index + 1}}</view>
        <view style="flex: 2">{{item.UserBindName}}</view>
        <view style="flex: 2">{{item.result | results}}</view>
        <view style="flex: 2">{{item.CreateDate | CreateDates}}</view>
      </view>
    </view>
    <view class="footer-copy"></view>
    <view class="footer">
      <view class="f-l">统计
        <text class="today">今日</text>
      </view>
      <view class="f-r">
        <view>订单数: {{OrderCount}}</view>
        <view>订单总额(元): {{OrderResult | numFilters}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 分页
      page: {
        // 当前页码
        pageIndex: 1,
        // 当前页面展示的数据
        pageSize: 20
      },
      // 总的数据条数
      total: '',
      // 节流阀
      flag: true,
      // 数据列表
      list: [],
      // 统计的数据
      statistics: {},
      OrderCount: '',
      OrderResult: '',
    };
  },
  // 监听页面滚动到底部
  onReachBottom() {
    this.page.pageIndex += 1
    if (this.flag) {
      this.getTeamPerformance()
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },

  onLoad() {
    // 获取团队业绩数据
    this.getTeamPerformance()
  },
  filters: {
    CreateDates(val) {
      return val = val.split('T')[0]
    },
    results(value) {
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
      console.log(value)
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
  methods: {
    // 获取团队业绩数据
    async getTeamPerformance() {
      let data = {
        action: 'GetTeamResult',
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      }
      let res = await this.$api.api.modifyQuery(data)
      console.log(res)
      if (res.data.status == true) {
        this.flag = true
        this.list.push(...res.data.data.Data)
        this.total = res.data.data.TotalRecords
        this.OrderCount = res.data.OrderCount
        this.OrderResult = res.data.OrderResult
      }
    }
  },
};
</script>

<style lang="scss">
.head {
  position: fixed;
  width: 100%;
  background-color: #897171;
  > view {
    color: #fff;
  }
}
.head-copy {
  height: 80rpx;
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
}
.active {
  color: #dfa25d;
}
.footer-copy {
  height: 220rpx;
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
    display: flex;
    font-size: 40rpx;
    flex-direction: column;
    border-right: 1rpx solid #d7d7d7;
    padding: 20rpx;
    color: #9f9f9f;
  }
  .today {
    font-size: 30rpx;
    color: #9f9f9f;
  }
  .f-r view {
    font-size: 24rpx;
    margin-left: 30rpx;
    color: #9f9f9f;
    padding: 10rpx;
    margin-bottom: 10rpx;
    background: rgba(238, 233, 233, 1);
    border-radius: 46rpx;
  }
  .f-f {
    margin-top: 20rpx;
  }
}
</style>