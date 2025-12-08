<template>
  <view>
    <view>
      <!-- 地址 -->
      <navigator url="/pages/address/address?source=1"
                 class="address-section"
                 v-if="addressList.mobile">
        <view class="order-content">
          <text class="yticon icon-shouhuodizhi"></text>
          <view class="cen">
            <view class="top">
              <text class="name">{{addressList.receiver}}</text>
              <text class="mobile">{{addressList.mobile}}</text>
            </view>
            <text class="address">{{addressList.province}}{{addressList.city}}{{addressList.area}}{{addressList.addrDetail}}</text>
          </view>
          <text class="yticon icon-you"></text>
        </view>

        <image class="a-bg"
               src="../../static/a-bg.png"></image>
      </navigator>

      <navigator url="/pages/address/address?source=1"
                 class="address-section"
                 v-else>
        <view class="order-content">
          <text class="yticon icon-shouhuodizhi"></text>
          <view class="cen">
            <text>请输入地址</text>
          </view>
          <text class="yticon icon-you"></text>
        </view>

        <image class="a-bg"
               src="../../static/a-bg.png"></image>
      </navigator>

      <view class="goods-section">
        <!--    <view class="g-header b-b">
	           <image class="logo"
	                  src="http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png"></image>
	           <text class="name">西城小店铺</text>
	         </view> -->
        <!-- 商品列表 -->
        <!-- 			<view class="g-item">
	   				<image src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=756705744,3505936868&fm=11&gp=0.jpg"></image>
	   				<view class="right">
	   					<text class="title clamp">古黛妃 短袖t恤女夏装2019新款</text>
	   					<text class="spec">春装款 L</text>
	   					<view class="price-box">
	   						<text class="price">￥17.8</text>
	   						<text class="number">x 1</text>
	   					</view>
	   				</view>
	   			</view> -->
        <view class="g-item">
          <image :src='shopDetails.mainImage'></image>
          <view class="right">
            <text class="title clamp">{{shopDetails.productName}}</text>
            <view class="price-box">
              <text class="price">￥{{shopDetails.price}}</text>
              <text class="number"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 优惠明细 -->
      <view class="yt-list">
      </view>
      <!-- 金额明细 -->
      <view class="yt-list">
        <view class="yt-list-cell b-b">
          <text class="cell-tit clamp">商品金额</text>
          <text class="cell-tip">￥{{shopDetails.price}}</text>
        </view>
        <view class="yt-list-cell b-b">
          <text class="cell-tit clamp">运费</text>
          <text class="cell-tip">免运费</text>
        </view>
		<view class="yt-list-cell b-b">
		  <text class="cell-tit clamp">所属人</text>
		  <text class="cell-tip">{{shopDetails.belongUser.realName}}</text>
		</view>
		<view class="yt-list-cell b-b">
		  <text class="cell-tit clamp">联系方式</text>
		  <text class="cell-tip">{{shopDetails.belongUser.userMobile}}</text>
		</view>
<!--        <view class="yt-list-cell desc-cell">
          <text class="cell-tit clamp">备注</text>
          <input class="desc"
                 type="text"
                 v-model="desc"
                 placeholder="请填写备注信息"
                 placeholder-class="placeholder" />
        </view> -->
		<view class="yt-list-cell b-b">
		  <text class="cell-tit clamp">微信收款码</text>
		  <img class="cell-tip" @click="previewShopImg(shopDetails.belongUser.wechatCode)" style="width: 50%;" :src="shopDetails.belongUser.wechatCode" alt="">
		</view>
		<view class="yt-list-cell b-b">
		  <text class="cell-tit clamp">支付宝收款码</text>
		  <img @click="previewShopImg(shopDetails.belongUser.aliCode)" class="cell-tip" style="width: 50%;" :src="shopDetails.belongUser.aliCode" alt="">
		</view>
      </view>
	  
	  
	  <!-- 收款码 -->
