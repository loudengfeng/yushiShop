<template>
  <view class="search-box">
    <view class="search-input">
      <view class="search-input-box">
        <image src="../../static/search.png"
               mode=""></image>
        <input type="text"
               v-model="searchVal"
               placeholder="请输入搜索的内容"
               placeholder-style="font-size:26rpx;"
               @confirm="searchResult" />
      </view>
      <view class="search-text"
            @click="searchResult">搜索</view>
    </view>

    <!-- 历史记录 -->
    <view class="history-box"
          v-if="isHistoryList">
      <view class="history-title">
        <text>历史记录</text>
        <text @click="removeHistory">清空</text>
      </view>
      <view class="history-list">
        <view v-if="isHistoryList"
              class="history-list-item">
          <view v-for="(item, index) in historyList"
                :key="index"
                @click="clickHistory(index)">{{ item }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 搜索内容
      searchVal: '',
      // 搜索历史记录
      history: [],
      // 需要渲染到页面的历史搜索记录
      historyList: [],
    };
  },
  onShow() {
    if (uni.getStorageSync('history') != '') {
      this.historyList = uni.getStorageSync('history');
    } else {
      this.historyList = uni.getStorageSync('history');
    }
  },
  methods: {
    // 点击搜索
    searchResult() {
      if (this.searchVal != '') {
        if (this.history.length <= 9) {
          this.history.unshift(this.searchVal);
          this.history = Array.from(new Set(this.history));
        } else {
          this.history.splice(10);
          this.history.unshift(this.searchVal);
        }
        uni.setStorageSync('history', this.history);
        uni.navigateTo({
          url: '/pages/product/list?searchVal=' + this.searchVal,
        });
        this.searchVal = '';
      } else {
        this.$api.msg('请输入内容');
      }
    },
    // 点击搜索历史
    clickHistory(index) {
      this.searchVal = this.historyList[index];
    },
    // 清除历史记录
    removeHistory() {
      uni.showModal({
        content: '确定删除全部历史记录',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('history');
            this.historyList = [];
          } else if (res.cancel) {
          }
        },
      });
    },
  },
  computed: {
    isHistoryList() {
      if (this.historyList.length == 0) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped lang="scss">
.search-box {
  padding: 10px 3%;
  .search-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .search-input-box {
      width: 88%;
      height: 100%;
      padding: 10rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1rpx solid #eee;
      image {
        height: 28rpx;
        width: 28rpx;
        margin-left: 20rpx;
      }
      input {
        font-size: 26rpx;
        width: 90%;
      }
    }
    .search-text {
      width: 12%;
      height: 100%;
      font-size: 30rpx;
      text-align: center;
    }
  }
  .history-box {
    position: relative;
    .history-title {
      margin: 30rpx 0;
      display: flex;
      justify-content: space-between;
      > text {
        font-size: 30rpx;
        font-weight: 600;
        color: #121212;
      }
    }
    .history-list {
      .history-list-item {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        > view {
          color: #666666;
          background-color: #f8f8f8;
          padding: 3rpx 20rpx;
          margin: 0 10rpx 20rpx;
          border-radius: 5rpx;
        }
      }
    }
  }
}
</style>
