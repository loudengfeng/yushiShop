<template>
	<view>
		<!-- 退款商品列表 -->
		<view class="shopList">
			<view v-for="(item,index) in rzOrderDetailDtos" :key="index">
				<view class="shopInfoBox">
					<view class="shopLeft">
						<image :src="item.webUrl" mode=""></image>
					</view>
					<view class="shopRight">
						<view class="shopTittle">
							{{item.name}}
						</view>
						<view class="shopPrice">
							<text>￥{{item.price}}</text>
							<text>可退数量：{{item.canReturnNum}}</text>
				<!-- 			<text>合计：￥{{data.actualAmount}}</text> -->
						</view>
					</view>
				</view>
				<view class="returnNum">
					<view class="num">退货数量</view>
					<uni-number-box class="step" :min="0" :max="item.canReturnNum" :value="0" :isMax="false" :isMin="true" :index="index"
					 @eventChange="numberChange"></uni-number-box>
				</view>
			</view>
		</view>

		<!--退款理由 -->
		<view class="returnNum">退货理由</view>
		<textarea placeholder-style="color:#808080;font-size:14px;" placeholder="有什么想对商家留言的可以在这里说" v-model="reason" />
		<!-- 占位符 -->
		<view class="cfx"></view>
		<!-- 上传图片 -->
		<view class="returnNum none">上传图片</view>
		<view class="uni-list list-pd">
			<view class="uni-list-cell cell-pd">
				<view class="uni-uploader">
					<view class="uni-uploader-head">
						<view class="uni-uploader-title"></view>
						<view class="uni-uploader-info">{{imageList.length}}/9</view>
					</view>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image,index) in imageList" :key="index">
								<view class="uni-uploader__file" style="position: relative;">
									<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewImage"></image>
									<view class="close-view" @click="close(index)">×</view>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-show="imageList.length < 9">
								<view class="uni-uploader__input" @tap="chooseImage"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 提交 -->
		<view class="sub">
			<!-- <view>需要退 ￥{{allprice}}</view> -->
			<view>退货数量：{{returnNum}}</view>
			<view @click="sub_req"><text>提交申请</text></view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'
	import image from '@/common/js/image.js';
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				rzOrderDetailDtos:[],//当前订单的所有商品
				input_content:'',
				imageList: [],
				returnNum:0,
				reason:'',
				uri:'',
				id:'',
				
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				
				//侧滑返回start
				startX: 0, //点击屏幕起始位置
				movedX: 0, //横向移动的距离
				endX: 0, //接触屏幕后移开时的位置
				//end
				
				token : '',
				rzReturnGoodsId:null//退款记录主表的id，上传完基本信息的时候回传到前端；上传图片数据的时候需要用到
			}
		},
		onLoad(option) {
			this.getReturnDetail(option.id)
			this.id= option.id
			this.token = uni.getStorageSync('userInfo')['token']
		},
		onUnload() {
				this.imageList = [],
					this.sourceTypeIndex = 2,
					this.sourceType = ['拍照', '相册', '拍照或相册'],
					this.sizeTypeIndex = 2,
					this.sizeType = ['压缩', '原图', '压缩或原图'],
					this.countIndex = 8;
			},
			
			methods: {
				// 退单详情
				async getReturnDetail(id){
					let token = uni.getStorageSync("userInfo")['token']
					let req = {
						token:token,
						orderMainId:id
					}
					let res = await this.$api.api.cannReturnOrderInfo(req)
					if (res.data.code == this.$status.req_suc) {
						res.data.data.forEach((item,index) => {
							item.webUrl = this.$config.domain.file + item.webUrl.replace('.', '_s.')
						})
						this.rzOrderDetailDtos = res.data.data
						console.log(this.rzOrderDetailDtos)
						
					}
				},
				//数量
				async numberChange(e) {
					this.rzOrderDetailDtos[e.index]['returnNum'] = e.number
					var returnNum = 0;
					for(var i in this.rzOrderDetailDtos){
						var obj = this.rzOrderDetailDtos[i];
						if(obj.returnNum > 0){
							returnNum += obj.returnNum
						}
					}
					this.returnNum = returnNum
				},
				async sub_req(){
					
					uni.showLoading({title:'保存中...'});
					
					var req = {
						token: this.token,
						reason:this.reason,
						orderMainId:this.id
					}
					var applyDetailDtos = [];
					for(var i in this.rzOrderDetailDtos){
						var obj = this.rzOrderDetailDtos[i];
						if(typeof obj.returnNum != 'undefined' && obj.returnNum > 0){
							var dto = {
								orderDetailId : obj.id,
								num : obj.returnNum
							}
							applyDetailDtos.push(dto)
						}
					}
					if(applyDetailDtos.length <= 0){
						uni.showToast({
							icon : 'none',
							title: '请选择要退货的商品'
						})
						return
					}
					req.applyDetailDtos = applyDetailDtos
					console.log(req)
					let res = await this.$api.api.applyReturn(req)
					if(res.data.code = this.$status.req_suc){
						var data = res.data.data
						//退款记录主表的id，用于回传图片是否锁定记录
						this.rzReturnGoodsId = data.rzReturnGoodsId;
						if(this.imageList.length > 0){
							this.uploadFile(0)
						}else{
							uni.showToast({
								title:'保存成功'
							})
							uni.hideLoading();
						}
					}
				},
				
				uploadFile(idx){
					var that = this;
					var imageList = that.imageList;
						var url = that.$config.domain.api + that.$config.url.returnGoods.uploadMainInfo;
						var image = imageList[idx];
						uni.uploadFile({
							url: url, 
							filePath: image,
							name: "file",
							formData: {//后台以post方式接收
								token: that.token,
								rzReturnGoodsId : that.rzReturnGoodsId,
								type:"refund_goods"
							},
							success: (res) => {
								console.log(res)
								if(idx+1 == imageList.length){
									//如果是最后一张图片，提醒用户保存成功，结束递归
									uni.showToast({
										title:'保存成功'
									})
									setTimeout(() => {
										uni.navigateBack({
											delta:2
										})
									},600)
									uni.hideLoading();
								}else{
									let num = idx +1
									that.uploadFile(num);
								}
							},
							fail: (e) => {
								/* console.log("e: " + JSON.stringify(e));
								uni.hideLoading();
								uni.showToast({
									icon:'none',
									title:"发布失败,请检查网络"
								}) */
							},
							complete:((res) => {
								console.log(res)
							})
						});
				},
				
				close(e){
				    this.imageList.splice(e,1);
				},
				chooseImage: async function() {
					if (this.imageList.length === 9) {
						let isContinue = await this.isFullImg();
						console.log("是否继续?", isContinue);
						if (!isContinue) {
							return;
						}
					}
					uni.chooseImage({
						sourceType: sourceType[this.sourceTypeIndex],
						sizeType: sizeType[this.sizeTypeIndex],
						count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
						success: (res) => {
		
							// #ifdef APP-PLUS
							//提交压缩,因为使用了H5+ Api,所以自定义压缩目前仅支持APP平台
							var compressd = cp_images=> {
								this.imageList = this.imageList.concat(cp_images)//压缩后的图片路径
							}
							image.compress(res.tempFilePaths,compressd);
							// #endif
							
							// #ifndef APP-PLUS
							this.imageList = this.imageList.concat(res.tempFilePaths)//非APP平台不支持自定义压缩,暂时没有处理,可通过uni-app上传组件的sizeType属性压缩
							// #endif
							
						}
					})
				},
				isFullImg: function() {
					return new Promise((res) => {
						uni.showModal({
							content: "已经有9张图片了,是否清空现有图片？",
							success: (e) => {
								if (e.confirm) {
									this.imageList = [];
									res(true);
								} else {
									res(false)
								}
							},
							fail: () => {
								res(false)
							}
						})
					})
				},
				previewImage: function(e) {
					var current = e.target.dataset.src
					uni.previewImage({
						current: current,
						urls: this.imageList
					})
				},
				touchStart: function(e) {
					this.startX = e.mp.changedTouches[0].pageX;
				},
				
				touchEnd: function(e) {
					this.endX = e.mp.changedTouches[0].pageX;
					if (this.endX - this.startX > 200) {
						uni.navigateBack();
					}
				}
			}
		}