<!-- 	  <view class="yt-list-cell b-b">
		  <text class="cell-tip" style="color: #909399;">微信收款码</text>
		  <img style="width: 50%;" :src="shopDetails.belongUser.wechatCode" alt="">
	  </view>
	  <view class="yt-list-cell b-b">
		  <view style="color: #909399;" class="cell-tip">支付宝收款码</view>
		  <img style="width: 50%;" :src="shopDetails.belongUser.aliCode" alt="">
	  </view> -->

      <!-- 底部 -->
      <view class="footer">
        <view class="price-content">
          <text>实付款</text>
          <text class="price-tip">￥</text>
          <text class="price">{{shopDetails.price}}</text>
        </view>
        <text class="submit"
              @click="submit">提交订单</text>
      </view>
	  <!-- 规格预览图片区域的弹框 -->
	  <uni-popup ref="popups"
	             type="center">
	    <view>
	      <image class="preview-shopImg"
	             :src="shopImg" style="height: 720rpx;"></image>
	    </view>
	  </uni-popup>
	     <uni-popup ref="popup"
	                 type="center">
	        <view class="contact-popup">
				<view>上传支付凭证</view>
	        </view>
			<view class="updata" @click="updata()">
			  <view class="updata-box" v-if="!paypzImg">
			    <view class="updata-content">
			      <img src="../../static/temp/camera.png"></image>
			      <view>上传支付凭证</view>
			    </view>
			  </view>
			  <img
			    class="img"
			   v-else
			    :src="paypzImg"
			  ></img>
			</view>
	      </uni-popup>
    </view>

    <passkeyborad :show="show"
                  :price="price"
                  @close="close"
                  @getpassword="getpassword"
                  :fc="flag"
                  :payWay="buyList[chooseTarget].text"></passkeyborad>
    <web-view v-if="isZfb"
              :src="zfbWeb"></web-view>
  </view>
</template>

