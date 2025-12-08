<template>
  <view class="content box">
    <view class="box-copy"
          v-if="!show">
      <!-- 头部 tab 栏区域 -->
      <view class="box-head">
        <view class="box-title">
          <view v-for="(item, index) in navList"
                :key="index"
                :class="index == tabCurrentIndex ? 'tabActive' : ''"
                @click="tabClick(item.id)">
            {{ item.text }}
          </view>
        </view>
      </view>
      <!-- 筛选区域 -->
      <view class="screen">
        <!-- 筛选的左边 -->
        <view class="screen-left">FC</view>
        <!-- 筛选的右边 -->
        <view v-if="tabCurrentIndex == 2 ? false : true"
              class="screen-right"
              @click="openScreen">
          <view>筛选</view>
          <image src="/static/screen.png"></image>
        </view>
      </view>
    </view>
    <view class="box-content-copy"
          v-if="!show"></view>
    <!-- 状态区域 -->
    <view class="order-titles"
          v-if="tabCurrentIndex == 2 ? true : false">
      <view class="order-titles-copy"
            @click="stateOpen">
        <view>全部状态</view>
        <image src="/static/blew.png"></image>
      </view>
    </view>
    <view class="orders-copy"
          v-if="tabCurrentIndex == 2 ? true : false"></view>
    <swiper :current="tabCurrentIndex"
            v-if="!show"
            class="swiper-box"
            duration="300"
            @change="changeTab">
      <swiper-item class="tab-content swiper-item"
                   v-for="(tabItem, tabIndex) in navList"
                   :key="tabIndex">
        <scroll-view class="list-scroll-content"
                     scroll-y
                     @scrolltolower="getData">
          <view v-for="(itemGood, indexGood) in tabItem.orderList"
                :key="indexGood">
            <!-- 订单列表 -->
            <view class="item-box"
                  v-if="tabCurrentIndex == 2 ? false : true">
              <!-- 单独盒子的左边 -->
              <view class="item-left">
                <!-- 左边的上部分 -->
                <view class="left-top">
                  <!-- 用户头像照片 -->
                  <image class="head-img"
                         :src="itemGood.UserHead"></image>
                  <!-- 名称区域 -->
                  <view class="top-content">
                    <view class="content-box">
                      <!-- 商品名称 -->
                      <view class="content-name">{{ itemGood.UserBindName }}</view>
                      <view class="content-authentication"
                            v-if="tabCurrentIndex == 1 ? false : true"
                            style="background-color: #fff;"></view>
                    </view>
                    <view><text v-if="tabCurrentIndex == 1 ? false : true">支付方式 </text> <text v-else>收款方式</text>：{{ itemGood.payWay }}
                    </view>
                  </view>
                </view>
                <!-- 左边的下部分 -->
                <view class="left-bottom"><text v-if="tabCurrentIndex == 1 ? false : true">需求量:</text><text v-else>剩余数量:</text>{{ itemGood.RemainFish }}</view>
              </view>
              <!-- 单独盒子的右边 -->
              <view class="item-right">
                <!-- 买卖 -->
                <view class="right-common right-sell"
                      v-if="tabCurrentIndex == 1 ? false : true"
                      @click="toggleSpec(itemGood)">卖出</view>
                <view v-else
                      class="right-common right-buy"
                      @click="toggleSpec(itemGood)">买入</view>
                <!-- 单价 -->
                <view class="right-unit-price">单价(¥)</view>
                <!-- 价格 -->
                <view class="right-price">{{ itemGood.FishPrice }}</view>
              </view>
            </view>
            <!-- 订单 -->
            <view class="order"
                  v-else>
              <!-- 内容区域 -->
              <view class="order-content"
                    v-if="tabItem.orderList.length > 0"
                    @click="jump(itemGood.FishRecordId,itemGood.SellerUserId,itemGood.BuyerUserId,itemGood.TransactionType,itemGood.OrderStatus,itemGood.PleaDate)">
                <!-- 内容的上边区域 -->
                <view><text style="margin-right: 10rpx;">委托单号:</text><text>{{ itemGood.FishOrderId }}</text></view>
                <view class="content-top">
                  <view>
                    <text class="content-business"
                          :class="itemGood.TransactionType1 == '卖出'?'sell' : ''">{{
		                  itemGood.TransactionType1
		                }}</text>
                    <text>FC/CNY</text>
                  </view>
                  <view>{{ itemGood.OrderStatus }}</view>
                </view>
                <!-- 内容的中间区域 -->
                <view class="content-Middle">
                  <view class="middle-name-headimg">
                    <image :src="itemGood.picture"></image>
                    <view>{{ itemGood.phone }}</view>
                  </view>
                  <view class="middle-data">{{itemGood.CreateDate}}</view>
                </view>
                <!-- 内容的下边区域 -->
                <view class="content-bottom">
                  <view class="bottom-flex">
                    <view>
                      <view class="bottom-one">数量</view>
                      <view class="bottom-two">{{ itemGood.FishNumber }}</view>
                    </view>
                    <view>
                      <view class="bottom-one">单价(¥)</view>
                      <view class="bottom-two">{{ itemGood.FishPrice }}</view>
                    </view>
                    <view>
                      <view class="bottom-one">总金额(¥)</view>
                      <view class="bottom-two">{{ itemGood.total }}</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <uni-load-more :status="tabItem.loadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
    <!-- 筛选的弹出框区域 -->
    <uni-popup ref="popup"
               type="top">
      <view class="popup-box">
        <!-- 筛选区域 -->
        <view class="screen">
          <!-- 筛选的左边 -->
          <view class="screen-left">FC</view>
          <!-- 筛选的右边 -->
          <view class="screen-right">
            <view>筛选</view>
            <image src="/static/screen.png"></image>
          </view>
        </view>
        <!-- 支付方式区域 -->
        <view class="screen-box">
          <view class="payment-method">支付方式</view>
          <view class="payment-name">
            <view v-for="(paymentNameItem, paymentNameIndex) in paymentName"
                  :key="paymentNameIndex"
                  :class="payment == paymentNameItem.type ? 'paymentActive' : ''"
                  @click="changePayment(paymentNameItem.type)">
              {{ paymentNameItem.text }}
              <image v-if="payment == paymentNameItem.type"
                     src="/static/full.png"></image>
            </view>
          </view>
        </view>
        <!-- 数量区域 -->
        <view class="screen-box">
          <view class="payment-method">数量</view>
          <view class="payment-name">
            <view v-for="(paymentNumItem, paymentNumIndex) in numberList"
                  :key="paymentNumIndex"
                  :class="paymentNum == paymentNumItem.numId ? 'paymentActive' : ''"
                  @click="changeNum(paymentNumItem.numId)">
              {{ paymentNumItem.num }}
              <image v-if="paymentNum == paymentNumItem.numId"
                     src="/static/full.png"></image>
            </view>
          </view>
        </view>
        <view class="screen-footer">
          <view class="screen-reset"
                @click="screenReset">重置</view>
          <view class="screen-screen"
                @click="screenDetermine">筛选</view>
        </view>
      </view>
    </uni-popup>
    <!-- 全部状态的弹出框区域 -->
    <uniPopup ref="statePopup"
              type="top">
      <view class="popup-box">
        <!-- 筛选区域 -->
        <view class="screen">
          <!-- 筛选的左边 -->
          <view class="screen-left">FC</view>
        </view>
        <view class="order-title">
          <view class="order-title-copy"
                @click="stateOpen">
            <view>全部状态</view>
            <image src="/static/blew.png"></image>
          </view>
        </view>
        <!-- 状态订单 -->
        <view class="state-List">
          <view class="state-item"
                v-for="(stateItem, stateIndex) in orderList"
                :key="stateIndex"
                :class="stateCruuent == stateItem.index ? 'stateActive' : ''"
                @click="changeState(stateItem.oId, stateIndex)">{{ stateItem.text }}</view>
        </view>
      </view>
    </uniPopup>
    <!-- 买卖的弹框 -->
    <view class="popup spec"
          :class="specClass"
          @touchmove.stop.prevent="stopPrevent"
          @click="toggleSpec">
      <!-- 遮罩层 -->
      <view class="mask"></view>
      <view class="layer"
            @click.stop="stopPrevent">
        <view class="layer-hd">
          <text class="left"
                v-if="tabCurrentIndex == 1 ? true : false">买入FC</text>
          <text class="left"
                v-else>卖出FC</text>
          <text class="right"
                @click="specClass = 'none'">×</text>
        </view>
        <view class="img">
          <image :src="pic"
                 mode=""></image>
        </view>
        <view class="list"
              style="margin-bottom: 24rpx;">
          <view style="color: #373737;"><text v-if="tabCurrentIndex == 1 ? true : false">支付方式 </text> <text v-else>收款方式</text></view>
          <view class="price"
                style="display: flex; align-items: center;"
                @click="scroll">
            <!-- 	<image :src="muqian.img" mode="" style="height: 44rpx;width: 44rpx;"></image>
							<text style="margin-left: 10rpx;margin-right: 10rpx;">{{muqian.name}}</text>
							<image src="../../../static/blew.png" mode="" style="width: 25rpx;height: 15rpx;"></image> -->
            <view>{{ payName }}</view>
          </view>
          <!-- 	<view class="price" style="display: flex;align-items: center;" @click="scroll" v-else>
						<image src="../../../static/vip/pay3.png" mode="" style="height: 44rpx;width: 44rpx;"></image>
						<text style="margin-left: 10rpx;margin-right: 10rpx;">支付宝</text>
						<image src="../../../static/blew.png" mode="" style="width: 25rpx;height: 15rpx;"></image>
					</view> -->
          <!-- <view class="tip-box" :class="isflag? 'animation' : ''" v-if="isflag">
							<view class="zfb" v-for="(item,index) in payWay" :key='index' @click="choose(index)">
								<image :src="item.img" mode=""></image>
								<text>{{item.name}}</text>
							</view>
						</view> -->
        </view>
        <view class="list">
          <view style="color: #373737;"
                v-if="tabCurrentIndex == 1 ? true : false"><text>购买数量</text><text style="margin-left: 8rpx;">(FC)</text></view>
          <view style="color: #373737;"
                v-else><text>卖出数量</text><text style="margin-left: 8rpx;">(FC)</text></view>
          <!-- <view class="price"><text>2000</text></view> -->
          <input type="number"
                 value=""
                 v-model="buyNUm"
                 placeholder="请输入数量"
                 style="color: #808080; text-align: right;" />
        </view>
        <view class="tip-title">
          <view>最少/最多(CNY)</view>
          <view>
            <text style="color: #37a4d9;">【全部】</text>
            <text>100.00/{{params.RemainFish}}</text>
          </view>
        </view>
        <view class="list"
              style="
		        border-radius: 10rpx 0 0 10rpx;
		        border-bottom: 1rpx solid #e5e5e5;
		      ">
          <view style="color: #373737;"><text>单价</text><text style="margin-left: 8rpx;">(CNY/FC)</text></view>
          <view class="price"><text>{{ params.FishPrice }}</text></view>
        </view>
        <view class="list"
              style="border-radius: 0 10rpx 10rpx 0rpx;">
          <view style="color: #373737;"
                v-if="tabCurrentIndex == 1 ? true : false"><text>花费总额</text><text style="margin-left: 8rpx;">(CNY)</text></view>
          <view style="color: #373737;"
                v-else><text>收入总额</text><text style="margin-left: 8rpx;">(CNY)</text></view>
          <view class="price"><text>{{ getPrice(totalPrice) }}</text></view>
        </view>
        <view v-if="tabCurrentIndex == 0 ? true : false"
              class="sell-submit submit-common"
              @click="submit(0)">确定卖出</view>
        <view v-if="tabCurrentIndex == 1 ? true : false"
              class="buy-submit submit-common"
              @click="submit(1)">确定买入</view>
      </view>
    </view>
    <Footer :num="number"
            v-if="!show"></Footer>
    <view style="height: 45px; width: 100%; background-color: #ffffff;"
          v-if="!show"></view>
    <passkeyborad :show="show"
                  :price="price"
                  @close="close"
                  @getpassword="getpassword"
                  ref="clear"
                  :fc="flag"></passkeyborad>
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import Footer from '@/components/footer.vue';
import passkeyborad from '@/components/yzc-paykeyboard/yzc-paykeyboard.vue';
export default {
  components: {
    uniLoadMore,
    uniPopup,
    Footer,
    passkeyborad
  },
  data() {
    return {
      flag: false,
      number: 1,
      tabCurrentIndex: 0,
      // 全部状态的默认选中项
      stateCruuent: 0,
      show: false,
      price: null,
      pic: '',
      navList: [{
        id: 0,
        text: '卖出',
        loadingType: 'more',
        orderList: [],
        start: 0,
        total: null,
      },
      {
        id: 1,
        text: '买入',
        loadingType: 'more',
        orderList: [],
        start: 0,
        total: null,
      },
      {
        id: 2,
        text: '我的订单',
        loadingType: 'more',
        orderList: [],
        start: 0,
        total: null,
      },
      ],
      // 订单的全部状态的数据
      orderList: [{
        oId: '',
        text: '全部',
        index: 0,
      },
      {
        oId: '1,0',
        text: '未支付',
        index: 1,
      },
      {
        oId: 2,
        text: '已支付',
        index: 2,
      },
      {
        oId: 10,
        text: '已完成',
        index: 3,
      },
      {
        oId: 11,
        text: '已取消',
        index: 4,
      },
      {
        oId: 12,
        text: '申诉中',
        index: 5,
      },
      {
        oId: 14,
        text: '接单超时',
        index: 6,
      }
      ],
      // 付款方式
      paymentName: [{
        id: '',
        type: 0,
        text: '全部',
      },
      {
        id: 11,
        type: 1,
        text: '支付宝',
      },
      {
        id: 12,
        type: 2,
        text: '微信',
      },
      {
        id: 2,
        type: 3,
        text: '余额',
      },
      {
        id: 10,
        type: 4,
        text: '银行卡',
      },
      ],
      // 数量
      numberList: [{
        num: '全部',
        numId: 0,
        snum: 1,
      },
      {
        num: '>1000',
        snum: 1000,
        numId: 1,
      },
      {
        num: '>10000',
        numId: 2,
        snum: 10000,
      },
      {
        num: '>100000',
        numId: 3,
        snum: 100000,
      },
      ],
      muqian: {
        id: 1,
        name: '余额支付',
        img: '',
      },
      payWay: [{
        id: 1,
        name: '余额支付',
        img: '',
      },
      {
        id: 2,
        name: '鱼币支付',
        img: '',
      },
      {
        id: 3,
        name: '支付宝',
      },
      {
        id: 4,
        name: '微信',
      },
      ],
      specClass: 'none',
      isflag: false,
      payFlag: true,
      // 支付方式默认选中项
      payment: 0,
      // 数量的默认选中项
      paymentNum: 0,
      buyNUm: '', //买的数量
      params: '', //参数
      chooseNum: '1-', //筛选数量
      OrderStatus: '', //(0待接单1未支付2已支付10完成11取消12申诉中13拒绝接单14接单超时)
      payList: '',
      captain: 1, //1代表全部0代表个人
      AcceptPayWay: '', //支付方式,
      payLists: [],
      payId: [],
      payCode: '', //支付方式
      getPsw: '',
      num: null,
      payWays: [{
        type: 2,
        name: '余额',
        checked: true,
      },
      {
        type: 10,
        name: '银行卡',
        checked: false,
      },
      {
        type: 11,
        name: '支付宝',
        checked: false,
      },
      {
        type: 12,
        name: '微信',
        checked: false,
      },
      ],
    };
  },
  onPullDownRefresh() {
    this.navList[this.tabCurrentIndex].orderList = [];
    this.navList[this.tabCurrentIndex].start = 0;
    this.navList[this.tabCurrentIndex].total = null;
    this.getData();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 300);
  },
  computed: {
    totalPrice() {
      return this.params.FishPrice * this.buyNUm;
    },
    payName() {
      if (this.payList == 10) return '银行卡';
      if (this.payList == 11) return '支付宝';
      if (this.payList == 12) return '微信';
      if (this.payList == 2) return '余额';
      if (this.payList == 3) return '鱼币';
    },
  },
  onShow() {
	 for(var i in this.navList){
		 this.navList[i].start = 0
		 this.navList[i].orderList = [];
		  this.navList[i].total = null;
	 }
    this.getPayWay();
    this.getData();
    this.specClass = 'none'
    this.show = false
  },
  onLoad(options) { },
  onReachBottom() { },
  methods: {
    getPrice(price) {
      return price.toFixed(2)
    },
    close() {
      this.show = false
    },
    // 跳转详情
    jump(FishRecordId, SellerUserId, BuyerUserId, flag, status, appeal) {
      if (status == "完成") {
        return uni.navigateTo({
          url: "/pages/FishCurrency/transaction/orderDetail/orderOver?orderId=" + FishRecordId
        })
      }
      if (status == "接单超时") {
        return this.$api.msg('该接单超时')
      }
      if (status == "申诉失败" || status == "应诉失败") return uni.showModal({
        title: '提示',
        showCancel: false,
        content: '有问题去联系客服',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
      if (status == "关闭") return
      if (status == "申诉成功" || status == "应诉成功") return
      if (status == "取消") return this.$api.msg("该订单已取消")
      if (status == "应诉") {
        if (appeal) {
          return this.$api.msg('等待应诉结果')
        }
        uni.navigateTo({
          url: "/pages/FishCurrency/transaction/appeal/appeal?id=" + FishRecordId + "&pp=1"
        })
        return
      }
      if (status == "申诉中") return this.$api.msg('正在申诉中')
      let userId = uni.getStorageSync('UserId');
      if (SellerUserId == userId) {
        if (!flag) {
          uni.navigateTo({
            url: '/pages/FishCurrency/transaction/buyProcess/buyProcess?orderId=' +
              FishRecordId,
          });
        } else {
          uni.navigateTo({
            url: '/pages/FishCurrency/transaction/payInfo?orderId=' + FishRecordId,
          });
        }
      } else if (BuyerUserId == userId) {
        if (flag) {
          uni.navigateTo({
            url: '/pages/FishCurrency/transaction/buyProcess/buyProcess?orderId=' +
              FishRecordId,
          });
        } else {
          uni.navigateTo({
            url: '/pages/FishCurrency/transaction/payInfo?orderId=' + FishRecordId,
          });
        }
      }
      // uni.navigateTo({
      //   url: '/pages/integralPages/OTCBusiness/orderDetailPage?id=' + id,
      // });
    },
    async getData() {
      let start = this.navList[this.tabCurrentIndex].start;
      if (start == this.navList[this.tabCurrentIndex].total) {
        return;
      }
      let index = this.tabCurrentIndex;
      let type = index;
      let chooseNum = this.chooseNum
      console.log(this.chooseNum)
      // if(type == 0){
      //  type = 1
      // }else if(type == 1){
      //  type = 0
      // }
      let data = ""
      let param = ""
      if (type == 2) {
        data = {
          Offset: Math.ceil(start / 10), //页面
          RowNumber: 10, //条数
          // // FishNumber: chooseNum,
          OrderStatus: this.OrderStatus,
          // Captain: this.captain,
          // AcceptPayWay: this.AcceptPayWay,
          // IsBuyer: 1
          OrderByKey: 'LastTradeTime'
        };
        let stringData = JSON.stringify(data)
        param = {
          action: "ReadFishOrderRecord",
          data: stringData
        }
      } else {
        // this.OrderStatus = 0;
        data = {
          Offset: Math.ceil(start / 10), //页面
          RowNumber: 10, //条数
          TransactionType: type,
          FishNumber: chooseNum,
          OrderStatus: this.OrderStatus,
          Captain: this.captain,
          AcceptPayWay: this.AcceptPayWay
        };
        let stringData = JSON.stringify(data)
        param = {
          action: 'ReadFishOrder',
          data: stringData,
        };
      }
      let res = await this.$api.api.getFish(param);
      if (res.data.status == true) {
        let userId = uni.getStorageSync('UserId')
        let phone = uni.getStorageSync('phone')
        res.data.data.forEach((item, index) => {
          item.FishPrice = Number(item.FishPrice).toFixed(2);
          item.FishNumber = Number(item.FishNumber).toFixed(2);
          item.RemainFish = Number(item.RemainFish).toFixed(2);
          item.total = Number(item.FishPrice * item.FishNumber).toFixed(2);
          if (item.TransactionType && userId != item.SellerUserId) {
            //false买否则卖
            item.TransactionType1 = '卖出';
          } else {
            item.TransactionType1 = '买入';
          }
          if (!item.BuyerUserBindName) {
            if (item.UserBindName) {
              item.UserBindName = item.UserBindName.replace(
                /(\d{3})\d{4}(\d{4})/,
                '$1****$2'
              );
            }
            if (item.SellerUserBindName) {
              item.SellerUserBindName = item.SellerUserBindName.replace(
                /(\d{3})\d{4}(\d{4})/,
                '$1****$2'
              );
            }
          } else {
            if (item.BuyerUserBindName == phone) {
              item.picture = item.UserHead
              item.phone = item.SellerUserBindName.replace(
                /(\d{3})\d{4}(\d{4})/,
                '$1****$2'
              );
            } else {
              item.picture = item.BuyerUserHead
              item.phone = item.BuyerUserBindName.replace(
                /(\d{3})\d{4}(\d{4})/,
                '$1****$2'
              );
            }
          }
          if (item.OrderStatus == 0) {
            item.OrderStatus = '未支付';
          }
          if (item.OrderStatus == 1) {
            item.OrderStatus = '未支付';
          }
          if (item.OrderStatus == 2) {
            item.OrderStatus = '已支付';
          }
          if (item.OrderStatus == 10) {
            item.OrderStatus = '完成';
          }
          if (item.OrderStatus == 11) {
            item.OrderStatus = '取消';
          }
          if (item.OrderStatus == 15) {
            item.OrderStatus = '关闭';
          }
          if (item.OrderStatus == 20) {
            if (item.SellerUserId == userId) {
              if(item.TransactionType){
				  if (item.Appealer) {
				    item.OrderStatus = '申诉成功';
				  } else {
				    item.OrderStatus = '应诉失败';
				  }
			  }else{
				  if (item.Appealer) {
				    item.OrderStatus = '应诉成功';
				  } else {
				    item.OrderStatus = '申诉失败';
				  }
			  }
            } else {
              if(item.TransactionType){
				  if (item.Appealer) {
				    item.OrderStatus = '应诉失败';
				  } else {
				    item.OrderStatus = '申诉成功';
				  }
			  }else{
				 if (item.Appealer) {
				   item.OrderStatus = '申诉失败';
				 } else {
				   item.OrderStatus = '应诉成功';
				 }
			  }
            }
          }
          if (item.OrderStatus == 21) {
            if (item.SellerUserId != userId) {
              if(item.TransactionType){
				  if (item.Appealer) {
				    item.OrderStatus = '申诉成功';
				  } else {
				    item.OrderStatus = '申诉失败';
				  }
			  }else{
				  if (item.Appealer) {
				    item.OrderStatus = '应诉成功';
				  } else {
				    item.OrderStatus = '应诉失败';
				  }
			  }
            } else {
              if(item.TransactionType){
				  if (item.Appealer) {
				    item.OrderStatus = '应诉失败';
				  } else {
				    item.OrderStatus = '应诉成功';
				  }
			  }else{
				  if (item.Appealer) {
				    item.OrderStatus = '申诉失败';
				  } else {
				    item.OrderStatus = '申诉成功';
				  }
			  }
            }
          }
          if (item.OrderStatus == 12) {
            if (item.SellerUserId == userId) {
              if (item.Appealer) {
                item.OrderStatus = '申诉中';
              } else {
                item.OrderStatus = '应诉';
              }
            } else {
              if (item.Appealer) {
                item.OrderStatus = '应诉';
              } else {
                item.OrderStatus = '申诉中';
              }
            }
            // item.OrderStatus = '申诉中';
          }
          if (item.OrderStatus == 13) {
            item.OrderStatus = '拒绝接单';
          }
          if (item.OrderStatus == 14) {
            item.OrderStatus = '接单超时';
          }
          if (item.AcceptPayWay) {
            let accept = JSON.parse(item.AcceptPayWay);
            if (accept[0] == 2) {
              item.payWay = '余额';
            }
            if (accept[0] == 10) {
              item.payWay = '银行卡';
            }
            if (accept[0] == 11) {
              item.payWay = '支付宝';
            }
            if (accept[0] == 12) {
              item.payWay = '微信';
            }
          }
        });
        this.navList[index].total = res.data.sum;
        this.navList[index].start += res.data.data.length;
        this.navList[index].orderList = this.navList[index].orderList.concat(
          res.data.data
        );
        this.navList[index].loadingType =
          this.navList[index].total > this.navList[index].start ?
            'more' :
            'nomore';
      }
    },
    //swiper 切换
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
      this.navList[this.tabCurrentIndex].orderList = [];
      this.navList[this.tabCurrentIndex].start = 0;
      this.navList[this.tabCurrentIndex].total = null;
      this.chooseNum = '1-';
      this.OrderStatus = '';
      if (this.tabCurrentIndex == 2) {
        this.captain = 0;
        this.getData();
      } else {
        this.captain = 1;
        this.getData();
      }
    },
    //顶部tab点击
    tabClick(index) {
      this.tabCurrentIndex = index;
    },
    // 全部状态的选中项的的改变
    changeState(id, index) {
      this.stateCruuent = index;
      this.OrderStatus = this.orderList[index].oId;
      this.navList[this.tabCurrentIndex].orderList = [];
      this.navList[this.tabCurrentIndex].start = 0;
      this.navList[this.tabCurrentIndex].total = null;
      this.getData();
      this.$refs.statePopup.close();
    },
    // 点击打开全部状态的弹出框
    stateOpen() {
      this.$refs.statePopup.open();
    },
    // 点击打开筛选的弹出框
    openScreen() {
      this.$refs.popup.open();
    },
    // 点击更改支付方式
    changePayment(type) {
      this.payment = type;
      this.AcceptPayWay = this.paymentName[type].id;
      //    this.navList[this.tabCurrentIndex].orderList = [];
      //    this.navList[this.tabCurrentIndex].start = 0;
      //    this.navList[this.tabCurrentIndex].total = null;
      //    this.getData();
      //    this.$refs.popup.close();
    },
    // 点击更换数量
    changeNum(id) {
      this.paymentNum = id;
      this.chooseNum = this.numberList[id].snum;
      //    this.navList[this.tabCurrentIndex].orderList = [];
      //    this.navList[this.tabCurrentIndex].start = 0;
      //    this.navList[this.tabCurrentIndex].total = null;
      //    this.getData();
      //    this.$refs.popup.close();
    },
    // 筛选的重置按钮
    screenReset() {
      this.payment = 0;
      this.paymentNum = 0;
      this.AcceptPayWay = ""
      this.chooseNum = "1-"
      this.navList[this.tabCurrentIndex].orderList = [];
      this.navList[this.tabCurrentIndex].start = 0;
      this.navList[this.tabCurrentIndex].total = null;
      this.getData();
      this.$refs.popup.close();
    },
    // 筛选
    screenDetermine() {
      this.navList[this.tabCurrentIndex].orderList = [];
      this.navList[this.tabCurrentIndex].start = 0;
      this.navList[this.tabCurrentIndex].total = null;
      this.getData();
      this.$refs.popup.close();
    },
    // 根据条件 打开或关闭 买卖的弹框
    toggleSpec(item) {
      this.buyNUm = ''
      this.pic = item.UserHead
      if (this.specClass === 'show') {
        this.specClass = 'hide';
        setTimeout(() => {
          this.specClass = 'none';
        }, 250);
      } else if (this.specClass === 'none') {
        this.params = item;
        console.log(this.params);
        if (item.payWay == '银行卡') {
          this.payCode = 10;
        } else if (item.payWay == '微信') {
          this.payCode = 12;
        } else if (item.payWay == '支付宝') {
          this.payCode = 11;
        } else if (item.payWay == '余额') {
          this.payCode = 2;
        }
        let obj = JSON.parse(item.AcceptPayWay);
        this.payList = obj[0];
        this.specClass = 'show';
      }
    },
    async getPayWay() {
      let data = {
        data: '',
      };
      let StringData = JSON.stringify(data);
      let param = {
        action: 'ReadPaymentInformation',
        data: StringData,
      };
      let res = await this.$api.api.query(param);
      if (res.data.status == true) {
        this.payLists = res.data.data;
      }
    },
    submit(num) {
      this.$refs.clear.clear()
      this.num = num
      this.payId = [];
      this.payLists.forEach((item, index) => {
        if (item.Type) {
          this.payId.push(item.Type);
        }
      });
      var obj = {};
      this.payId.forEach((item, index) => {
        obj[item] = item;
      });

      if (obj[this.payCode] == undefined) {
        uni.showModal({
          title: '提示',
          content: '请去绑定',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/binding/binding?info=2',
              });
            } else if (res.cancel) { }
          },
        });
        return;
      }
      if (this.buyNUm == '') {
        this.$api.msg('数量不能为空');
        return;
      }
      this.specClass = "none"
      // for (var i in this.payWays) {
      //   var obj = this.payWays[i]
      //   obj.checked = index == i
      // }
      this.getAlert()
    },
    getAlert() {
      this.show = true
      return
    },
    getpassword(val) {
      this.getPsw = val
      this.pay()
    },
    pay() {
      let num = this.num
      let xfnum = '';
      let Balance = '';
      if (num == 0) {
        xfnum = 1;
        Balance = 0;
      }
      if (num == 1) {
        xfnum = 0;
        Balance = this.totalPrice;
      }
      let data = {
        FishOrderId: this.params.FishOrderId,
        SellerUserId: this.params.UserId,
        FishPrice: this.params.FishPrice,
        FishNumber: this.buyNUm,
        Balance: Balance,
        TransactionType: xfnum,
        PayWay: this.payList
      };
      let StringData = JSON.stringify(data);
      let param = {
        action: 'UpdateFishOrder',
        data: StringData,
        TradePassword: this.getPsw
      };
      this.$api.api.getFish(param).then((res) => {
        if (res.data.status == true) {
          this.$api.msg('交易成功');
          if (this.payCode == 2) {
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/FishCurrency/transaction/transaction',
              });
            }, 800);
            return (this.specClass = 'none');
          }
          if (num == 1) {
            setTimeout(() => {
              uni.navigateTo({
                url: './payInfo?orderId=' + res.data.data,
              });
            }, 800);
          } else {
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/FishCurrency/transaction/buyProcess/buyProcess?orderId=' +
                  res.data.data,
              });
            }, 800);
          }
        } else {
          this.$api.msg(res.data.message);
          // setTimeout(() => {
          // 	uni.navigateTo({
          // 		url:"./payInfo?id="+ this.params.FishOrderId
          // 	})
          // 	this.specClass = 'none';
          // },800)
        }
      });
    },
    choose(index) {
      if (index == 2) {
        this.$api.msg('此功能暂未开放');
        return;
      } else if (index == 3) {
        this.$api.msg('此功能暂未开放');
        return;
      }
      this.muqian = this.payWay[index];
      this.isflag = false;
    },
    scroll() {
      this.isflag = !this.isflag;
    },
    stopPrevent() { },
  },
};
</script>

