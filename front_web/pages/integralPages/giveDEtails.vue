<template>
  <view class="content">
    <!-- 头部区域 -->
    <view class="common head">
      <view style="flex: 2;">订单号</view>
      <view style="flex: 0.6;">期数</view>
      <view style="flex: 2;">每期总数</view>
      <view style="flex: 1;">获得量</view>
      <view style="flex: 1;">状态</view>
      <view style="flex: 2;">获得时间</view>
    </view>
    <view class="head-copy"></view>
    <view class="list">
      <view class="common list-item"
            v-for="(item, index) in list"
            :key="index">
        <view style="flex: 2;">{{ item.FishOrderId }}</view>
        <view style="flex: 0.6;">{{ item.Phase }}</view>
        <view style="flex: 2;">{{ item.sum }}</view>
        <view style="flex: 1;">{{ item.FishNumber }}</view>
        <view style="flex: 1;"
              :class="item.IsDistribute == '已发放' ? 'already' : ''">{{ item.IsDistribute }}</view>
        <view style="flex: 2;">{{ item.DistributeDate }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 数据列表
      list: [],
      // 分页
      page: {
        // 当前页码
        pageIndex: 0,
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
    // 查询鱼币的发放记录
    this.getGiveDetails();
  },
  // 监听页面滚动到底部的事件
  onReachBottom() {
    this.page.pageIndex += 1;
    if (this.flag) {
      this.getGiveDetails();
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },
  methods: {
    // 查询鱼币的发放记录
    async getGiveDetails() {
      let result = {};
      result = {
        Offset: this.page.pageIndex,
        RowNumber: this.page.pageSize,
      };
      result = JSON.stringify(result);
      let data = {
        action: 'ReadFishDistribute',
        data: result,
      };
      let res = await this.$api.api.fcDistributionRecord(data);
      console.log(res);
      if (res.data.status == true) {
        res.data.data.forEach((item) => {
          item.ActuallyDistributeDate = item.ActuallyDistributeDate.split(
            ' '
          )[0];
          item.CreateDate = item.CreateDate.split(' ')[0];
          item.DistributeDate = item.DistributeDate.split(' ')[0];
          item.FishNumber = Number(item.FishNumber).toFixed(2);
          item.sum = Number(item.sum).toFixed(2);
          if (item.IsDistribute == true) {
            item.IsDistribute = '已发放';
          } else if (item.IsDistribute == false) {
            item.IsDistribute = '未发放';
          }
        });
        this.list.push(...res.data.data);
        this.total = res.data.sum;
        this.flag = true;
        if (this.total == this.list.length) {
          this.flag = false;
        }
      }
    },
  },
};
</script>
<style>
page {
  background-color: #f5f5f5;
}
</style>
<style lang="scss">
.head {
  position: fixed;
  width: 100%;
  background-color: #f7d236;
  > view {
    color: #000;
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
    font-size: 26rpx;
    text-align: center;
    width: 25%;
  }
  .already {
    color: #f7d236;
  }
}
.list-item {
  margin-bottom: 10rpx;
  background-color: #fff;
}
.footer-copy {
  height: 350rpx;
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
    flex-direction: column;
    border-right: 1rpx solid #d7d7d7;
    padding: 20rpx;
    color: #f7d236;
    // font-size: 40rpx;
    // width: 150rpx;
    // height: 110rpx;
    // text-align: center;
  }
  .today {
    font-size: 30rpx;
    color: #9f9f9f;
  }
  .f-r view {
    font-size: 24rpx;
    margin-left: 30rpx;
    color: #f7d236;
    padding: 10rpx;
    margin-bottom: 10rpx;
    background: rgba(250, 245, 241, 1);
    border-radius: 46rpx;
  }
  .f-f {
    margin-top: 20rpx;
  }
}
</style>