<script>
import passkeyborad from '@/components/yzc-paykeyboard/yzc-paykeyboard.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
  components: {
    passkeyborad,
	uniPopup
  },
  data () {
    return {
		paypzImg: '',
		shopImg:'',
		addressList: {
			mobile: '',
			receiver: '',
			province: '',
			city: '',
			area: '',
			addrDetail: ''
		},
		shopDetails: {
			belongUser: {}
		},
      buyList: [{
        name: "余额支付",
        index: 0,
        img: "../../static/check.png",
        img1: "../../static/checked.png",
        payType: 77,
        price: "200",
        tip: "余额不足",
        text: "余额",
        checked: true
      },
      // {
      //   name: "FC支付",
      //   index: 1,
      //   img: "../../static/check.png",
      //   img1: "../../static/checked.png",
      //   payType: 66,
      //   price: "100",
      //   tip: "FC不足",
      //   text: "FC",
      //   checked: true
      // },
      // h5 的微信支付(微信公众号)和支付宝支付
      // #ifdef H5 || MP-WEIXIN
      {
        name: "微信支付",
        index: 1,
        img: "../../static/check.png",
        img1: "../../static/checked.png",
        payType: 88,
        price: "",
        checked: uni.getStorageSync('isWeixin')
      },
      {
        name: "支付宝支付",
        index: 2,
        img: "../../static/check.png",
        img1: "../../static/checked.png",
        payType: 55,
        price: "",
        checked: !uni.getStorageSync('isWeixin')
      },
      // #endif
      // app 的微信支付和支付宝支付
      // #ifdef APP-PLUS
      {
        name: "微信支付",
        index: 1,
        img: "../../static/check.png",
        img1: "../../static/checked.png",
        payType: 88,
        price: "",
        checked: true
      },
      {
        name: "支付宝支付",
        index: 2,
        img: "../../static/check.png",
        img1: "../../static/checked.png",
        payType: 55,
        price: "",
        checked: true
      }
        // #endif
      ],
      flag: true,
      maskState: 0, //优惠券面板显示状态
      desc: '', //备注
      payType: 77, //88微信 99支付宝
      ysChecked: 1,
      // orderDetail: '',
      MoRenAddress: {},
      shopList: [],
      price: null, //总金额
      arrNUm: '', //数量数组
      arrID: '', //id数组
      userInfo: '', //用户信息
      show: false,
      getPsw: '',
      // orderDetail:this.$store.state.shopList,
      id: '',
      cate: '',
      OpenId: '',
      chooseTarget: 0,
      isZfb: false,
      zfbWeb: '',
      isWeixin: '',
	  orderNum: ''
    }
  },
  onLoad (option) {
    if (option.id) {
      this.id = option.id
      this.getOnce(option.id)
	  this.getAddress()
	  //创建订单
	  // this.createOrder(option.id)
      this.cate = 1 //立刻购买
    } else {
      this.price = Number(option.price);
      this.cate = 0 //购车购买
    }
    // this.getShopDetail(orderId)//获取详情
    //商品数据
    //let data = JSON.parse(option.data);
    //console.log(data);
  },
  onShow () {
	  this.orderNum = ''
	  this.addressList = this.$store.state.saveAddress
	  console.log(111)
	  console.log(this.addressList)
	  console.log(111)
  },
  methods: {
	  closePage(){
		  this.$refs.popup.close();
	  },
	  // 点击上传照片
	  updata(type) {
	    uni.chooseImage({
	      count: 1,
	      success: (res) => {
	        this.copyImg = res.tempFiles[0].path;
	        let uploadTask = uni.uploadFile({
	          url: this.$config.domain.api + 'tob/image/uploadToOss',
	          filePath: res.tempFiles[0].path,
	          name: 'file',
	  		header: {
	  			Authorization: uni.getStorageSync('token')
	  		},	
	          formData: {
	            action: 'VoucherUpload',
	            dlogo: true,
	          },
	          success: (res) => {
	            if (res.errMsg == 'uploadFile:ok') {
	  			  let data = JSON.parse(res.data)
	  			  if(data.code == '000000'){
					  this.paypzImg = data.data;
	  				  this.$api.msg('上传完成', 1500, true, 'none');
					  this.closePage()
	  			  }else{
	  				 this.$api.msg(res.msg)
	  			  }
	            }
	          },
	        });
	      },
	    });
	  },
	  previewShopImg (url) {
		this.shopImg = url
	    this.$refs.popups.open();
	  },
	 async createOrder(id){
		  let res = await this.$api.api.createOrder({productId: id})
		  this.code = res.code
		  this.orderNum = res.data.orderId
		  if(res.code == '000000'){
			  
		  }else{
			  this.$api.msg(res.msg)
		  }
	  },
    async getOrder (VoucherNumber) {
      let data = {
        action: 'APPPay',
        VoucherNumber: VoucherNumber,
      }
      let res = await this.$api.api.payWay(data)
      // console.log(res.data.data)
      let orderInfo = res.data
      // if (res.data.status == 'true') {
      // console.log(orderInfo)
      if (orderInfo.statusCode !== 200) {
        console.log("获得订单信息失败", orderInfo);
        uni.showModal({
          content: "获得订单信息失败",
          showCancel: false
        })
        return;
      }
      let oreder = orderInfo.data
      console.log(oreder)
      // oreder.appId = 'wxbb851b0e79cbe797'

      uni.requestPayment({
        provider: 'wxpay',
        orderInfo: oreder,
        // _debug: 1,
        success: (e) => {
          console.log("success", e);
          uni.showToast({
            title: "感谢您的赞助!"
          })
        },
        fail: (e) => {
          console.log("fail", e);
          uni.showModal({
            content: "支付失败,原因为: " + e.errMsg,
            showCancel: false
          })
        }
      })
      // }
    },
    close () {
      this.show = false
    },
    getpassword (val) {
      this.getPsw = val
      this.pay()
    },
    //得到用户信息
    async getUserInfo () {
      let param = {
        action: 'GetMemberInfo'
      }
      let res = await this.$api.api.getUserInfo(param)
      // console.log(res)
      if (res.data.status == true) {
        this.userInfo = res.data.Data
        this.OpenId = res.data.Data.OpenId
        this.buyList[0].price = this.userInfo.Points
        this.buyList[1].price = this.userInfo.FishCoin
        uni.setStorageSync('openId', this.OpenId)
        // console.log(this.userInfo)
      }
    },
    async getOnce (id) {
      let res = await this.$api.api.productDetail({id: id});
		  if(res.code == '000000'){
			  this.shopDetails = res.data
			  this.shopDetails.subImages = res.data.subImages.split(',')
			  console.log(this.shopDetails)
		  }else{
			this.$api.msg(res.msg);
		  }
    },
    async getAddress () {
		let data = {
		  page: "1",
			pageSize: '100'
		}
		let res = await this.$api.api.userAddrSelectByUserId(data)
		this.addressList = res.data.records.find(item => item.commonAddr == 1) ||  {			mobile: '',
			receiver: '',
			province: '',
			city: '',
			area: '',
			addrDetail: ''}
		console.log(this.addressList)
    },
    //获取默认地址
    async getMoRenAddress () {

      let data = {
        action: 'GetDefaultShippingAddress'
      }
      let res = await this.$api.api.getMoRenAddress(data)
      if (res.data.status == true) {
        this.MoRenAddress = res.data.data
      }
    },
    // 得到详情
    // async getShopDetail(orderId) {
    //   let data = {
    //     action: 'GetOrderInfoByID',
    //     OrderId: orderId
    //   }
    //   let res = await this.$api.api.getShopDetail(data);
    //   if (res.data.status == true) {
    //     let result = res.data.Data;
    //     result.ShippingRegion = result.ShippingRegion.replace(/,/g, "")
    //     this.orderDetail = result
    //   }
    // },
    //显示优惠券面板
    toggleMask (type) {
      let timer = type === 'show' ? 10 : 300;
      let state = type === 'show' ? 1 : 0;
      this.maskState = 2;
      setTimeout(() => {
        this.maskState = state;
      }, timer)
    },
    numberChange (data) {
      this.number = data.number;
    },
    changePayType (type, typeIndex) {
      this.payType = type;
      this.chooseTarget = this.buyList[typeIndex].index
    },
    pay () {
      uni.showLoading({
        title: '加载中...'
      });
      let param = {
        TradePassword: this.getPsw,
        CategoryId: this.cate,
        action: 'Submmitorder',
        PointNumber: 0, // 积分抵现  传空
        selectCouponValue: '', // 选择优惠券  传空
        Shippingcity: '', //选择的省市区域ID
        shippingType: '', // 配送方式
        paymentType: this.payType, //支付方式
        couponCode: '', // 优惠码
        redpagerid: '', //抵用券ID
        shippingId: this.MoRenAddress.ShippingId, //收货地址ID
        productSku: this.arrID, //产品规格ID
        buyAmount: this.arrNUm, //购买数量
        shiptoDate: '', //选择收货时间
        groupbuyId: '', // 分组购买ID  传空
        remark: this.desc, //备注
        bargainDetialId: '', //砍价ID
        limitedTimeDiscountId: 0, //支付方式名称
        PaymentMethod: 0, //支付方式（线下支付时使用）
        PaymentMethodName: '', // 支付方式名称
        IDCardFront: '', //线下转账时身份证照片1
        PaymentVoucher: '', // 线下转账交易凭证1
        PayTimeYear: '', //线下支付，银行转账时，转账年
        PayTimeMonth: '', //线下支付，银行转账时，转账月
        PayTimeDate: '', //线下支付，银行转账时，转账日
        PayTimeHours: '', //  线下支付，银行转账时，转账时
        PayTimeMinute: '', //  线下支付，银行转账时，转账分
        PayUserName: '', //  线下支付，银行转账时，转账人
        ID2CardFront: '', // 线下转账时身份证照片2
        Payment2Voucher: '', //  线下转账交易凭证2
        Payment3Voucher: '', //  线下转账交易凭证3
        Payment4Voucher: '', //  线下转账交易凭证4
        Payment5Voucher: '', //  线下转账交易凭证5
        PlaceBranch: '', //  放置分店  传0
        randomnumber: new Date().getTime() //随机数  用于重复提交订单判断
      }
      this.$api.api.Submmitorder(param).then((res) => {
        if (this.payType == 77) {
          if (res.data.status == true) {
            let OrderId = res.data.OrderId;
            uni.hideLoading()
            this.$api.msg('购买成功！！！')
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 600)
          } else {
            this.$api.msg(res.data.message)
          }
        }
        // #ifdef H5 || MP-WEIXIN
        if (this.payType == 88) {
          if (res.data.status == true) {
            let VoucherNumber = res.data.VoucherNumber;
            let param = {
              action: 'Pay',
              VoucherNumber: VoucherNumber,
              OpenId: this.OpenId
            }
            uni.hideLoading()
            this.$api.api.payWay(param).then((res) => {
              if (res.data.status == 'true') {
                this.onBridgeReady(res.data)
              }
            })
          } else {
            // uni.navigateTo({
            // 	url: "/pages/order/order?state=1"
            // })
            uni.hideLoading()
            setTimeout(() => {
              this.$api.msg(res.data.message)
            }, 500)
          }
        }
        if (this.payType == 55) {
          if (res.data.status == true) {
            uni.hideLoading()
            let VoucherNumber = res.data.VoucherNumber
            this.getAliPayH5(VoucherNumber)
          }
        }
        // #endif
        if (this.payType == 66) {
          if (res.data.status == true) {
            let OrderId = res.data.OrderId;
            uni.hideLoading()
            this.$api.msg('购买成功！！！')
            setTimeout(function () {
              uni.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            this.$api.msg(res.data.message)
          }
        }
        // #ifdef APP-PLUS
        if (this.payType == 88) {
          if (res.data.status == true) {
            let VoucherNumber = res.data.VoucherNumber
            uni.hideLoading()
            this.getOrder(VoucherNumber)
          }
        }
        // 支付宝支付
        if (this.payType == 55) {
          if (res.data.status == true) {
            // console.log(res.data)
            uni.hideLoading()
            let VoucherNumber = res.data.VoucherNumber
            this.getAliPay(VoucherNumber)
          }
        }
        // #endif
      })
    },
    // 支付宝支付 h5
    async getAliPayH5 (VoucherNumber) {
      let data = {
        VoucherNumber: VoucherNumber,
        Driver: 'Wap',
        QuitUrl: 'http://xdkb2c.gup-group.cn/pages/order/order?state=0',
        ReturnUrl: 'http://xdkb2c.gup-group.cn/pages/order/order?state=0'
      }
      let res = await this.$api.api.aliPay(data)
      console.log(res)
      document.querySelector('body').innerHTML = res;
      const div = document.createElement('div') // 创建div
      div.innerHTML = res.data // 将返回的form 放入div
      document.body.appendChild(div)
      document.forms[0].submit()
      // locahost.href = res.data
      // this.zfbWeb = res.data
      // this.isZfb = true
    },
    // 支付宝支付 app
    async getAliPay (VoucherNumber) {
      let datas = {
        VoucherNumber: VoucherNumber,
      }
      let res = await this.$api.api.aliPay(datas)
      // console.log(res)
      let orderInfo = res
      if (orderInfo.statusCode !== 200) {
        console.log("获得订单信息失败", orderInfo);
        uni.showModal({
          content: "获得订单信息失败",
          showCancel: false
        })
        return;
      }
      uni.requestPayment({
        provider: 'alipay',
        orderInfo: orderInfo.data,
        success: result => {
          this.$api.msg('支付成功')
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/order/order?state=0'
            });
          }, 600);
        },
        fail: err => {
          console.log(err)
          uni.navigateBack({
            delta: 2
          });
        }
      })
      // let url = this.$config.domain.api + 'api/alipay.ashx'
      // // console.log(VoucherNumber)\
      // return new Promise(res => {
      //   uni.request({
      //     url: url,
      //     // method: 'POST',
      //     data: {
      //       VoucherNumber: VoucherNumber
      //     },
      //     success: result => {
      //       console.log(result)
      //     },
      //     fail: err => {
      //       console.log(err)
      //     }
      //   })
      // })
      // if (res.data.status == true) {
      //   let orderInfo = res
      //   uni.requestPayment({
      //     provider: 'alipay',
      //     orderInfo: orderInfo,
      //     success: res => {
      //       console.log(res)
      //     },
      //     fail: err => {
      //       console.log(err)
      //     }
      //   })
      // }
    },
    async submit () {
      // if (this.price < 500) {
      //   return this.$api.msg('购买的总金额需要大于 500', 2000, false, 'none')
      // }
      // console.log(this.buyList[this.chooseTarget].text)
      if (!this.addressList?.mobile) {
        this.$api.msg('请填写地址')
        return
      }
	  if(this.code == '999999'){
		  return
	  }
	  if(!this.paypzImg){
		  this.$refs.popup.open();
	  }else{
		  this.getorder()
	  }

      // if (this.userInfo.Points < this.buyList[chooseTarget].price) {
      // 	return this.$api.msg(this.buyList[chooseTarget].tip)
      // }
      // if (this.userInfo.FishCoin < this.buyList[chooseTarget].price) {
      // 	return this.$api.msg(this.buyList[chooseTarget].tip)
      // }
      // if(this.chooseTarget){

      // }
	  return
      if (this.payType == 88) {
        this.pay()
        return
      }
      if (this.payType == 55) {
        this.pay()
        return
      }
      if (!this.userInfo.TradePassword) {
        uni.navigateTo({
          url: "/pages/set/payPsw"
        })
        return
      }
      if (!this.show) {
        this.show = true
        return
      }
    },
	getorder(){
		this.$api.api.createOrder({productId: this.id}).then(res => {
			if(res.code == '000000'){
					this.orderNum = res.data.orderId	  
					this.$api.api.uploadPaymentProof({orderId: this.orderNum,paymentProof: this.paypzImg})
					if(res.code == '000000'){
							  this.$api.msg('交易成功')
							  setTimeout(function () {
							    uni.switchTab({
							  	url: `../user/user`,
							    });
							  }, 400)	
					}else{
							   this.$api.msg(res.msg)
					}
			}else{
				 this.$api.msg(res.msg)
			}
		})
	},
    onBridgeReady (item) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
        "appId": item.appid, //公众号名称，由商户传入     
        "timeStamp": item.timeStamp, //时间戳，自1970年以来的秒数     
        "nonceStr": item.nonceStr, //随机串     
        "package": "prepay_id=" + item.prepay_id,
        "signType": "MD5", //微信签名方式：     
        "paySign": item.paySign //微信签名 
      },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            uni.navigateTo({
              url: "/pages/money/paySuccess"
            })
          } else {
            this.$ap.msg('取消成功')
            setTimeout(function () {
              uni.navigateTo({
                url: "/pages/order/order?state=1"
              })
            }, 800)
          }
        });
    },
    // if (typeof WeixinJSBridge == "undefined"){
    //    if( document.addEventListener ){
    //        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    //    }else if (document.attachEvent){
    //        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
    //        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    //    }
    // }else{
    //    onBridgeReady();
    // }

    stopPrevent () { }
  }
}
</script>

