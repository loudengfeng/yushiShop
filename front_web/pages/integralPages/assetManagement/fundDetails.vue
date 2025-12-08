<template>
  <view class="content">
    <!-- 头部区域 -->
    <view class="common head">
      <view style="flex: 1;">序号</view>
      <view style="flex: 2;">日期</view>
      <view style="flex: 2;"
            v-if="Pattern == 1 ? true : false">消费金额(<text>元</text>)</view>
      <view style="flex: 2;"
            v-else>交易FC</view>
      <view style="flex: 2;"
            v-if="Pattern == 1 ? true : false">剩余金额(<text>元</text>)</view>
      <view style="flex: 2;"
            v-else>剩余FC</view>
    </view>
    <view class="head-copy"></view>
    <view class="list">
      <view class="common list-item"
            v-for="(item, index) in list"
            :key="index"
            @click="open(index)">
        <view style="flex: 1;">{{ index + 1 }}</view>
        <view style="flex: 2;">{{ item.addtime | addtimes }}</view>
        <view style="flex: 2;">{{ item.UpdateBalance }}</view>
        <view style="flex: 2;">{{ item.AfterBalance }}</view>
      </view>
    </view>
    <!-- 详细数据的弹框展示 -->
    <uni-popup ref="popup"
               type="center">
      <view class="box">
        <view>{{ Description }}</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
  components: {
    uniPopup,
  },
  data () {
    return {
      // 金额类型 1 是余额 5是鱼币
      Pattern: '',
      // 数据列表
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
      // 详细数据
      Description: '',
    };
  },
  // 监听页面滚动到底部的事件
  onReachBottom () {
    this.page.pageIndex += 1;
    if (this.flag) {
      this.getList();
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },
  onLoad (options) {
    this.Pattern = options.Pattern;
    this.getList();
  },
  methods: {
    open (index) {
      this.Description = this.list[index].Description;
      this.$refs.popup.open();
    },
    async getList () {
      let data = {
        action: 'GetMoneyDetail',
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        Pattern: this.Pattern,
      };
      let res = await this.$api.api.sendcode(data);
      if (res.data.status == true) {
        this.list.push(...res.data.data.Data);
        this.flag = true;
        this.total = res.data.data.TotalRecords;
        if (this.total == this.list.length) {
          this.flag = false;
        }
      }
    },
  },
  filters: {
    addtimes (val) {
      return (val = val.replace('T', ' '));
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
}
</style>
<style lang="scss">
.head {
  position: fixed;
  width: 100%;
  background-color: #dfa15a;
  > view {
    color: #fff;
    > text {
      font-size: 22rpx;
    }
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
  padding: 60rpx 0;
}
// 详细数据的弹框展示
.box {
  padding: 30rpx;
  width: 500rpx;
  border-radius: 10rpx;
  background-color: #fff;
  > view {
    text-indent: 2em;
  }
}
</style>
