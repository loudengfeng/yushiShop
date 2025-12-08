<template>
  <view class="container">
    <view class="carousel">
      <swiper indicator-dots
              circular="true"
              autoplay
              duration="400">
        <swiper-item class="swiper-item"
                     v-for="(item, index) in shopDetails.subImages"
                     :key="index">
          <view class="image-wrapper">
            <img style="width: 100%;height: 100%;" :src="item"
                   class="loaded"
                   ></img>
            <!-- <easyLoadimage :image-src="item"
                           :scroll-top="scrollTop"></easyLoadimage> -->
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="introduce-section">
      <text class="title">{{shopDetails.productName}}</text>
      <view class="price-box">
        <text class="price-tip">¥</text>
        <text class="price">{{shopDetails.price}}</text>
        <text>/元</text>
        <!-- <text class="m-price">¥{{ shopDetails.MarketPrice }}</text> -->
        <!-- <text class="coupon-tip">7折</text> -->
      </view>
	  <view class="bot-row">
	  		  <text>发布时间: {{ shopDetails.createTime }}</text>
	  </view>
      <view class="bot-row">
<!--        <text>销量: {{ shopDetails.ShowSaleCounts }}</text> -->
        <text>所属人: {{ shopDetails.belongUser.realName }}</text>
        <text>联系方式: {{shopDetails.belongUser.userMobile}}</text>
      </view>
    </view>

    <!--  分享 -->
    <!-- <view class="share-section"
          @click="share">
      <view class="share-icon">
        <text class="yticon icon-xingxing"></text>
        返
      </view>
      <text class="tit">该商品分享可领49减10红包</text>
      <text class="yticon icon-bangzhu1"></text>
      <view class="share-btn">
        立即分享
        <text class="yticon icon-you"></text>
      </view>
    </view> -->

    <view class="c-list">