<style lang="scss">
	// 上传照片区域
	.updata {
	  position: relative;
	  margin: 20rpx auto;
	  background-color: #f5f5f5;
	  width: 580rpx;
	  height: 580rpx;
	  border: 1rpx dashed #6c7aa7;
	  .img {
	    width: 100%;
	    height: 100%;
	  }
	  .updata-box {
	    position: absolute;
	    top: 50%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    .updata-content {
	      display: flex;
	      flex-direction: column;
	      align-items: center;
	      justify-content: space-evenly;
	      > img {
	        margin-bottom: 20rpx;
	        width: 100rpx;
	        height: 100rpx;
	      }
	    }
	  }
	}
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
page {
  background: $page-color-base;
  padding-bottom: 100upx;
}

.pay-type-list {
  margin-top: 20upx;
  background-color: #fff;
  padding-left: 30upx;

  .type-item {
    height: 120upx;
    padding: 20upx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30upx;
    font-size: 30upx;
    position: relative;
  }

  .icon {
    width: 100upx;
    font-size: 52upx;
  }

  .icon-erjiye-yucunkuan {
    color: #fe8e2e;
  }

  .icon-weixinzhifu {
    color: #36cb59;
  }

  .icon-alipay {
    color: #01aaef;
  }

  .tit {
    font-size: $font-lg;
    color: $font-color-dark;
    margin-bottom: 4upx;
  }

  .con {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: $font-sm;
    color: $font-color-light;
  }
}

