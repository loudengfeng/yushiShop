<template>
  <view class="evalution-box">
    <view class="evalution-box-hd">
      <view :class="item.id == current ? 'active' : ''"
            v-for="(item, index) in tabText"
            :key="index"
            @click="changeTab(item.id)">{{ item.text }}<text>{{ item.num }}</text></view>
    </view>
    <view v-if="this.evaluateList.length"
          class="evalution-list-box">
      <view class="evalution-list"
            v-for="(item, index) in evaluateList"
            :key="index">
        <view class="list-hd">
          <view class="img-box">
            <image :src="item.UserHead"
                   mode=""></image>
          </view>
          <view class="shop-rule">
            <view class="shop-name">{{ item.UserName }}</view>
            <view class="shop-rule-box">{{ item.EvaluteDate }}</view>
            <view class="shop-rule-box">{{ item.Attributes }} {{ item.AttributesValue }}</view>
          </view>
        </view>
        <view class="evalution-content">
          {{ item.Evaluation }}
        </view>
        <view v-if="item.EvaluateImgUrlList[0] == '' ? false : true"
              class="evalution-img-list">
          <view v-for="(x, i) in item.EvaluateImgUrlList"
                :key="i">
            <image :src="x"
                   mode=""></image>
          </view>
        </view>
      </view>
    </view>
    <view v-else
          class="no-evaluate">暂无评价数据</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // tab 栏数据
      tabText: [
        {
          id: '3',
          text: '好评',
          num: null,
        },
        {
          id: '2',
          text: '中评',
          num: null,
        },
        {
          id: '1',
          text: '差评',
          num: null,
        },
      ],
      // 评价的列表数据
      evaluateList: [],
      // 默认选中项
      current: 3,
      // 商品 id
      ProductId: '',
      // 分页
      page: {
        // 显示的当前页码
        pageIndex: 0,
        // 每页显示的条数
        pageSize: 10,
      },
      // 总的数据条数
      total: '',
      // 节流阀
      flag: true,
    };
  },
  onLoad(options) {
    this.ProductId = options.ProductId;
    // 获取商品的评价
    this.getSeeShopEvaluate();
  },
  // 监听页面滚动到底部的事件
  onReachBottom() {
    this.page.pageIndex += 1;
    if (this.flag) {
      this.getSeeShopEvaluate();
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },
  methods: {
    // 点击切换 tab 栏的时候触发
    changeTab(id) {
      this.current = id;
      this.page.pageIndex = 0;
      this.evaluateList = [];
      this.getSeeShopEvaluate();
    },
    // 获取商品的评价
    async getSeeShopEvaluate(id) {
      let result = {};
      result = {
        ProductId: this.ProductId,
        Score: this.current,
        Offset: this.page.pageIndex,
        RowNumber: this.page.pageSize,
        OrderBy: 'desc',
      };
      result = JSON.stringify(result);
      let data = {
        action: 'ReadEvaluation',
        data: result,
      };
      let res = await this.$api.api.seeShopEvaluate(data);
      if (res.data.status == true) {
        this.evaluateList.push(...res.data.data.data);
        console.log(this.evaluateList);
        this.flag = true;
        // 总的数据条数
        this.total = res.data.data.zongshu;
        var obj = this.tabText.find((item) => {
          return item.id == this.current;
        });
        obj.num = this.evaluateList.length;
        if (this.total == this.evaluateList.lenght) {
          this.flag = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.evalution-box {
  .evalution-box-hd {
    display: flex;
    justify-content: space-evenly;
    padding: 30rpx 3%;
    > view {
      height: 40rpx;
      background-color: #f2f2f2;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 30rpx;
      > text {
        margin-left: 10rpx;
      }
    }
    .active {
      background-color: #323f6c;
      color: #fff;
    }
  }
  .evalution-list-box {
    border-top: 6rpx solid #f5f5f5;
    padding: 40rpx 3%;
    .evalution-list {
      padding-bottom: 40rpx;
      border-bottom: 1rpx solid #f5f5f5;
      .list-hd {
        display: flex;
        align-items: center;
        .img-box {
          height: 70rpx;
          width: 70rpx;
          border-radius: 50%;
          image {
            height: 100%;
            width: 100%;
            border-radius: 50%;
          }
        }
      }
      .shop-rule {
        width: 80%;
        margin-left: 20rpx;
        .shop-name {
          font-size: 26rpx;
          font-weight: 500;
          color: #000;
        }
        .shop-rule-box {
          font-size: 22rpx;
          color: #6b6b6b;
        }
      }
      .evalution-content {
        clear: both;
      }
      .evalution-img-list {
        display: flex;
        flex-wrap: wrap;
        view {
          width: 25%;
          height: 154rpx;
          margin: 10rpx;
          image {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
    .evalution-content {
      font-size: 26rpx;
      color: #000;
      padding: 10rpx 0;
      font-weight: 500;
    }
  }
  .no-evaluate {
    border-top: 3px solid #f5f5f5;
    padding-top: 20rpx;
    text-align: center;
    font-size: 40rpx;
  }
}
</style>
