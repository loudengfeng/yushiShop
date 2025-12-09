<template>
  <view class="content">
    <view class="navbar"
          style="position: fixed;top: '88rpx';border-top: 2rpx solid #f4f4f4;">
		<view style="padding: 0 3%;width: 100%;display: flex;align-items: center">
			<view class="search-input">
			  <view class="search-input-box">
			    <img src="../../static/search.png"
			           mode=""></img>
			    <input type="text"
			           v-model="page.productName"
			           placeholder="请输入搜索的内容"
			           placeholder-style="font-size:26rpx;"
			            />
			  </view>
			  <view class="search-text"
			        @click="searchResult">搜索</view>
			</view>
		</view>
    </view>
    <view v-if="!goodsList.length"
          class="no-search">
      <img src="/static/no-search.png"></img>
      <view>未找到相关商品, 为您推荐以下商品</view>
    </view>
    <view class="goods-list">
      <view v-for="(item, index) in goodsList"
            :key="index"
            class="goods-item"
            @click="navToDetailPage(item.id)">
        <view class="image-wrapper">
          <!-- <image :src="item.image"
                 mode="aspectFill"></image> -->
          <easyLoadimage :image-src="item.mainImage"
                         :scroll-top="scrollTop"></easyLoadimage>
        </view>
        <text class="title clamp">{{ item.productName }}</text>
        <view class="price-box">
          <text class="price">{{ item.price }}
            <text>/元</text>
          </text>
          <!-- <text>已售 {{ item.sales }}</text> -->
        </view>
      </view>
    </view>
    <!-- <uni-load-more :status="loadingType"></uni-load-more> -->

    <view class="cate-mask"
          :class="cateMaskState === 0 ? 'none' : cateMaskState === 1 ? 'show' : ''"
          @click="toggleCateMask">
      <view class="cate-content"
            @click.stop.prevent="stopPrevent"
            @touchmove.stop.prevent="stopPrevent">
        <scroll-view scroll-y
                     class="cate-list">
          <view v-for="item in cateList"
                :key="item.id">
            <view class="cate-item b-b two">{{ item.name }}</view>
            <view v-for="tItem in item.child"
                  :key="tItem.id"
                  class="cate-item b-b"
                  :class="{ active: tItem.id == cateId }"
                  @click="changeCate(tItem)">
              {{ tItem.name }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <BaseBackTop @changeIsBackTop="changeBackTop"
                 :isBackTop="isBackTop"></BaseBackTop>
  </view>
</template>

<script>
import easyLoadimage from '../../components/easy-loadimage/easy-loadimage';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import BaseBackTop from '@/components/BaseBackTop/BaseBackTop'
export default {
  components: {
    uniLoadMore,
    easyLoadimage,
  },
  data () {
    return {
      cateMaskState: 0, //分类面板展开状态
      headerPosition: 'fixed',
      headerTop: '0px',
      loadingType: 'more', //加载更多状态
      filterIndex: 0,
      cateId: 0, //已选三级分类id
      priceOrder: 0, //1 价格从低到高 2价格从高到低
      cateList: [],
      goodsList: [],
      // 传递过来的 搜索关键字
      searchVal: '',
      typeId: 2,
      scrollTop: 0,
      // 节流阀
      flag: true,
      // 分页
      page: {
        // 当前页码值
        pageIndex: 1,
        // 每页显示的条数
        pageSize: 10,
		productName:'',
      },
      // 总的数据条数
      total: '',
      // 分类页面传递过来的 categoryIds
      categoryIds: '',
      isList: false,
      i: 0,
      // 回到顶部显示与隐藏
      isBackTop: false
    };
  },

  onLoad (options) {
      uni.setNavigationBarTitle({
        title: options.name
      })
    // 商品列表
    this.getShopList();
    // #ifdef H5
    this.headerTop =
      document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
    // #endif
    // this.loadData();
  },
  // 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
  onPageScroll (e) {
    this.scrollTop = e.scrollTop;
    if (e.scrollTop > 500) {
      this.isBackTop = true
    } else {
      this.isBackTop = false
    }
    //兼容iOS端下拉时顶部漂移
    if (e.scrollTop >= 0) {
      this.headerPosition = 'fixed';
    } else {
      this.headerPosition = 'absolute';
    }
  },
  //监听页面滚动到底部的事件
  onReachBottom () {
    this.page.pageIndex += 1;

    if (this.flag) {
      if (this.i == 1) {
        this.getShopList();
      } else if (this.i == 2) {
        if (this.priceOrder == 1) {
          this.getShopList();
        } else if (this.priceOrder == 2) {
          this.getShopList();
        }
      } else if (this.i == 0) {
        this.getShopList()
      }
    } else {
      this.$api.msg('没有更多数据了', 1500, true, 'none');
    }
    // this.loadData();
  },
  methods: {
	  searchResult(){
		  this.page.pageIndex = 1
		  this.page.pageSize = 10
		  this.goodsList = []
		  this.getShopList()
	  },
	  // 商品列表
	  async getShopList () {
	    let data = {
	  	  "page": this.page.pageIndex,
	  	  "pageSize": this.page.pageSize,
	  	  "productName": this.page.productName
	    };
	    let res = await this.$api.api.productList(data);
	    if(res.code == "000000"){
			this.total = res.data.total;
			this.flag = true;
	  	  this.goodsList.push(...res.data.records)
		  if (this.total == this.goodsList.length) {
		    this.flag = false;
		  }
	    }else {
	  	 this.$api.msg(res.msg);
	    }
	  },
    // 点击回到顶部
    changeBackTop () {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300,
      });
    },
    // 根据搜索关键字 获取商品列表数据
    async getProductList (sortBy, sortOrder) {
      let data = {
		    "page": this.page.pageIndex,
		    "pageSize": this.page.pageSize,
		    "productName": this.searchVal,
      };
      let res = await this.$api.api.productList(data);
      // 判断是否有数据 如果有数据就为这个赋值 如果没有数据就调用 猜你喜欢的接口
      console.log(res)
      if (res.data.Data.Data.length != 0) {
        this.isList = false;
        // console.log('分类有数据')
        if (res.data.status == true) {
          res.data.Data.Data.forEach((item) => {
            item.ThumbnailUrl310 =
              this.$config.domain.api + item.ThumbnailUrl310;
          });
          this.total = res.data.Data.TotalRecords;
          this.flag = true;
          this.goodsList.push(...res.data.Data.Data);
          // console.log(this.goodsList)
          if (this.total == this.goodsList.length) {
            this.flag = false;
          }
        }
      } else {
        this.isList = true;
        // 猜你喜欢的数据
        this.getIsLive(sortBy, sortOrder);
      }
    },
    // 猜你喜欢的数据
    async getIsLive (sortBy, sortOrder) {
      if (sortBy == undefined) {
        sortBy = '';
      }
      if (sortOrder == undefined) {
        sortOrder = '';
      }
      if (sortBy == 'ShowSaleCounts') {
        sortOrder = 'Desc';
      }
      let data = {
        action: 'GetProductListByPage',
        TypeId: this.typeId,
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };
      let res = await this.$api.api.productList(data);
      if (res.data.status == true) {
        // console.log('猜你喜欢有数据')
        res.data.Data.Data.forEach((item) => {
          item.ThumbnailUrl310 = this.$config.domain.api + item.ThumbnailUrl310;
        });
        this.total = res.data.Data.TotalRecords;
        this.flag = true;
        this.goodsList.push(...res.data.Data.Data);
        if (this.total == this.goodsList.length) {
          this.flag = false;
        }
      }
    },
    // 去分类页面
    goCategory () {
      uni.switchTab({
        url: '/pages/category/category',
      });
    },
    //加载商品 ，带下拉刷新和上滑加载
    async loadData (type = 'add', loading) {
      //没有更多直接返回
      if (type === 'add') {
        if (this.loadingType === 'nomore') {
          return;
        }
        this.loadingType = 'loading';
      } else {
        this.loadingType = 'more';
      }

      let goodsList = await this.$api.json.goodsList;
      if (type === 'refresh') {
        this.goodsList = [];
      }
      //筛选，测试数据直接前端筛选了
      if (this.filterIndex === 1) {
        goodsList.sort((a, b) => b.sales - a.sales);
      }
      if (this.filterIndex === 2) {
        goodsList.sort((a, b) => {
          if (this.priceOrder == 1) {
            return a.price - b.price;
          }
          return b.price - a.price;
        });
      }

      this.goodsList = this.goodsList.concat(goodsList);

      //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
      this.loadingType = this.goodsList.length > 20 ? 'nomore' : 'more';
      if (type === 'refresh') {
        if (loading == 1) {
          uni.hideLoading();
        } else {
          uni.stopPullDownRefresh();
        }
      }
    },
    //筛选点击
    tabClick (index) {
      this.goodsList = [];
      this.page.pageIndex = 1;
      if (index == 0) {
        this.i = index;
        this.filterIndex = 0;
        // if (this.filterIndex === index && index !== 2) {
        this.getProductList('ShowSaleCounts');
        return;
      }
      this.filterIndex = index;
      if (index === 2) {
        this.i = index;
        this.priceOrder = this.priceOrder === 1 ? 2 : 1;
        // this.priceOrder 的值 1 代表升序 2 代表降序
        if (this.priceOrder == 1) {
          this.getProductList('SalePrice', 'Desc');
        } else {
          this.getProductList('SalePrice', 'Asc');
        }
      } else {
        this.i = index;
        this.getProductList('ShowSaleCounts');
        this.priceOrder = 0;
      }
      uni.pageScrollTo({
        duration: 300,
        scrollTop: 0,
      });
      // this.loadData('refresh', 1);
      // uni.showLoading({
      //   title: '正在加载',
      // });
    },
    //显示分类面板
    toggleCateMask (type) {
      let timer = type === 'show' ? 10 : 300;
      let state = type === 'show' ? 1 : 0;
      this.cateMaskState = 2;
      setTimeout(() => {
        this.cateMaskState = state;
      }, timer);
    },
    //分类点击
    changeCate (item) {
      this.cateId = item.id;
      this.toggleCateMask();
      uni.pageScrollTo({
        duration: 300,
        scrollTop: 0,
      });
      // this.loadData('refresh', 1);
      // uni.showLoading({
      //   title: '正在加载',
      // });
    },
    //详情
    navToDetailPage (item) {
      uni.navigateTo({
        url: `/pages/product/product?ProductId=${item}`,
      });
    },
    stopPrevent () { },
  },
};
</script>