.address-section {
  padding: 30upx 0;
  background: #fff;
  position: relative;

  .order-content {
    display: flex;
    align-items: center;
  }

  .icon-shouhuodizhi {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90upx;
    color: #888;
    font-size: 44upx;
  }

  .cen {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-size: 28upx;
    color: $font-color-dark;
  }

  .name {
    font-size: 34upx;
    margin-right: 24upx;
  }

  .address {
    margin-top: 16upx;
    margin-right: 20upx;
    color: $font-color-light;
  }

  .icon-you {
    font-size: 32upx;
    color: $font-color-light;
    margin-right: 30upx;
  }

  .a-bg {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 5upx;
  }
}

.goods-section {
  margin-top: 16upx;
  background: #fff;
  padding-bottom: 1px;

  .g-header {
    display: flex;
    align-items: center;
    height: 84upx;
    padding: 0 30upx;
    position: relative;
  }

  .logo {
    display: block;
    width: 50upx;
    height: 50upx;
    border-radius: 100px;
  }

  .name {
    font-size: 30upx;
    color: $font-color-base;
    margin-left: 24upx;
  }

  .g-item {
    display: flex;
    margin: 20upx 30upx;

    image {
      flex-shrink: 0;
      display: block;
      width: 140upx;
      height: 140upx;
      border-radius: 4upx;
    }

    .right {
      flex: 1;
      padding-left: 24upx;
      overflow: hidden;
    }

    .title {
      font-size: 30upx;
      color: $font-color-dark;
    }

    .spec {
      font-size: 26upx;
      color: $font-color-light;
    }

    .price-box {
      display: flex;
      align-items: center;
      font-size: 32upx;
      color: $font-color-dark;
      padding-top: 10upx;

      .price {
        margin-bottom: 4upx;
      }

      .number {
        font-size: 26upx;
        color: $font-color-base;
        margin-left: 20upx;
      }
    }

    .step-box {
      position: relative;
    }
  }
}

