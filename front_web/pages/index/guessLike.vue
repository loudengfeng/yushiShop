<template>
  <view>
    <view>
      <view class="f-header m-t">
        <view class="tit-box">
          <text class="tit">猜你喜欢</text>
          <text class="tit2">Guess You Like It</text>
        </view>
      </view>
      <view class="guess-section">
        <view v-for="(item, index) in liveList"
              :key="index"
              class="guess-item"
              @click="navToDetailPage(item.ProductId)">
          <view class="image-wrapper">
            <!-- <image :src="item.ThumbnailUrl310"
                 mode="aspectFill"></image> -->
            <easyLoadimage :image-src="item.ThumbnailUrl310"
                           :scroll-top="scrollTop"></easyLoadimage>
          </view>
          <text class="floor-item-common title clamp">{{
            item.ProductName
          }}</text>
          <text class="floor-item-common price">￥{{ item.SalePrice }}<text v-if="item.Unit == '' ? false:true">/{{item.Unit}}</text></text>
        </view>
      </view>
    </view>
    <BaseBackTop @changeIsBackTop="changeBackTop"
                 ref="backTop"
                 :isBackTop="isBackTop"></BaseBackTop>
  </view>
</template>

<script>
import BaseBackTop from '@/components/BaseBackTop/BaseBackTop';
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage';
export default {
  components: {
    easyLoadimage,
    BaseBackTop,
  },
  data () {
    return {
      typeId: 2,
      // 分页
      page: {
        // 当前显示的页码值
        pageIndex: 1,
        // 每页显示的条数
        pageSize: 10,
      },
      // 猜你喜欢的数据
      liveList: [],
      // 总的数据条数
      total: '',
      // 节流阀
      flag: true,
      // 猜你喜欢
      scrollTop: 0,
      // 回到顶部显示与隐藏
      isBackTop: false,
    };
  },
  onLoad () {
    // 获取猜你喜欢商品列表
    this.getLive();
  },
  // 监听页面滚动到底部的事件
  onReachBottom () {
    this.page.pageIndex += 1;
    if (this.flag) {
      this.getLive();
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
  },
  // 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
  onPageScroll ({ scrollTop }) {
    if (scrollTop > 500) {
      this.isBackTop = true;
    } else {
      this.isBackTop = false;
    }
    this.scrollTop = scrollTop;
  },
  methods: {
    // 点击回到顶部
    changeBackTop () {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300,
      });
    },
    // 获取猜你喜欢数据
    async getLive () {
      let data = {
        action: 'GetProductListByPage',
        TypeId: this.typeId,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        sortOrder: 'Desc',
        sortBy: 'DisplaySequence',
      };
      let res = await this.$api.api.productList(data);
      if (res.data.status == true) {
        res.data.Data.Data.forEach((item) => {
          item.ThumbnailUrl310 = this.$config.domain.api + item.ThumbnailUrl310;
        });
        this.liveList.push(...res.data.Data.Data);
        this.total = res.data.Data.TotalRecords;
        this.flag = true;
        if (this.total == this.liveList.length) {
          this.flag = false;
        }
      }
    },
    // 去详情页面
    navToDetailPage (ProductId) {
      uni.navigateTo({
        url: `/pages/product/product?ProductId=${ProductId}`,
      });
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
.easy-loadimage {
  height: 330rpx;
}
// 猜你喜欢
.f-header {
  display: flex;
  align-items: center;
  height: 140upx;
  padding: 6upx 30upx 8upx;
  background: #fff;
  image {
    flex-shrink: 0;
    width: 80upx;
    height: 80upx;
    margin-right: 20upx;
  }
  .tit-box {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .tit {
    font-size: $font-lg + 2upx;
    color: #font-color-dark;
    line-height: 1.3;
  }
  .tit2 {
    font-size: $font-sm;
    color: $font-color-light;
  }
  .icon-you {
    font-size: $font-lg + 2upx;
    color: $font-color-light;
  }
}
.m-t {
  margin-top: 16upx;
}
.guess-section {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30upx;
  margin-top: 20rpx;
  // background: #fff;
  .guess-item {
    display: flex;
    flex-direction: column;
    width: 48%;
    padding-bottom: 40upx;
    background-color: #fff;
    margin-bottom: 4%;
    border-radius: 3px;
    .floor-item-common {
      margin-left: 10rpx;
    }
    &:nth-child(2n + 1) {
      margin-right: 4%;
    }
  }
  .image-wrapper {
    width: 100%;
    height: 330upx;
    border-radius: 3px;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
      opacity: 1;
    }
  }
  .title {
    font-size: $font-lg;
    color: $font-color-dark;
    line-height: 80upx;
  }
  .price {
    font-size: $font-lg;
    color: $uni-color-primary;
    line-height: 1;
  }
}
</style>