<!--      <view class="c-row b-b"
            @click="toggleSpec(1)">
        <text class="tit">购买类型</text>
        <view class="con">
          <text class="selected-text"
                v-for="(sItem, sIndex) in specSelected"
                :key="sIndex">{{ sItem.name }}</text>
        </view>
        <text class="yticon icon-you"></text>
      </view> -->
      <view class="c-row b-b">
        <text class="tit">服务</text>
        <view class="bz-list con">
          <text>七天内可换货, 一站式配送到家</text>
        </view>
      </view>
    </view>

    <!-- 评价 -->
    <view v-if="total == 0 ? false : true"
          class="eva-section"
          @click="jump">
      <view class="e-header">
        <text class="tit">评价</text>
        <text>({{ this.total }})</text>
        <!-- <text class="tip">好评率 100%</text> -->
        <text class="tip yticon icon-you"></text>
      </view>
      <view class="eva-box"
            v-for="(item, index) in evaluateList"
            :key="index">
        <image class="portrait"
               :src="item.UserHead"
               mode="aspectFill"></image>
        <view class="right">
          <text class="name">{{ item.UserName }}</text>
          <text class="con">{{ item.Evaluation }}</text>
          <view class="img-box"
                v-if="item.EvaluateImgUrlList.length > 1 ? true : false">
            <image v-for="(x, i) in item.EvaluateImgUrlList"
                   :key="i"
                   :src="x"></image>
          </view>
          <view class="bot">
            <view>购买类型：{{ item.AttributesValue }}</view>
            <view>{{ item.EvaluteDate }}</view>
          </view>
        </view>
      </view>
    </view>

    <view class="detail-desc">
      <view class="d-header"><text>图文详情</text></view>
      <!-- <rich-text :nodes="shopDetails.Description"></rich-text> -->
      <div>
        <rich-text :nodes="shopDetails.detail"></rich-text>
      </div>
    </view>

    <!-- 底部操作菜单 -->
    <view class="page-bottom" v-if="!ishowBtn">
      <navigator url="/pages/index/index"
                 open-type="switchTab"
                 class="p-b-btn">
        <!-- <text class="yticon icon-xiatubiao--copy"></text> -->
        <image src="../../static/tab-home.png"
               mode=""
               style="
            width: 44rpx;
            height: 38rpx;
            margin-top: 6rpx;
            margin-bottom: 2rpx;
          "></image>
        <text>首页</text>
      </navigator>
      <view open-type="switchTab" class="p-b-btn">
        <text style="margin-top: 10rpx;"></text>
      </view>
      <view class="p-b-btn">
        <text class=""></text>
        <text></text>
      </view>

      <view class="action-btn-group">
        <button type="primary"
                class="action-btn no-border buy-now-btn"
                @click="purchase()">立即购买</button>
      </view>
    </view>

    <!-- 规格-模态层弹窗 -->
    <view class="popup spec"
          :class="specClass"
          @touchmove.stop.prevent="stopPrevent"
          @click="toggleSpec">
      <!-- 遮罩层 -->
      <view class="mask"></view>
      <view class="layer attr-content"
            @click.stop="stopPrevent">
        <view class="a-t">
          <image @click="previewShopImg"
                 :src="shopImg"></image>
          <!-- <easyLoadimage :image-src="shopImg"
                         :scroll-top="scrollTop"></easyLoadimage> -->
          <view class="right">
            <text class="price">¥{{ price }}</text>
            <text class="stock">库存：{{ stock }}件</text>
            <view class="selected-box">
              <text>已选：</text>
              <view class="selected">
                <text class="selected-text"
                      v-for="(sItem, sIndex) in selectArr"
                      :key="sIndex">{{ sItem }}</text>
              </view>
            </view>
          </view>
        </view>
        <!-- <view
          v-for="(item, index) in simulatedDATA.specifications"
          :key="index"
          class="attr-list"
        >
          <text>{{ item.name }}</text>
          <view class="item-list">
            <text
              v-for="(childItem, childIndex) in simulatedDATA.specifications"
              v-if="childItem.pid === item.id"
              :key="childIndex"
              class="tit"
              :class="{ selected: childItem.selected }"
              @click="selectSpec(childIndex, childItem.pid)"
            >
              {{ childItem.item.name }}
            </text>
          </view>
        </view> -->
        <view class="specifications">
          <view v-for="(ProductItem, n) in simulatedDATA.specifications"
                :key="n">
            <view>{{ ProductItem.name }}</view>
            <view class="specifications-content">
              <view @click="specificationBtn(oItem.name, n, $event, index)"
                    v-bind:class="[oItem.isShow ? '' : 'noneActive', subIndex[n] == index ? 'productActive' : '']"
                    v-for="(oItem, index) in ProductItem.item"
                    :key="index">
                {{ oItem.name }}
              </view>
            </view>
          </view>
        </view>
        <!-- 数字输入框区域 -->
        <view class="footer-box">
          <view>购买数量</view>
          <view class="number-box">
            <view class="reduce"
                  :class="numberVal <= 1 ? 'reduce-copy' : ''"
                  @click="reduce">-</view>
            <view class="stocks">{{ numberVal | stocks }}</view>
            <view class="add"
                  :class="numberVal >= stock ? 'add-copy' : ''"
                  @click="add">+</view>
            <!-- <uni-number-box class="step"
                            :min="1"
                            :max="stock"
                            :value="numberVal"
                            :disabled="true"
                            @eventChange="numberChange"></uni-number-box> -->
          </view>
        </view>
        <view class="action-btn-group"
              v-if="this.num == 1 ? true : false">
          <button type="primary"
                  class="action-btn no-border buy-now-btn"
                  @click="purchase">立即购买</button>
          <button type="primary"
                  class="action-btn no-border add-cart-btn"
                  @click="joinCart">加入购物车</button>
        </view>
        <button class="btn"
                v-else
                @click="success">完成</button>
      </view>
    </view>
    <!-- 分享 -->
    <share ref="share"
           :contentHeight="580"
           :shareList="shareList"></share>
    <view class="base-back-top">
      <!-- 回到顶部区域 -->
      <BaseBackTop @changeIsBackTop="changeBackTop"
                   :isBackTop="isBackTop"></BaseBackTop>
    </view>
    <!-- 联系客服区域 -->
<!--    <view class="contact"
          @click="openPopup">联系客服</view> -->
    <!-- 联系客服弹框区域 -->
<!--    <uni-popup ref="popup"
               type="center">
      <view class="contact-popup">
        <view v-for="(item, index) in contactList"
              :key="index"
              @click="clickContact(item.cId)">{{ item.text }}</view>
      </view>
    </uni-popup> -->
    <!-- 规格预览图片区域的弹框 -->
    <uni-popup ref="popups"
               type="center">
      <view>
        <image class="preview-shopImg"
               :src="shopImg"></image>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import easyLoadimage from '../../components/easy-loadimage/easy-loadimage';