<style lang="scss">
.sell {
  color: #52b88a !important;
}

// 状态区域
.order-titles {
  position: fixed;
  width: 100%;
  height: 84rpx;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  z-index: 99;

  .order-titles-copy {
    padding: 20rpx 40rpx;
    display: flex;
    align-items: center;

    > view {
      font-weight: 700;
      color: #223041;
      margin-right: 15rpx;
    }

    > image {
      width: 21rpx;
      height: 21rpx;
    }
  }
}

.orders-copy {
  width: 100%;
  height: 84rpx;
}

.box {
  .box-copy {
    width: 100%;
    position: fixed;
    z-index: 99;
    background-color: #fff;

    // 头部 tab 栏区域
    .box-head {
      background-color: #223041;
      padding-bottom: 20rpx;

      .box-title {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 454rpx;
        height: 46rpx;
        margin: auto;
        border: 1rpx solid rgba(195, 69, 84, 1);
        border-right: none;
        color: #c34554;
        border-radius: 8rpx;

        > view {
          text-align: center;
          width: 100%;
          font-size: 28rpx;
          border-radius: 8rpx;
          border-right: 1rpx solid #c34554;
        }

        // tab 栏默认选中项
        .tabActive {
          color: #fff;
          background-color: #c34554;
        }
      }
    }
  }

  // 筛选区域
  .screen {
    width: 100%;
    height: 75rpx;
    padding: 0 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    background-color: #fff;

    // 筛选的左边
    .screen-left {
      font-size: 30rpx;
      color: #000;
      font-weight: 700;
      border-bottom: 2rpx solid #c34554;
    }

    // 筛选的右边
    .screen-right {
      display: flex;
      align-items: center;

      > view {
        font-size: 28rpx;
        color: #525252;
      }

      > image {
        margin-left: 8rpx;
        width: 18rpx;
        height: 18rpx;
      }
    }
  }

  .box-content-copy {
    height: 140rpx;
  }

  .swiper-box {
    background-color: #fff;

    .swiper-item {
      margin-bottom: 10rpx;

      .item-box {
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        border-bottom: 1rpx solid #ececec;

        // 单独盒子的左边
        .item-left {
          // 左边的上部分
          .left-top {
            display: flex;
            align-items: center;

            // 用户头像照片
            .head-img {
              margin-right: 34rpx;
              width: 68rpx;
              height: 68rpx;
            }

            // 名称区域
            .top-content {
              .content-box {
                display: flex;
                align-items: center;

                // 商品名称
                .content-name {
                  font-weight: 700;
                  font-size: 28rpx;
                  color: #223041;
                  margin-right: 26rpx;
                }

                // 认证
                .content-authentication {
                  width: 68rpx;
                  height: 33rpx;
                  line-height: 33rpx;
                  font-size: 24rpx;
                  text-align: center;
                  color: #fff;
                  border-radius: 9rpx;
                  background-color: #eda257;
                }
              }

              .content-img {
                margin: 20rpx 0;
                width: 40rpx;
                height: 40rpx;
              }
            }
          }

          // 左边的下部分
          .left-bottom {
            font-size: 22rpx;
            color: #848484;
          }
        }

        // 单独盒子的右边
        .item-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;

          // 买卖
          .right-common {
            width: 118rpx;
            height: 46rpx;
            line-height: 46rpx;
            text-align: center;
            border-radius: 23rpx;
            font-size: 24rpx;
            color: #fff;
          }

          .right-buy {
            background-color: #c34554;
          }

          .right-sell {
            background-color: #52b88a;
          }

          // 单价
          .right-unit-price {
            font-size: 22rpx;
            color: #848484;
          }

          // 价格
          .right-price {
            font-size: 40rpx;
            color: #223041;
          }
        }
      }

      // 订单内容区域
      .order {
        // 内容区域
        .order-content {
          padding: 32rpx;
          border-bottom: 6rpx solid #f5f5f5;

          // 内容的上边区域
          .content-top {
            display: flex;
            justify-content: space-between;

            > view {
              color: #223041;
            }

            text {
              font-size: 31rpx;
              color: #223041;
              font-weight: 600;
            }

            .content-business {
              color: #c34554;
            }
          }

          // 内容的中间区域
          .content-Middle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 24rpx 0;

            .middle-name-headimg {
              display: flex;
              align-items: center;

              > view {
                color: #223041;
              }

              > image {
                width: 68rpx;
                height: 68rpx;
                margin-right: 34rpx;
              }
            }

            .middle-data {
              color: #aeaeae;
            }
          }

          // 内容的下边区域
          .content-bottom {
            .bottom-flex {
              display: flex;
              justify-content: space-between;

              > view {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
            }
          }
        }
      }

      // 状态区域
      .order-title {
        height: 84rpx;
        display: flex;
        align-items: center;
        background-color: #f5f5f5;

        .order-title-copy {
          padding: 20rpx 40rpx;
          display: flex;
          align-items: center;

          > view {
            font-weight: 700;
            color: #223041;
            margin-right: 15rpx;
          }

          > image {
            width: 21rpx;
            height: 21rpx;
          }
        }
      }
    }
  }

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
      min-height: 60vh;
      border-radius: 10upx 10upx 0 0;
      background-color: #fff;
      padding: 20rpx 5%;
      background-color: #f1f3f8;

      .layer-hd {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
          font-size: 34rpx;
          color: #373737;
          font-weight: 500;
        }

        .right {
          font-size: 48rpx;
          color: #6e6e6e;
        }
      }

      .img {
        margin: 0rpx auto 10rpx;
        text-align: center;

        image {
          height: 84rpx;
          width: 84rpx;
        }
      }

      .animation {
        animation: pull 0.1s linear both;
      }

      @keyframes pull {
        0% {
          height: 0;
        }

        100% {
          height: 375rpx;
        }
      }

      .list {
        width: 100%;
        height: 106rpx;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        border-radius: 10rpx;
        position: relative;

        .price {
          font-size: 32rpx;
          color: #223041;
          font-weight: 500;
        }

        .tip-box {
          width: 344rpx;
          // height:256rpx;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 10rpx 0px rgba(138, 138, 138, 0.5);
          border-radius: 9rpx;
          position: absolute;
          right: 0rpx;
          top: 110rpx;
          z-index: 999;
          padding: 0 3%;

          text {
            font-size: 32rpx;
            color: #5e5e5e;
          }

          .zfb {
            display: flex;
            height: 94rpx;
            justify-content: center;
            align-items: center;
            border-bottom: 1rpx solid #eeeeee;

            image {
              height: 62rpx;
              width: 62rpx;
              margin-right: 20rpx;
            }
          }

          .wx {
            display: flex;
            height: 127rpx;
            justify-content: center;
            align-items: center;

            image {
              height: 57rpx;
              width: 62rpx;
              margin-right: 20rpx;
            }
          }
        }
      }

      .tip-title {
        padding: 10rpx 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 23rpx;
        color: #373737;
      }

      .submit-common {
        height: 82rpx;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;
        color: #ffffff;
        border-radius: 10rpx;
        margin-top: 77rpx;
      }

      .buy-submit {
        background-color: #c34554;
      }

      .sell-submit {
        background-color: #52b88a;
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
}

