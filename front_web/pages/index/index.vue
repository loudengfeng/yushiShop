<template>
  <view class="container">
    <!-- 头部轮播 -->
    <view class="carousel-section">
      <!-- 标题栏和状态栏占位符 -->
      <!-- <view class="titleNview-placing"></view> -->
      <!-- 背景色区域 -->
<!--     <view class="titleNview-background"
            style="background-color: #000;"></view> -->
      <swiper class="carousel"
              circular
              autoplay
              @change="swiperChange">
        <swiper-item class="carousel-item">
          <!-- <image :src="item.ImageUrl"></image> -->
          <easyLoadimage image-src="/static/newShop/banner.png"
                         :scroll-top="scrollTop"></easyLoadimage>
        </swiper-item>
        <swiper-item class="carousel-item">
          <!-- <image :src="item.ImageUrl"></image> -->
          <easyLoadimage image-src="/static/newShop/banner1.png"
                         :scroll-top="scrollTop"></easyLoadimage>
        </swiper-item>
      </swiper>
      <!-- 自定义swiper指示器 -->
      <view class="swiper-dots">
        <text class="num">{{ swiperCurrent + 1 }}</text>
        <text class="sign">/</text>
        <text class="num">{{ swiperLength }}</text>
      </view>
    </view>
    <!-- 分类 -->
    <view class="cate-section">
      <view class="cate-item"
            @click="jump('/pages/category/category', 1377)">
        <image src="/static/temp/c12.jpg"></image>
        <text>我的粉丝</text>
      </view>
      <view class="cate-item"
            @click="jump('/pages/product/list', 18)">
        <image src="/static/temp/c11.jpg"></image>
        <text>购物专区</text>
      </view>
      <view class="cate-item"
            @click="jump('/pages/order/order?state=0')">
        <image src="/static/temp/c13.png"></image>
        <text>我的订单</text>
      </view>
      <view class="cate-item"
            @click="jump('/pages/category/category', 1364 )">
        <image src="/static/temp/c10.jpg"></image>
        <text>新闻资讯</text>
      </view>
      <!-- <view class="cate-item"
            @click="jump('/pages/category/category', 1377)">
        <image src="/static/temp/c7.png"></image>
        <text>活动产品</text>
      </view> -->
      <!-- <view class="cate-item"
            @click="jump('/pages/category/category', 1364)">
        <image src="/static/temp/c8.png"></image>
        <text>积分商城</text>
      </view> -->
    </view>


    <!-- 分类推荐楼层 -->
    <view class="f-header m-t"
          v-if="isArr">
      <!-- <image src="/static/temp/h1.png"></image> -->
      <view class="tit-box">
        <text class="tit">分类精选</text>
        <text class="tit2">Competitive Products For You</text>
      </view>
      <!-- <text class="yticon icon-you"></text> -->
    </view>
    <view class="cate-box"
          v-if="isArr">
      <view v-for="(item, index) in arr"
            :key="index"
            style="height: 100%">
        <view class="hot-floor"
              v-if="item.flag">
          <scroll-view class="floor-list"
                       scroll-x>
            <view class="scoll-wrapper">
              <view v-for="(x, i) in item.goodsChildrenList"
                    :key="i"
                    class="floor-item"
                    @click="navToDetailPage(x.ProductId)">
                <!-- <image :src="item.ThumbnailUrl180"
                       mode="aspectFill"></image> -->
                <easyLoadimage :image-src="x.ThumbnailUrl310"
                               :scroll-top="scrollTop"></easyLoadimage>
                <text class="floor-item-common title clamp">{{
                  x.ProductName
                }}</text>
                <text class="floor-item-common price">￥{{ x.SalePrice }}</text>
                <text v-if="x.Unit == '' ? false : true">{{x.Unit}}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>

    <!-- 查看更多 -->
    <view class="f-header m-t"
          :class="isArr == true ? 'live-box':''"
          @click="goguessLike">
      <!-- <image src="/static/temp/h1.png"></image> -->
      <view class="tit-box">
        <text class="tit">查看更多</text>
        <text class="tit2">View More</text>
      </view>
      <text class="yticon icon-you"></text>
    </view>

    <view class="guess-section">
      <view v-for="(item, index) in liveList"
            :key="index"
            class="guess-item"
            @click="navToDetailPage(item.id)">
        <view class="image-wrapper">
          <!-- <image :src="item.ThumbnailUrl310"
                 mode="aspectFill"></image> -->
          <easyLoadimage :image-src="item.mainImage"
                         :scroll-top="FooterScrollTop"></easyLoadimage>
        </view>
        <text class="floor-item-common title clamp">{{
          item.productName
        }}</text>
        <text class="floor-item-common price">￥{{ item.price }}<text>/元</text></text>
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
  data () {
    return {
      titleNViewBackground: '#000',
      result: '',
      // 当前的轮播图
      swiperCurrent: 0,
      // 轮播图总数
      swiperLength: 0,
      // 轮播图数据
      carouselList: [{
		  ImageUrl: '/static/newShop/banner.png'
	  },{
		  ImageUrl: '/static/newShop/banner1.png'
	  }],
      // 产品数据
      goodsList: [],
      // 分类精选
      scrollTop: 0,
      // 猜你喜欢
      FooterScrollTop: 0,
      // 父类的数据和子类的数据
      arr: [],
      isArr: '',
      typeId: 2,
      // 猜你喜欢数据列表
      liveList: [{
		  url:'https://img.alicdn.com/imgextra/i4/2218958712150/O1CN01hl59wl1RkkdRttjDw_!!2218958712150-0-alimamacc.jpg',
		  ProductName: '翡翠玉石',
		  SalePrice: '9999.99',
		  Unit: '元'
	  },{
		  url: 'https://img.alicdn.com/imgextra/i1/2220576047879/O1CN01zbwcof284dhYgx7Lk_!!2220576047879-0-alimamacc.jpg',
		  ProductName: '翡翠玉石',
		  SalePrice: '9999.99',
		  Unit: '元'
	  },{
		  url: 'https://img.alicdn.com/imgextra/i2/1963154802/O1CN01SZpaE11lLMvWrgmrb_!!1963154802-0-alimamacc.jpg',
		  ProductName: '翡翠玉石',
		  SalePrice: '9999.99',
		  Unit: '元'
	  }],
      // 分页
      page: {
        // 当前页码值
        pageIndex: 1,
        // 每页显示的条数
        pageSize: 10,
      },
      // 总的数据条数
      total: '',
      // 节流阀
      flag: true,
      // 判断分类精选是否显示
      isArr: '',
      // 判断是否有分类精选数据
      isGoodsChildrenList: false,
    };
  },
  // 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
  onPageScroll ({ scrollTop }) {
    this.scrollTop = scrollTop;
    this.FooterScrollTop = scrollTop;
  },
  // 监听页面滚动到底部的事件
  // onReachBottom() {
  //   this.page.pageIndex += 1;
  //   if (this.flag) {
  //     this.getIsLive();
  //   } else {
  //     this.$api.msg('我可是有底线的', 1500, true, 'none');
  //   }
  // },
  onLoad () {
    //获取商品列表数据
    // this.getHomeCategoriesList();
    //获取轮播图
    // this.getSipwer();
    // 商品列表
    // this.getShopList();
  },
  onShow(){
	  // 商品列表
	  this.getShopList();
  },
  methods: {
    jump (url) {
      uni.navigateTo({
        url: url,
      });
    },
    // 点击轮播图
    swiperClick (url) {
      uni.navigateTo({
        url: url,
      });
    },
    // 获取轮播图
    async getSipwer () {
      let data = {
        action: 'GetBannerList',
      };
      let res = await this.$api.api.swiper(data);
      // console.log(res.data.Data)
      if (res.data.status == true) {
        // let dta = new Date().getTime()
        res.data.Data.forEach((item, index) => {
          item.ImageUrl = this.$config.domain.api + item.ImageUrl;
          // item.ImageUrl = this.$config.domain.api + item.ImageUrl + "?id=" + dta;
        });
        this.carouselList = res.data.Data;
        // console.log(this.carouselList);
        this.swiperLength = this.carouselList.length;
      }
    },
    // 获取首页分类数据
    async getHomeCategoriesList () {
      let data = {
        action: 'GetHomeCategoriesList',
        IsHomePage: 1,
        typeId: this.typeId,
      };
      let res = await this.$api.api.homeCategoriesList(data);
      // console.log(res.data.Data.Data);
      if (res.data.status == true) {
        this.goodsList = res.data.Data.Data;
        for (let i = 0; i < this.goodsList.length; i++) {
          this.arr.push(this.goodsList[i]);
          console.log(this.arr)
          if (this.arr.length == 0) {
            this.isArr = false
          } else {
            this.isArr = true
          }
          this.getProductList(this.goodsList[i].CategoryId, this.arr, i);
        }
        // console.log(this.arr)
      }
    },
    // 获取首页分类下面的列表数据
    async getProductList (CategoryId, arr, index) {
      let data = {
        action: 'GetProductListByPage',
        categoryIds: CategoryId,
        TypeId: this.typeId,
      };
      let res = await this.$api.api.productList(data);
      // console.log(res)
      // console.log(res.data.Data.Data)
      res.data.Data.Data.forEach((item) => {
        item.ThumbnailUrl310 = this.$config.domain.api + item.ThumbnailUrl310;
      });
      // console.log(res.data.Data.Data)
      this.arr[index].goodsChildrenList = res.data.Data.Data;
      if (this.arr[index].goodsChildrenList.length > 0) {
        this.arr[index].flag = true;
      } else {
        this.arr[index].flag = false;
      }
      if (res.data.Data.Data.length == 0) {
        this.isArr = false;
      } else {
        this.isArr = true;
      }
    },
    // 商品列表
    async getShopList () {
      let data = {
		  "page": this.page.pageIndex,
		  "pageSize": this.page.pageSize,
		  "productName": ""
      };
      let res = await this.$api.api.productList(data);
	  if(res.code == "000000"){
		  this.liveList = res.data.records
	  }else {
		 this.$api.msg(res.msg);
	  }
    },
    // 去猜你喜欢页面
    goguessLike () {
      uni.navigateTo({
        url: '/pages/product/list',
      });
    },
    /**
     * 请求静态数据只是为了代码不那么乱
     * 分次请求未作整合
     */
    async loadData () {
      let carouselList = await this.$api.json.carouselList;
      this.titleNViewBackground = carouselList[0].background;
      this.swiperLength = carouselList.length;
      this.carouselList = carouselList;
      let goodsList = await this.$api.json.goodsList;
      this.goodsList = goodsList || [];
    },
    //轮播图切换修改背景色
    swiperChange (e) {
      const index = e.detail.current;
      this.swiperCurrent = index;
      this.titleNViewBackground = this.carouselList[index].background;
    },
    //详情页
    navToDetailPage (ProductId) {
      uni.navigateTo({
        url: `/pages/product/product?ProductId=${ProductId}`,
      });
    },
    // #ifdef APP-PLUS
    async checkPermission (code) {
      let status = permision.isIOS
        ? await permision.requestIOS('camera')
        : await permision.requestAndroid('android.permission.CAMERA');

      if (status === null || status === 1) {
        status = 1;
      } else {
        uni.showModal({
          content: '需要相机权限',
          confirmText: '设置',
          success: function (res) {
            if (res.confirm) {
              permision.gotoAppSetting();
            }
          },
        });
      }
      return status;
    },
    // #endif
  },
  // #ifndef MP
  // 标题栏input搜索框点击
  onNavigationBarSearchInputClicked: async function (e) {
    uni.navigateTo({
      url: `/pages/search/search`,
    });
  },
  // 点击导航栏 buttons 时触发
  // onNavigationBarButtonTap (e) {
  //   const index = e.index;
  //   console.log(index);
  // },
  // #endif
};
</script>
<style>
page {
  background-color: #f5f5f5;
}
</style>
<style lang="scss" scoped>
/* mode为widthFix即图片高度自适应时要设置占位图默认高度 */
.loadfail-img,
.loading-img {
  height: 500rpx;
}
.easy-loadimage {
  height: 100%;
}
/* #ifdef MP */
.mp-search-box {
  position: absolute;
  left: 0;
  top: 30upx;
  z-index: 9999;
  width: 100%;
  padding: 0 80upx;
  .ser-input {
    flex: 1;
    height: 56upx;
    line-height: 56upx;
    text-align: center;
    font-size: 28upx;
    color: $font-color-base;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.6);
  }
}
page {
  .cate-section {
    position: relative;
    z-index: 5;
    border-radius: 16upx 16upx 0 0;
    margin-top: -20upx;
  }
  .carousel-section {
    padding: 0;
    .titleNview-placing {
      padding-top: 0;
      height: 0;
    }
    .carousel {
      .carousel-item {
        padding: 0;
      }
    }
    .swiper-dots {
      left: 45upx;
      bottom: 40upx;
    }
  }
}
/* #endif */