import uniNumberBox from '@/components/uni-number-box.vue';
import share from '@/components/share';
import BaseBackTop from '@/components/BaseBackTop/BaseBackTop';
export default {
  components: {
    share,
    easyLoadimage,
    uniNumberBox,
    BaseBackTop,
    uniPopup
  },
  data () {
    return {
      // 显示的规格商品图片
      shopImg: '',
      // 数量键盘的输入内容
      numberVal: 1,
      // 商品 id
      ProductId: '',
      // 轮播图数据
      swiperList: [],
      // 商品详情
      shopDetails: {},
      // 轮播图
      scrollTop: 0,
      specClass: 'none',
      specSelected: [],
      favorite: false,
      shareList: [],
      // 商品库存数据
      simulatedDATA: {},
      //存放被选中的值
      selectArr: [],
      //存放要和选中的值进行匹配的数据
      shopItemInfo: {},
      //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
      subIndex: [],
      //选中规格的价钱
      price: '',
      // 选中的库存
      stock: null,
      // 选中的产品规格 id
      productSkuId: '',
      // 类型 区分购买类型 底部购买 底部加入购物车
      // 1 购买类型 2 立即购买 3 加入购物车
      num: '',
      // 评价数据
      evaluateList: [],
      // 总的评价条数
      total: '',
      // 回到顶部显示与隐藏
      isBackTop: false,
	  ishowBtn: '',
	  payInfoFlag: '',
      // 联系客服的数据
      contactList: [
        {
          cId: 1,
          text: '微信客服',
          code: '微信客服'
        },
        {
          cId: 2,
          text: 'QQ客服',
          code: 'QQ客服'
        },
        {
          cId: 3,
          text: '电话客服',
          code: '电话客服'
        }
      ]
    };
  },
  onLoad (options) {
    this.ProductId = options.ProductId;
	this.ishowBtn = options.noShow
    // console.log(this.ProductId);
	//获取详情
	this.getShopDetail()
    // 获取商品的评价
    // this.getSeeShopEvaluate();
  },
  onShow () {
	  this.getUserInfo()
    // 判断是否已经收藏
    // this.isCollect();
    // this.specClass = 'none';
    // 点击增加浏览量接口
    // this.getBrowse();
    // 获取商品详情接口
    // this.getShopDetails();
    // 获取商品规格接口
    // this.getSKUAttributes();
  },
  // 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
  onPageScroll ({ scrollTop }) {
    this.scrollTop = scrollTop;
    if (scrollTop > 500) {
      this.isBackTop = true;
    } else {
      this.isBackTop = false;
    }
  },
  filters: {
    stocks (val) {
      if (val == null) {
        return 1;
      }
      return val;
    }
  },
  methods: {
	  async getUserInfo(){
		  let res = await this.$api.api.userPaymentCode()
		  this.payInfoFlag = res.data
	  },
	  async getShopDetail(){
		  let res = await this.$api.api.productDetail({id:this.ProductId})
		  if(res.code == '000000'){
			  this.shopDetails = res.data
			  this.shopDetails.subImages = res.data.subImages.split(',')
			  console.log(this.shopDetails)
		  }else{
			this.$api.msg(res.msg);
		  }
	  },
    // 点击 sku 的图片
    previewShopImg () {
      this.$refs.popups.open();
    },
    // 点击打开联系客服的弹框
    openPopup () {
      this.$refs.popup.open();
    },
    // 点击回到顶部
    changeBackTop () {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
    // 点击增加浏览量接口
    async getBrowse () {
      let result = {};
      result = {
        ProductId: this.ProductId
      };
      result = JSON.stringify(result);
      let param = {
        action: 'AddProductVisti',
        data: result
      };
      let res = await this.$api.api.browse(param);
    },
    // 获取商品的评价
    async getSeeShopEvaluate () {
      let result = {};
      result = {
        ProductId: this.ProductId,
        Offset: 0,
        RowNumber: 1,
        OrderBy: 'desc'
      };
      result = JSON.stringify(result);
      let data = {
        action: 'ReadEvaluation',
        data: result
      };
      let res = await this.$api.api.seeShopEvaluate(data);
      if (res.data.status == true) {
        this.evaluateList = res.data.data.data;
        this.total = res.data.data.zongshu;
      }
    },
    //是否收藏
    async isCollect () {
      let data = {
        action: 'isCollection',
        ProductID: this.ProductId
      };
      let res = await this.$api.api.isCollect(data);
      if (res.data.status == true) {
        this.favorite = res.data.collect == '0' ? false : true;
      }
    },
    // 获取商品规格接口
    async getSKUAttributes () {
      let data = {
        action: 'GetSKUAttributes',
        productId: this.ProductId
        // productId: 5069,
      };
      let res = await this.$api.api.sKUAttributes(data);
      if (res.data.status == true) {
        var result = res.data.simulatedDATA;
        this.simulatedDATA = eval('(' + result + ')');
        // var arr = eval('(' + result + ')');
        // // console.log(arr.specifications)
        // arr.specifications.forEach(item => {
        //   var arr1 = item.name.indexOf('[') + 1
        //   var arr2 = item.name.indexOf(']')
        //   console.log(item.name.substring(arr1, arr2))
        // })
        // // console.log(arr)
        for (var i in this.simulatedDATA.difference) {
          this.shopItemInfo[this.simulatedDATA.difference[i].difference] = this.simulatedDATA.difference[i]; //修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
          this.checkItem();
        }
        // this.checkItem()
        this.checkItem(this.simulatedDATA);
      }
    },
    //选择规格
    // item 点击的每一项
    // n 父级的索引
    // index 子级的索引
    specificationBtn (item, n, event, index) {
      if (this.selectArr[n] != item) {
        this.selectArr[n] = item;
        this.subIndex[n] = index;
      } else {
        this.selectArr[n] = '';
        this.subIndex[n] = -1; //去掉选中的颜色
      }
      this.checkItem();
    },
    checkItem () {
      var option = this.simulatedDATA.specifications;
      var result = []; //定义数组储存被选中的值
      for (var i in option) {
        result[i] = this.selectArr[i] ? this.selectArr[i] : '';
      }
      for (var i in option) {
        var last = result[i]; //把选中的值存放到字符串last去
        for (var k in option[i].item) {
          result[i] = option[i].item[k].name; //赋值，存在直接覆盖，不存在往里面添加name值
          option[i].item[k].isShow = this.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
        }
        result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时被覆盖
      }
      if (this.shopItemInfo[result]) {
        this.productSkuId = this.shopItemInfo[result].id;
        this.shopImg = this.$config.domain.api + this.shopItemInfo[result].ImgUrl;
        var price = this.shopItemInfo[result].price || '';
        this.price = Number(price).toFixed(2);
        if (Number(this.shopItemInfo[result].stock) < this.numberVal) {
          this.numberVal = Number(this.shopItemInfo[result].stock);
        }
        // console.log(Number(this.shopItemInfo[result].stock))
        // console.log(this.numberVal)
        // this.numberVal = this.shopItemInfo[result].stock
        // this.numberChange(Number(this.shopItemInfo[result].stock))
        // this.numberVal = this.shopItemInfo[result].stock
      } else {
        this.stock == 999;
      }
      this.$forceUpdate(); //重绘
    },
    isMay (result) {
      for (var i in result) {
        if (result[i] == '') {
          return true; //如果数组里有为空的值，那直接返回true
        }
      }
      if (this.shopItemInfo[result] != undefined) {
        this.stock = Number(this.shopItemInfo[result].stock);
        return this.shopItemInfo[result].stock == 0 ? false : true; //匹配选中的数据的库存，若不为空返回true反之返回false
      }
    },
    // 数量输入框变化
    // numberChange(e) {
    //   // this.numberVal = e.number;
    //   // console.log(e.number)
    //   // console.log(e)
    //   if (e.number != undefined) {
    //     this.numberVal = e.number;
    //   } else {
    //     this.numberVal = e
    //   }
    // },
    // 根据状态 区分是加入购物车 还是立即购买
    success () {
      // console.log(this.$store.state.hasLogin);
      if (uni.getStorageSync('token')) {
        if (this.num == 2) {
          this.purchase();
          // uni.navigateTo({
          //   url: `/pages/order/createOrder`,
          // });
        } else if (this.num == 3) {
          this.joinCart();
        }
      } else {
        uni.navigateTo({
          url: `/pages/public/login`
        });
      }
    },
    //规格弹窗开关
    toggleSpec (num) {
      this.num = num;
      if (this.specClass === 'show') {
        this.specClass = 'hide';
        setTimeout(() => {
          this.specClass = 'none';
        }, 250);
      } else if (this.specClass === 'none') {
        // // 默认选中尺寸颜色的第一项
        // this.subIndex[0] = 0;
        // this.subIndex[1] = 0;
        // // 默认选中已选
        // var str1 = '';
        // var arr = [];
        // str1 = this.simulatedDATA.specifications[0].item[0].name;
        // arr.push(str1);
        // var str2 = '';
        // str2 = this.simulatedDATA.specifications[1].item[0].name;
        // arr.push(str2);
        // this.selectArr = arr;
        // // 默认显示第一个库存
        // this.stock = this.simulatedDATA.difference[0].stock;
        // 默认显示第一张规格照片
        this.shopImg = this.$config.domain.api + this.simulatedDATA.difference[0].ImgUrl;
        // 默认显示第一个价格
        this.price = Number(this.simulatedDATA.difference[0].price).toFixed(2);
        // 默认选中的第一个组合的产品规格的 id
        // this.productSkuId = this.shopItemInfo[this.selectArr].id;
        this.specClass = 'show';
      }
    },
    // 加入购物车
    async joinCart () {
      if (uni.getStorageSync('token')) {
        if (this.productSkuId != '') {
          if (this.stock < this.numberVal) {
            return this.$api.msg('您购买的商品件数超过库存值, 请重新输入');
          }
          let data = {
            action: 'AddToCartBySkus',
            quantity: this.numberVal,
            productSkuId: this.productSkuId,
            CategoryId: 0,
            Templateid: 0
          };
          let res = await this.$api.api.joinShopCart(data);
          console.log(res);
          if (res.data.status == true) {
            this.$api.msg('加入购物车成功');
            this.specClass = 'none';
          } else {
            this.$api.msg(res.data.msg);
          }
        } else {
          this.$api.msg('请先选择规格');
        }
      } else {
        uni.navigateTo({
          url: `/pages/public/login`
        });
      }
    },
    // 立即购买
    async purchase () {
      if (uni.getStorageSync('token')) {
		  if(this.payInfoFlag){
			uni.navigateTo({
			  url: '/pages/order/createOrder?id=' + this.shopDetails.id
			});  
		  }else{
			uni.navigateTo({
			  url: '/pages/binding/binding'
			});    
		  }
        // if (this.stock < this.numberVal) {
        //   return this.$api.msg('您购买的商品件数超过库存值, 请重新输入');
        // }
        // let param = {
        //   action: 'AddToCartBySkus',
        //   quantity: this.numberVal,
        //   productSkuId: this.productSkuId,
        //   CategoryId: 1,
        //   Templateid: 0
        // };
        // if (this.productSkuId != '') {
        //   let res = await this.$api.api.joinShopCart(param);
        //   // console.log(res);
        //   if (res.data.status == true) {
        //     this.specClass = 'none';
        //     uni.navigateTo({
        //       url: '/pages/order/createOrder?id=' + this.productSkuId
        //     });
        //   }
        // } else {
        //   this.$api.msg('请选择规格');
        // }
      } else {
        uni.navigateTo({
          url: `/pages/public/login`
        });
      }
    },
    stopPrevent () { },
    //分享
    share () {
      this.$refs.share.toggleMask();
    },
    //收藏
    async toFavorite () {
      if (this.favorite == false) {
        let data = {
          action: 'AddCollection',
          ProductID: this.ProductId
        };
        let res = await this.$api.api.collection(data);
        if (res.data.status == false) {
          uni.showModal({
            content: '您尚未登录',
            success: res => {
              if (res.confirm) {
                uni.navigateTo({
                  url: '/pages/public/login'
                });
              } else if (res.cancel) {
              }
            }
          });
        } else if (res.data.status == true) {
          this.$api.msg('收藏成功');
          this.favorite = true;
        }
      } else {
        let data = {
          action: 'cancelCollection',
          ProductID: this.ProductId
        };
        let res = await this.$api.api.cancelCollection(data);
        if (res.data.status == true) {
          this.favorite = false;
          this.$api.msg('取消收藏成功');
        }
      }
    },
    // 底部购买按钮 打开弹窗
    footerBuy (num) {
      this.toggleSpec(num);
    },
    // 底部加入购物车按钮 打开弹窗
    footerJoinCart (num) {
      this.toggleSpec(num);
    },
    // 点击了评价
    jump () {
      uni.navigateTo({
        url: '/pages/evaluate/evaluate?ProductId=' + this.ProductId
      });
    },
    // 选择客服
    clickContact (id) {
      console.log(id)
      uni.navigateTo({
        url: '/pages/product/serviceList/serviceList?id=' + id
      });
      this.$refs.popup.close();
    },
    // 点击减少
    reduce () {
      if (this.numberVal <= 1) {
        return;
      }
      this.numberVal -= 1;
      console.log(this.numberVal);
    },
    // 点击增加
    add () {
      if (this.numberVal >= this.stock) {
        return;
      }
      this.numberVal += 1;
      console.log(this.numberVal);
    }
  }
};
</script>

<style lang="scss">
page {
  background: $page-color-base;
  padding-bottom: 160upx;
}
.easy-loadimage {
  width: 170upx;
  height: 170upx;
  flex-shrink: 0;
  margin-top: -40upx;
  border-radius: 8upx;
}
// 预览图片的样式
.preview-shopImg {
  border-radius: 20rpx;
}
// 评价的图片
.img-box {
  display: flex;
  flex-wrap: wrap;
  > image {
    margin: 0 6rpx;
    // width: 30%;
    width: 180rpx;
    height: 140rpx;
  }
}
.service {
  display: flex;
  padding: 20rpx 30rpx;
  .service-one {
    // width: 20%;
    flex: 1;
  }
  .service-two {
    flex: 7;
  }
}
.icon-you {
  font-size: $font-base + 2upx;
  color: #888;
}

.carousel {
  height: 722upx;
  position: relative;

  swiper {
    height: 100%;
  }

  .image-wrapper {
    width: 100%;
    height: 100%;

    .easy-loadimage {
      width: 100%;
      height: 100%;
    }
  }

  .swiper-item {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 750upx;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

/* 标题简介 */
.introduce-section {
  background: #fff;
  padding: 20upx 30upx;

  .title {
    font-size: 32upx;
    color: $font-color-dark;
    height: 50upx;
    line-height: 50upx;
  }

  .price-box {
    display: flex;
    align-items: baseline;
    height: 64upx;
    padding: 10upx 0;
    font-size: 26upx;
    color: $uni-color-primary;
  }

  .price {
    font-size: $font-lg + 2upx;
  }

  .m-price {
    margin: 0 12upx;
    color: $font-color-light;
    text-decoration: line-through;
  }

  .coupon-tip {
    align-items: center;
    padding: 4upx 10upx;
    background: $uni-color-primary;
    font-size: $font-sm;
    color: #fff;
    border-radius: 6upx;
    line-height: 1;
    transform: translateY(-4upx);
  }

  .bot-row {
    display: flex;
    // flex-direction: column;
    align-items: center;
    height: 50upx;
    font-size: $font-sm;
    color: $font-color-light;

    text {
      flex: 1;
    }
  }
}

/* 分享 */
.share-section {
  display: flex;
  align-items: center;
  color: $font-color-base;
  background: linear-gradient(left, #fdf5f6, #fbebf6);
  padding: 12upx 30upx;

  .share-icon {
    display: flex;
    align-items: center;
    width: 70upx;
    height: 30upx;
    line-height: 1;
    border: 1px solid $uni-color-primary;
    border-radius: 4upx;
    position: relative;
    overflow: hidden;
    font-size: 22upx;
    color: $uni-color-primary;

    &:after {
      content: "";
      width: 50upx;
      height: 50upx;
      border-radius: 50%;
      left: -20upx;
      top: -12upx;
      position: absolute;
      background: $uni-color-primary;
    }
  }

  .icon-xingxing {
    position: relative;
    z-index: 1;
    font-size: 24upx;
    margin-left: 2upx;
    margin-right: 10upx;
    color: #fff;
    line-height: 1;
  }

  .tit {
    font-size: $font-base;
    margin-left: 10upx;
  }

  .icon-bangzhu1 {
    padding: 10upx;
    font-size: 30upx;
    line-height: 1;
  }

  .share-btn {
    flex: 1;
    text-align: right;
    font-size: $font-sm;
    color: $uni-color-primary;
  }

  .icon-you {
    font-size: $font-sm;
    margin-left: 4upx;
    color: $uni-color-primary;
  }
}

.c-list {
  font-size: $font-sm + 2upx;
  color: $font-color-base;
  background: #fff;

  .c-row {
    display: flex;
    align-items: center;
    padding: 20upx 30upx;
    position: relative;
  }

  .tit {
    width: 140upx;
  }

  .con {
    flex: 1;
    color: $font-color-dark;

    .selected-text {
      margin-right: 10upx;
    }
  }

  .bz-list {
    height: 40upx;
    font-size: $font-sm + 2upx;
    color: $font-color-dark;

    text {
      display: inline-block;
      margin-right: 30upx;
    }
  }

  .con-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: $font-color-dark;
    line-height: 40upx;
  }

  .red {
    color: $uni-color-primary;
  }
}

/* 评价 */
.eva-section {
  display: flex;
  flex-direction: column;
  padding: 20upx 30upx;
  background: #fff;
  margin-top: 16upx;

  .e-header {
    display: flex;
    align-items: center;
    height: 70upx;
    font-size: $font-sm + 2upx;
    color: $font-color-light;

    .tit {
      font-size: $font-base + 2upx;
      color: $font-color-dark;
      margin-right: 4upx;
    }

    .tip {
      flex: 1;
      text-align: right;
    }

    .icon-you {
      margin-left: 10upx;
    }
  }
}

.eva-box {
  display: flex;
  padding: 20upx 0;

  .portrait {
    flex-shrink: 0;
    width: 80upx;
    height: 80upx;
    border-radius: 100px;
  }

  .right {
    // flex: 1;
    display: flex;
    flex-direction: column;
    font-size: $font-base;
    color: $font-color-base;
    padding-left: 26upx;

    .con {
      font-size: $font-base;
      color: $font-color-dark;
      padding: 20upx 0;
    }

    .bot {
      // display: flex;
      // justify-content: space-between;
      font-size: $font-sm;
      color: $font-color-light;
      .bot-common {
        font-size: 26rpx;
      }
    }
  }
}

/*  详情 */
.detail-desc {
  background: #fff;
  margin-top: 16upx;

  .d-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80upx;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    position: relative;

    text {
      padding: 0 20upx;
      background: #fff;
      position: relative;
      z-index: 1;
    }

    &:after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
      width: 300upx;
      height: 0;
      content: "";
      border-bottom: 1px solid #ccc;
    }
  }
}

/* 规格选择弹窗 */
.attr-content {
  padding: 10upx 30upx;

  .a-t {
    display: flex;

    image {
      width: 170upx;
      height: 170upx;
      flex-shrink: 0;
      margin-top: -40upx;
      border-radius: 8upx;
    }

    .right {
      display: flex;
      flex-direction: column;
      padding-left: 24upx;
      font-size: $font-sm + 2upx;
      color: $font-color-base;
      line-height: 42upx;

      .price {
        font-size: $font-lg;
        color: $uni-color-primary;
        margin-bottom: 10upx;
      }
      .selected-box {
        width: 480rpx;
        display: flex;
        > text {
          width: 110rpx;
        }
      }
      .selected {
        width: 480rpx;
        // width: 27%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      .selected-text {
        margin-right: 10upx;
      }
    }
  }

  .attr-list {
    display: flex;
    flex-direction: column;
    font-size: $font-base + 2upx;
    color: $font-color-base;
    padding-top: 30upx;
    padding-left: 10upx;
  }

  .item-list {
    padding: 20upx 0 0;
    display: flex;
    flex-wrap: wrap;

    text {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eee;
      margin-right: 20upx;
      margin-bottom: 20upx;
      border-radius: 100upx;
      min-width: 60upx;
      height: 60upx;
      padding: 0 20upx;
      font-size: $font-base;
      color: $font-color-dark;
    }

    .selected {
      background: #fbebee;
      color: $uni-color-primary;
    }
  }
}

.specifications {
  .specifications-content {
    display: flex;
    flex-wrap: wrap;
    > view {
      margin-right: 10rpx;
      font-size: 24rpx;
      // margin: 0 20rpx;
      padding: 10rpx;
      border-radius: 6rpx;
      border: 1rpx solid #323f6c;
      margin-bottom: 10rpx;
    }
  }
}

.productActive {
  background: #323f6c;
  color: #ffffff;
}

.noneActive {
  background-color: #909399;
  opacity: 0.5;
  color: #fff;
  pointer-events: none;
}

/*  弹出层 */
.popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;

  &.show {
    display: block;

    .mask {
      animation: showPopup 0.2s linear both;
    }

    .layer {
      animation: showLayer 0.2s linear both;
    }
  }

  &.hide {
    .mask {
      animation: hidePopup 0.2s linear both;
    }

    .layer {
      animation: hideLayer 0.2s linear both;
    }
  }

  &.none {
    display: none;
  }

  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .layer {
    position: fixed;
    z-index: 99;
    bottom: 0;
    width: 100%;
    min-height: 40vh;
    border-radius: 10upx 10upx 0 0;
    background-color: #fff;

    .btn {
      height: 66upx;
      line-height: 66upx;
      border-radius: 100upx;
      background: #323f6c;
      font-size: $font-base + 2upx;
      color: #fff;
      margin: 30upx auto 20upx;
    }
  }

  @keyframes showPopup {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes hidePopup {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes showLayer {
    0% {
      transform: translateY(120%);
    }

    100% {
      transform: translateY(0%);
    }
  }

  @keyframes hideLayer {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(120%);
    }
  }
}

// 弹出层的立刻购买和加入购物车
.action-btn-group {
  display: flex;
  height: 76upx;
  border-radius: 100px;
  overflow: hidden;
  background: #323f6c;
  margin-left: 20upx;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translateY(-50%);
    height: 28upx;
    width: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.5);
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180upx;
    height: 100%;
    font-size: $font-base;
    padding: 0;
    border-radius: 0;
    background: #323f6c;
  }
}