.color {
  color: #909399;
}

page,
.content {
  background: $page-color-base;
  height: 100%;
}

.swiper-box {
  height: calc(100% - 40px);
}

.list-scroll-content {
  height: 100%;
}

.navbar {
  display: flex;
  height: 40px;
  padding: 0 5px;
  background: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;

  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 15px;
    color: $font-color-dark;
    position: relative;

    &.current {
      color: #323f6c;

      &:after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 44px;
        height: 0;
        border-bottom: 2px solid #323f6c;
      }
    }
  }
}

// 全部状态弹出框
.popup-box {
  // 状态区域
  .order-title {
    height: 84rpx;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;

    .order-title-copy {
      padding: 20rpx 40rpx;
      display: flex;
      align-items: center;

      > view {
        font-weight: 700;
        color: #223041;
        margin-right: 15rpx;
      }

      > image {
        width: 21rpx;
        height: 21rpx;
      }
    }
  }

  .state-List {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;

    .state-item {
      width: 215rpx;
      height: 80rpx;
      margin: 10rpx;
      line-height: 80rpx;
      text-align: center;
      background-color: #f4f4f4;
      border: 1rpx solid transparent;
    }

    // 全部状态的选中项
    .stateActive {
      border: 1rpx solid #c34554 !important;
      color: #c34554 !important;
    }
  }
}

