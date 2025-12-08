<template>
  <!-- 我的收藏 -->
  <view class="box">
    <view class="list">
      <!-- 每个循环的单独盒子 -->
      <view v-if="collectionList.length>0">
        <view class="list-item"
              v-for="(item, index) in collectionList"
              :key="index"
              @click="goProduct(item.ProductID)">
          <!-- 商品图片区域 -->
          <view class="item-img">
            <easyLoadimage :image-src="item.ImageUrl1"
                           :scroll-top="scrollTop"
                           mode="scaleToFill"></easyLoadimage>
          </view>
          <!-- 商品标题和价格区域 -->
          <view class="item-content">
            <view class="item-title">{{item.ProductName}}</view>
            <view class="item-price"><text>¥{{item.MinShowPrice}}</text><text style="color: #909399;"
                    @click.stop="camcel(item.ProductID,index)">取消收藏</text></view>
          </view>
        </view>
      </view>
      <view v-if="collectionList.length == 0"
            style="text-align: center;padding: 15rpx 0;color: #909399;background-color: #fff;">
        暂无收藏数据
      </view>
    </view>
  </view>
</template>

<script>
import easyLoadimage from '../../components/easy-loadimage/easy-loadimage';
export default {
  components: {
    easyLoadimage,
  },
  data() {
    return {
      page: {
        // 当前的页码值
        pageIndex: 1,
        // 当前页面显示的数据条数
        pageSize: 10
      },
      // 节流阀
      flag: true,
      // 收藏列表数据
      collectionList: [],
      // 距离底部的距离 触发图片懒加载
      scrollTop: 0,
      // 总的数据条数
      total: ''
    };
  },
  // 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
  onPageScroll({ scrollTop }) {
    this.scrollTop = scrollTop;
  },
  // 监听页面滚动到底部的事件
  onReachBottom() {
    this.page.pageIndex += 1
    if (this.flag) {
      this.getCollectionList()
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none')
    }
  },
  onShow() {
    console.log(this.collectionList)
    // 因为下面是 push 进去的 当页面的数据 所有 当进入这个页面的时候 需要先把数据情况 并且当前页码 也需要重置
    this.page.pageIndex = 1
    this.collectionList = []
    // 获取收藏列表数据
    this.getCollectionList()
  },
  methods: {
    camcel(id, index) {
      uni.showModal({
        content: '确定取消收藏?',
        success: (res) => {
          if (res.confirm) {
            this.camcels(id, index)
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    async camcels(id, index) {
      let param = {
        action: 'cancelCollection',
        ProductID: id,
      }
      let res = await this.$api.api.collection(param);
      if (res.data.status == true) {
        this.collectionList.splice(index, 1)
      }
    },
    // 获取收藏列表数据
    async getCollectionList() {
      let data = {
        action: 'GetCollectionListByPage',
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      }
      let res = await this.$api.api.collectionList(data)
      if (res.data.status == true) {
        res.data.data.Data.forEach(item => {
          item.ImageUrl1 = this.$config.domain.api + item.ImageUrl1
        })
        this.collectionList.push(...res.data.data.Data)
        this.total = res.data.data.TotalRecords
        this.flag = true
        if (this.total == this.collectionList.length) {
          this.flag = false
        }
      }
    },
    goProduct(ProductID) {
      uni.navigateTo({
        url: `/pages/product/product?ProductId=${ProductID}`,
      });
    }
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
  width: 100%;
  height: 100%;
}
.box {
  .list {
    margin-top: 20rpx;
    background-color: #eee;
    // 每个循环的单独盒子
    .list-item {
      display: flex;
      align-items: center;
      padding: 0 20rpx;
      height: 220rpx;
      margin: 20rpx 0;
      background-color: #fff;
      // 商品图片区域
      .item-img {
        height: 180rpx;
        width: 180rpx;
        margin-right: 20rpx;
        border-radius: 20rpx;
        > image {
          width: 100%;
          height: 100%;
          border-radius: 20rpx;
        }
      }
      // 商品标题和价格区域
      .item-content {
        height: 180rpx;
        width: 570rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .item-title {
          font-size: 24rpx;
          line-height: 30rpx;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .item-price {
          font-size: 30rpx;
          font-weight: 700;
          color: red;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