/* 底部操作菜单 */
.page-bottom {
  position: fixed;
  left: 30rpx;
  bottom: 30rpx;
  z-index: 95;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 690rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.5);
  border-radius: 16rpx;

  .p-b-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: $font-sm;
    color: $font-color-base;
    width: 96upx;
    height: 90upx;

    .yticon {
      font-size: 40upx;
      line-height: 48upx;
      color: $font-color-light;
    }

    &.active,
    &.active .yticon {
      color: rgb(250, 108, 106);
    }

    .icon-fenxiang2 {
      font-size: 42upx;
      transform: translateY(-2upx);
    }

    .icon-shoucang {
      font-size: 46upx;
    }
  }

  .action-btn-group {
    display: flex;
    height: 76upx;
    border-radius: 100px;
    overflow: hidden;
    box-shadow: 0 20upx 40upx -16upx rgb(50, 63, 108);
    box-shadow: 1px 2px 5px rgba(50, 63, 108, 0.4);
    background: #323f6c;
    margin-left: 20upx;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      top: 50%;
      right: 50%;
      transform: translateY(-50%);
      height: 28upx;
      width: 0;
      border-right: 1px solid rgba(255, 255, 255, 0.5);
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180upx;
      height: 100%;
      font-size: $font-base;
      padding: 0;
      border-radius: 0;
      background: transparent;
    }
  }
}