// 筛选弹出框区域
.popup-box {
  background-color: #fff;

  // 筛选区域的支付方式默认选中项
  .paymentActive {
    border: 1rpx solid #c34554 !important;
    color: #c34554 !important;
  }

  .screen-box {
    padding: 30rpx;

    .payment-method {
      color: #223041;
      font-size: 30rpx;
    }

    .payment-name {
      display: flex;

      > view {
        font-size: 24rpx;
        margin: 20rpx;
        width: 140rpx;
        height: 66rpx;
        line-height: 66rpx;
        text-align: center;
        background-color: #f3f3f3;
        border-radius: 10rpx;
        border: 1rpx solid transparent;
        position: relative;

        > image {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 50rpx;
          height: 50rpx;
        }
      }
    }
  }

  .screen-footer {
    display: flex;
    justify-content: space-evenly;
    padding-bottom: 62rpx;

    > view {
      width: 333rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 30rpx;
      font-weight: 600;
      border-radius: 2rpx;
    }

    .screen-reset {
      color: #223041;
      background-color: #dae0e7;
    }

    .screen-screen {
      color: #fff;
      background-color: #223041;
    }
  }
}

.uni-swiper-item {
  height: auto;
}

/* load-more */
.uni-load-more {
  display: flex;
  flex-direction: row;
  height: 80upx;
  align-items: center;
  justify-content: center;
}