.yt-list {
  margin-top: 16upx;
  background: #fff;
}

.yt-list-cell {
  display: flex;
  align-items: center;
  padding: 10upx 30upx 10upx 40upx;
  line-height: 70upx;
  position: relative;

  &.cell-hover {
    background: #fafafa;
  }

  &.b-b:after {
    left: 30upx;
  }

  .cell-icon {
    height: 32upx;
    width: 32upx;
    font-size: 22upx;
    color: #fff;
    text-align: center;
    line-height: 32upx;
    background: #f85e52;
    border-radius: 4upx;
    margin-right: 12upx;

    &.hb {
      background: #ffaa0e;
    }

    &.lpk {
      background: #3ab54a;
    }
  }

  .cell-more {
    align-self: center;
    font-size: 24upx;
    color: $font-color-light;
    margin-left: 8upx;
    margin-right: -10upx;
  }

  .cell-tit {
    flex: 1;
    font-size: 26upx;
    color: $font-color-light;
    margin-right: 10upx;
  }

  .cell-tip {
    font-size: 26upx;
    color: $font-color-dark;

    &.disabled {
      color: $font-color-light;
    }

    &.active {
      color: $base-color;
    }

    &.red {
      color: $base-color;
    }
  }

  &.desc-cell {
    .cell-tit {
      max-width: 90upx;
    }
  }

  .desc {
    flex: 1;
    font-size: $font-base;
    color: $font-color-dark;
  }
}