page {
  background: #f5f5f5;
}
.m-t {
  margin-top: 16upx;
}
/* 头部 轮播图 */
.carousel-section {
  position: relative;
  // padding-top: 10px;

  .titleNview-placing {
    height: var(--status-bar-height);
    padding-top: 44px;
    box-sizing: content-box;
  }

  .titleNview-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 426upx;
    transition: 0.4s;
  }
}
.carousel {
  width: 100%;
  height: 410rpx;

  .carousel-item {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  image {
    width: 100%;
    height: 100%;
    border-radius: 10upx;
  }
}
.swiper-dots {
  display: flex;
  position: absolute;
  left: 60upx;
  bottom: 15upx;
  width: 72upx;
  height: 36upx;
  // color: #000;
  border-radius: 18rpx;
  background-color: #000;

  // background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
  background-size: 100% 100%;

  .num {
    width: 36upx;
    height: 36upx;
    border-radius: 50px;
    font-size: 24upx;
    color: #fff;
    text-align: center;
    line-height: 36upx;
  }

  .sign {
    position: absolute;
    top: 0;
    left: 50%;
    line-height: 36upx;
    font-size: 12upx;
    color: #fff;
    transform: translateX(-50%);
  }
}
/* 分类 */
.cate-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 30upx 22upx;
  background: #fff;
  .cate-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: $font-sm + 2upx;
    color: $font-color-dark;
  }
  /* 原图标颜色太深,不想改图了,所以加了透明度 */
  image {
    width: 88upx;
    height: 88upx;
    margin-bottom: 14upx;
    border-radius: 50%;
    opacity: 0.7;
    // box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
  }
}
.ad-1 {
  width: 100%;
  height: 210upx;
  padding: 10upx 0;
  background: #fff;
  image {
    width: 100%;
    height: 100%;
  }
}
/* 秒杀专区 */
.seckill-section {
  padding: 4upx 30upx 24upx;
  background: #fff;
  .s-header {
    display: flex;
    align-items: center;
    height: 92upx;
    line-height: 1;
    .s-img {
      width: 140upx;
      height: 30upx;
    }
    .tip {
      font-size: $font-base;
      color: $font-color-light;
      margin: 0 20upx 0 40upx;
    }
    .timer {
      display: inline-block;
      width: 40upx;
      height: 36upx;
      text-align: center;
      line-height: 36upx;
      margin-right: 14upx;
      font-size: $font-sm + 2upx;
      color: #fff;
      border-radius: 2px;
      background: rgba(0, 0, 0, 0.8);
    }
    .icon-you {
      font-size: $font-lg;
      color: $font-color-light;
      flex: 1;
      text-align: right;
    }
  }
  .floor-list {
    white-space: nowrap;
  }
  .scoll-wrapper {
    display: flex;
    align-items: flex-start;
  }
  .floor-item {
    width: 150upx;
    margin-right: 20upx;
    font-size: $font-sm + 2upx;
    color: $font-color-dark;
    line-height: 1.8;
    .easy-loadimage {
      width: 150upx !important;
      height: 150upx !important;
      border-radius: 6upx !important;
    }
    image {
      width: 150upx;
      height: 150upx;
      border-radius: 6upx;
    }
    .price {
      color: $uni-color-primary;
    }
  }
}
.floor-item-common {
  margin-left: 10rpx;
}
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
/* 团购楼层 */
.group-section {
  background: #fff;
  .g-swiper {
    height: 650upx;
    padding-bottom: 30upx;
  }
  .g-swiper-item {
    width: 100%;
    padding: 0 30upx;
    display: flex;
  }
  image {
    width: 100%;
    height: 460upx;
    border-radius: 4px;
  }
  .g-item {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .left {
    flex: 1.2;
    margin-right: 24upx;
    .t-box {
      padding-top: 20upx;
    }
  }
  .right {
    flex: 0.8;
    flex-direction: column-reverse;
    .t-box {
      padding-bottom: 20upx;
    }
  }
  .t-box {
    height: 160upx;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    line-height: 1.6;
  }
  .price {
    color: $uni-color-primary;
  }
  .m-price {
    font-size: $font-sm + 2upx;
    text-decoration: line-through;
    color: $font-color-light;
    margin-left: 8upx;
  }
  .pro-box {
    display: flex;
    align-items: center;
    margin-top: 10upx;
    font-size: $font-sm;
    color: $font-base;
    padding-right: 10upx;
  }
  .progress-box {
    flex: 1;
    border-radius: 10px;
    overflow: hidden;
    margin-right: 8upx;
  }
}
.cate-box {
  height: 300rpx;
}
/* 分类推荐楼层 */
.hot-floor {
  width: 100%;
  // overflow: hidden;
  margin-bottom: 20upx;
  .floor-img-box {
    width: 100%;
    height: 320upx;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(255, 255, 255, 0.06) 30%, #f8f8f8);
    }
  }
  .floor-img {
    width: 100%;
    height: 100%;
  }
  .floor-list {
    white-space: nowrap;
    padding: 20upx;
    padding-right: 50upx;
    border-radius: 6upx;
    margin-top: 20upx;
    margin-left: 0upx;
    background: #fff;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1;
  }
  .scoll-wrapper {
    display: flex;
    // align-items: flex-start;
    // justify-content: space-evenly;
  }
  .floor-item {
    width: 280upx;
    // margin-right: 20upx;
    // #ifdef APP-PLUS
    .easy-loadimage {
      width: 150upx !important;
      height: 150upx !important;
      border-radius: 6upx !important;
      image {
        width: 100%;
        height: 100%;
      }
    }
    // #endif
    font-size: $font-sm + 2upx;
    color: $font-color-dark;
    line-height: 1.8;
    .easy-loadimage {
      width: 250upx !important;
      height: 250upx !important;
      border-radius: 6upx !important;
    }
    image {
      width: 180upx;
      height: 180upx;
      border-radius: 6upx;
    }
    .price {
      color: $uni-color-primary;
    }
  }
  .more {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-shrink: 0;
    width: 180upx;
    height: 180upx;
    border-radius: 6upx;
    background: #f3f3f3;
    font-size: $font-base;
    color: $font-color-light;
    text:first-child {
      margin-bottom: 4upx;
    }
  }
}
.live-box {
  margin-top: 100rpx;
}
/* 猜你喜欢 */
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