.uni-load-more__text {
  font-size: 28upx;
  color: #999;
}

.uni-load-more__img {
  height: 24px;
  width: 24px;
  margin-right: 10px;
}

.uni-load-more__img > view {
  position: absolute;
}

.uni-load-more__img > view view {
  width: 6px;
  height: 2px;
  border-top-left-radius: 1px;
  border-bottom-left-radius: 1px;
  background: #999;
  position: absolute;
  opacity: 0.2;
  transform-origin: 50%;
  animation: load 1.56s ease infinite;
}

.uni-load-more__img > view view:nth-child(1) {
  transform: rotate(90deg);
  top: 2px;
  left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
  transform: rotate(180deg);
  top: 11px;
  right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
  transform: rotate(270deg);
  bottom: 2px;
  left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
  top: 11px;
  left: 0;
}

.load1,
.load2,
.load3 {
  height: 24px;
  width: 24px;
}

.activeys {
  background-color: #ffffff !important;
  color: #fa436a !important;
}

.load2 {
  transform: rotate(30deg);
}

.load3 {
  transform: rotate(60deg);
}

.load1 view:nth-child(1) {
  animation-delay: 0s;
}

.load2 view:nth-child(1) {
  animation-delay: 0.13s;
}

.load3 view:nth-child(1) {
  animation-delay: 0.26s;
}

.load1 view:nth-child(2) {
  animation-delay: 0.39s;
}

.load2 view:nth-child(2) {
  animation-delay: 0.52s;
}

.load3 view:nth-child(2) {
  animation-delay: 0.65s;
}

.load1 view:nth-child(3) {
  animation-delay: 0.78s;
}

.load2 view:nth-child(3) {
  animation-delay: 0.91s;
}

.load3 view:nth-child(3) {
  animation-delay: 1.04s;
}

.load1 view:nth-child(4) {
  animation-delay: 1.17s;
}

.load2 view:nth-child(4) {
  animation-delay: 1.3s;
}

.load3 view:nth-child(4) {
  animation-delay: 1.43s;
}

@-webkit-keyframes load {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}
</style>