/* 支付列表 */
.pay-list {
  padding-left: 40upx;
  margin-top: 16upx;
  background: #fff;

  .pay-item {
    display: flex;
    align-items: center;
    padding-right: 20upx;
    line-height: 1;
    height: 110upx;
    position: relative;
  }

  .icon-weixinzhifu {
    width: 80upx;
    font-size: 40upx;
    color: #6bcc03;
  }

  .icon-alipay {
    width: 80upx;
    font-size: 40upx;
    color: #06b4fd;
  }

  .icon-xuanzhong2 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60upx;
    height: 60upx;
    font-size: 40upx;
    color: $base-color;
  }

  .tit {
    font-size: 32upx;
    color: $font-color-dark;
    flex: 1;
  }
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 995;
  display: flex;
  align-items: center;
  width: 100%;
  height: 90upx;
  justify-content: space-between;
  font-size: 30upx;
  background-color: #fff;
  z-index: 998;
  color: $font-color-base;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);

  .price-content {
    padding-left: 30upx;
  }

  .price-tip {
    color: $base-color;
    margin-left: 8upx;
  }

  .price {
    font-size: 36upx;
    color: $base-color;
  }

  .submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 280upx;
    height: 100%;
    color: #fff;
    font-size: 32upx;
    background-color: #323f6c;
  }
}