// 数字输入框区域
.footer-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30rpx 0;

  /deep/.uni-numbox {
    position: static;
  }
  .number-box {
    display: flex;
    height: 60rpx;
    .stocks {
      font-size: 30rpx;
    }
    .reduce-copy {
      color: #d6d6d6;
    }
    .reduce {
      font-size: 46rpx;
    }
    .add-copy {
      color: #d6d6d6;
    }
    .add {
      font-size: 46rpx;
    }
    > view {
      line-height: 60rpx;
      font-size: 40rpx;
      text-align: center;
      background-color: #f5f5f5;
      height: 100%;
      padding: 0 25rpx;
      width: 80rpx;
    }
  }

  // position: relative;
  // .number-box {
  //   position: absolute;
  //   top: 0%;
  //   right: 100%;
  // }
}
// 联系客服区域
.contact {
  position: fixed;
  bottom: 400rpx;
  right: 50rpx;
  width: 40rpx;
  padding: 10rpx;
  box-sizing: content-box;
  text-align: center;
  border-radius: 20rpx;
  background-color: #fff;
  z-index: 9;
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.5);
}
// 联系客服弹框区域
.contact-popup {
  padding: 30rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  > view {
    width: 420rpx;
    text-align: center;
    margin: 10rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 20rpx;
    background-color: #fff;
  }
}
</style>
