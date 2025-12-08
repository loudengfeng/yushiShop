<template>
  <view class="content">
    <view class="common head">
      <view style="flex: 2">新增会员ID</view>
      <view style="flex: 1">状态</view>
      <view style="flex: 2">消费(元)</view>
      <view style="flex: 2">日期</view>
    </view>
    <view class="head-copy"></view>
    <view class="list">
      <view class="common list-item"
            v-for="(item, index) in list"
            :key="index">
        <view style="flex: 2">{{item.UserId}}</view>
        <view style="flex: 1"
              :class="item.iseffected == '已激活' ? 'activation' : ''">{{item.iseffected}}</view>
        <view style="flex: 2">{{item.effected | numFilter}}</view>
        <view style="flex: 2">{{item.lastzhituijiang}}</view>
      </view>
    </view>
    <view class="footer-copy"></view>
    <view class="footer">
      <view class="f-l">统计
        <text class="today">今日</text>
      </view>
      <view class="f-r">
        <view>新增 (个): {{statistics.sum }}</view>
        <view>激活 (个) : {{statistics.effected }}</view>
        <view>新增激活人数消费总额 (元) : {{statistics.sumEffectedBalance | numFilter}}</view>
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
        pageIndex: 0,
        // 当前页面展示的数据
        pageSize: 10
      },
      // 总的数据条数
      total: '',
      // 节流阀
      flag: true,
      // 团队数据列表
      list: [],
      // 统计数据
      statistics: {}
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
    this.page.pageIndex += 1
    if (this.flag) {
      this.getTeam()
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },
  onLoad() {
    // 获取团队人数数据
    this.getTeam()
  },
  methods: {
    // 获取团队人数数据
    async getTeam() {
      let result = {}
      result = {
        Offset: this.page.pageIndex,
        RowNumber: this.page.pageSize
      }
      result = JSON.stringify(result)
      let data = {
        action: 'ReadTeamPeople',
        data: result
      }
      let res = await this.$api.api.team(data)
      console.log(res)
      if (res.data.status == true) {
        res.data.data.forEach(item => {
          item.lastzhituijiang = item.lastzhituijiang.split(' ')[0]
          if (item.iseffected == 0) {
            item.iseffected = '未激活'
          } else if (item.iseffected == 1) {
            item.iseffected = '已激活'
          }
          if (item.effected == '') {
            item.effected = 0
          }
        })
        this.flag = true
        this.total = res.data.sum
        this.list.push(...res.data.data)
        this.statistics = res.data.statistics
        // console.log(res.data.statistics)
        this.statistics = res.data.statistics
        if (this.statistics.effected == '') {
          this.statistics.effected = 0
        }
        if (this.statistics.sum == '') {
          this.statistics.sum = 0
        }
        if (this.statistics.sumEffectedBalance == '') {
          this.statistics.sumEffectedBalance = 0
        }
        if (this.total == this.list.length) {
          this.flag = false
        }
      }
    }
  },
};
</script>

<style lang="scss">
.head {
  position: fixed;
  width: 100%;
  background-color: #85b0e1;
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
  .activation {
    color: #dfa25d;
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
    color: #396383;
  }
  .today {
    font-size: 30rpx;
    color: #9f9f9f;
  }
  .f-r {
    margin-left: 30rpx;
    > view {
      font-size: 24rpx;
      color: #396383;
      padding: 10rpx;
      margin-bottom: 10rpx;
      background: rgba(236, 242, 247, 1);
      border-radius: 46rpx;
    }
  }
  .f-f {
    margin-top: 20rpx;
  }
}
</style>