.active {
  background-color: #323f6c;
}

/* 优惠券面板 */
.mask {
  display: flex;
  align-items: flex-end;
  position: fixed;
  left: 0;
  top: var(--window-top);
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 9995;
  transition: 0.3s;

  .mask-content {
    width: 100%;
    min-height: 30vh;
    max-height: 70vh;
    background: #f3f3f3;
    transform: translateY(100%);
    transition: 0.3s;
    overflow-y: scroll;
  }

  &.none {
    display: none;
  }

  &.show {
    background: rgba(0, 0, 0, 0.4);

    .mask-content {
      transform: translateY(0);
    }
  }
}

/* 优惠券列表 */
.coupon-item {
  display: flex;
  flex-direction: column;
  margin: 20upx 24upx;
  background: #fff;

  .con {
    display: flex;
    align-items: center;
    position: relative;
    height: 120upx;
    padding: 0 30upx;

    &:after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: "";
      width: 100%;
      height: 0;
      border-bottom: 1px dashed #f3f3f3;
      transform: scaleY(50%);
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    overflow: hidden;
    height: 100upx;
  }

  .title {
    font-size: 32upx;
    color: $font-color-dark;
    margin-bottom: 10upx;
  }

  .time {
    font-size: 24upx;
    color: $font-color-light;
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 26upx;
    color: $font-color-base;
    height: 100upx;
  }

  .price {
    font-size: 44upx;
    color: $base-color;

    &:before {
      content: "￥";
      font-size: 34upx;
    }
  }

  .tips {
    font-size: 24upx;
    color: $font-color-light;
    line-height: 60upx;
    padding-left: 30upx;
  }

  .circle {
    position: absolute;
    left: -6upx;
    bottom: -10upx;
    z-index: 10;
    width: 20upx;
    height: 20upx;
    background: #f3f3f3;
    border-radius: 100px;

    &.r {
      left: auto;
      right: -6upx;
    }
  }
}
</style>