</script>

<style>
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('https://img-cdn-qiniu.dcloud.net.cn/fonts/uni.ttf') format('truetype');
	}
	.cfx{
		height: 10rpx;
		width: 100%;
		background-color: #F0F0F0;
		margin-top: 40rpx;
	}
	.shopInfoBox {
		width: 678rpx;
		margin: 10rpx auto 10rpx;
	}

	.shopLeft {
		width: 175rpx;
		height: 146rpx;
		float: left;
	}

	.shopLeft image {
		height: 100%;
		width: 100%;
	}

	.shopRight {
		height: 146rpx;
		margin-left: 203rpx;
		position: relative;
	}

	.shopTittle {
		font-size: 26rpx;
		color: #333333;
		line-height: 37rpx;
	}

	.shop view:nth-child(1) {
		float: left;
	}

	.shop view:nth-child(2) {
		float: right;
	}

	.shopPrice {
		font-size: 32rpx;
		color: #F90F61;
		position: absolute;
		bottom: 0rpx;
	}

	.shopPrice text:nth-child(2),
	.shopPrice text:nth-child(3) {
		font-size: 24rpx;
		color: #333333;
		margin-left: 80rpx;
	}

	.shopPrice text:nth-child(3) {
		margin-left: 30rpx;
	}
	.returnNum{
		width: 678rpx;
		height: 88rpx;
		margin: 0 auto;
		line-height: 88rpx;
		font-size: 30rpx;
		color: #333333;
		border-bottom: 1rpx solid #EEEEEE;
		position: relative;
		font-weight: 400;
	}
	.returnNum .num{
		position: absolute;
		top: 10rpx;
	}
	.step{
		position: absolute;
		right: 260rpx;
		top: 68rpx;
	}
	textarea{
		background: #F2F2F2;
		width: 700rpx;
		height: 198rpx;
		margin: 0 auto;
		padding: 23rpx 40rpx;
	}
	.none{
		border: none;
	}
	/* 上传图片 */
		.cell-pd {
		padding: 20upx 30upx;
	}
	
	.uni-textarea {
		width: auto;
		padding: 20upx 25upx;
		line-height: 1.6;
		height: 150upx;
	}
	.uni-list::before {
		height: 0;
	}
	.uni-list:after {
		height: 0;
	}
	.list-pd {
		margin-top: 0;
	}
	.close-view{
	    text-align: center;
		line-height:30upx;
		height: 35upx;
		width: 35upx;
		background: #ef5350;
		color: #FFFFFF;
		position: absolute;
		top: 1upx;
		right: 1upx;
		font-size: 35upx;
		border-radius: 8upx;
	}
	.sub{
		width: 678rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		color: #333333;
		margin: 30rpx auto;
		display: flex;
		border-top: 1rpx solid #EEEEEE;
		padding-top: 30rpx;
	}
	.sub view{
		flex: 1;
		text-align: center;
	}
	.sub view text{
		padding: 13rpx 32rpx;
		background-color: #38A437;
		color: #FFFFFF;
		font-size: 24rpx;
		border-radius: 50rpx;
	}
</style>