<style lang="scss">
	.search-input {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  width: 100%;
	  .search-input-box {
	    width: 88%;
	    height: 100%;
	    padding: 10rpx 0;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    border: 1rpx solid #eee;
	    img {
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
page,
.content {
  background: $page-color-base;
}
.easy-loadimage {
  width: 100%;
  height: 100%;
}
.content {
  padding-top: 96upx;
}
.no-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20rpx 0;
  > img {
    width: 142rpx;
    height: 150rpx;
  }
}
.navbar {
  position: fixed;
  left: 0;
  top: var(--window-top);
  display: flex;
  width: 100%;
  height: 80upx;
  background: #fff;
  box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
  z-index: 10;
  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 30upx;
    color: $font-color-dark;
    position: relative;
    &.current {
      color: $base-color;
      &:after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 120upx;
        height: 0;
        border-bottom: 4upx solid $base-color;
      }
    }
  }
  .p-box {
    display: flex;
    flex-direction: column;
    .yticon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30upx;
      height: 14upx;
      line-height: 1;
      margin-left: 4upx;
      font-size: 26upx;
      color: #888;
      &.active {
        color: $base-color;
      }
    }
    .xia {
      transform: scaleY(-1);
    }
  }
  .cate-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 80upx;
    position: relative;
    font-size: 44upx;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      border-left: 1px solid #ddd;
      width: 0;
      height: 36upx;
    }
  }
}

/* 分类 */
.cate-mask {
  position: fixed;
  left: 0;
  top: var(--window-top);
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 95;
  transition: 0.3s;

  .cate-content {
    width: 630upx;
    height: 100%;
    background: #fff;
    float: right;
    transform: translateX(100%);
    transition: 0.3s;
  }
  &.none {
    display: none;
  }
  &.show {
    background: rgba(0, 0, 0, 0.4);

    .cate-content {
      transform: translateX(0);
    }
  }
}
.cate-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  .cate-item {
    display: flex;
    align-items: center;
    height: 90upx;
    padding-left: 30upx;
    font-size: 28upx;
    color: #555;
    position: relative;
  }
  .two {
    height: 64upx;
    color: #303133;
    font-size: 30upx;
    background: #f8f8f8;
  }
  .active {
    color: $base-color;
  }
}

/* 商品列表 */
.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30upx;
  // background: #fff;
  .goods-item {
    display: flex;
    flex-direction: column;
    width: 48%;
    padding-bottom: 40upx;
    border-radius: 3px;
    background-color: #fff;
    margin-bottom: 4%;
    &:nth-child(2n + 1) {
      margin-right: 4%;
    }
    .title {
      padding: 0 10rpx;
    }
    .price {
      padding: 0 10rpx;
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
  .price-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10upx;
    font-size: 24upx;
    color: $font-color-light;
  }
  .price {
    font-size: $font-lg;
    color: $uni-color-primary;
    line-height: 1;
    &:before {
      content: "￥";
      font-size: 26upx;
    }
  }
}
</style>
