<template>
  <view>
    <view class="common">
      <view class="common-left">姓名</view>
      <view class="common-right">
        <input
          v-model="uname"
          placeholder="请输入您的真实姓名"
          placeholder-class="placeholder-common"
        />
      </view>
    </view>
    <view class="common">
      <view class="common-left">微信号</view>
      <view class="common-right">
        <input
          v-model="wechatAccount"
          placeholder="请输入您的微信号"
          placeholder-class="placeholder-common"
        />
      </view>
    </view>
	<view class="common">
	  <view class="common-left">支付宝</view>
	  <view class="common-right">
	    <input
	      v-model="aliAccount"
	      placeholder="请输入您的支付宝"
	      placeholder-class="placeholder-common"
	    />
	  </view>
	</view>
    <!-- 上传照片区域 -->
    <view class="updata" @click="updata(1)">
      <view class="updata-box" v-if="!img1">
        <view class="updata-content">
          <img src="../../static/temp/camera.png"></image>
          <view>上传微信收款二维码</view>
        </view>
      </view>
      <img
        class="img"
       v-else
        :src="img1"
      ></img>
    </view>
	<!-- 上传照片区域 -->
	<view class="updata" @click="updata(2)">
	  <view class="updata-box" v-if="!img2">
	    <view class="updata-content">
	      <img src="../../static/temp/camera.png"></img>
	      <view>上传支付宝收款二维码</view>
	    </view>
	  </view>
	  <img
	    class="img"
	    v-else
	    :src="img2"
	  ></image>
	</view>
    <view class="choice">
      <label class="radio">
        <radio value="1" checked="true" />支付协议</label
      >
    </view>
    <view v-if="haveType" class="footer" @click="determine">确定</view>
    <view v-else class="footer" @click="determine">修改</view>
	<view style="width: 100%;height: 40rpx;"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 姓名
      uname: '',
      // 微信号
      weiXinNum: '',
	  aliAccount: '',
	  wechatAccount: '',
      // 显示图片的路径
      img1: '',
	  img2: '',
      // 根据 type 判断是否有数据 从而判断是修改还是增加
      type: '',
      // // 判断是增加还是更新
      // flag: null,
      // 查询到的微信数据
      weiXinObj: '',
      // 根据 查询到的 id 修改数据
      id: '',
      copyImg: '',
      // 判断图片是否上传完成
      flag: '',
	  haveType: true
    };
  },
  onLoad(options) {
    this.type = options.type;
	this.getQuery();
    // 查询银行卡、微信、支付宝
    // if (this.type == 1) {
    // } else {
    //   (this.uname = ''), (this.weiXinNum = ''), (this.img = '');
    // }
  },
  methods: {
    async getQuery() {
		this.id = ''
      let res = await this.$api.api.userPaymentCode();
		if(res.code == '000000'){
			if(res.data?.id){
				this.id = res.data.id
				this.haveType = false
				this.img1 = res.data.wechatCode
				this.uname = res.data.wechatName
				this.wechatAccount = res.data.wechatAccount
				this.img2 = res.data.aliCode
				this.uname = res.data.wechatName
				this.aliAccount = res.data.aliAccount
			}
		}
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
					  if(type == 1){
						  this.img1 = data.data;
						  console.log(this.img)
					  }else if(type == 2){
						  this.img2 = data.data;
						  console.log(this.img2)
					  }
					  this.$api.msg('上传完成', 1500, true, 'none');
				  }else{
					 this.$api.msg(res.msg)
				  }
                this.flag = true;
              }
            },
          });
        },
      });
    },
    modifyCopy() {
      uni.showModal({
        content: '确定修改?',
        success: (res) => {
          if (res.confirm) {
            this.modify();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    // 点击修改微信
    async modify() {
      if (!this.flag) {
        return this.$api.msg('请等图片上传完成');
      }
      if (this.uname == '') {
        return this.$api.msg('请输入姓名');
      }
      if (this.weiXinNum == '') {
        return this.$api.msg('请输入微信号');
      }
      if (this.img == '') {
        return this.$api.msg('请上传微信收款二维码');
      }
      let result = {};
      result = {
        Type: 12,
        // 账号
        Account: this.weiXinNum,
        // 银行名称
        AccountName: '微信',
        // 用户名
        Name: this.uname,
        // 图片路径
        ImgUrl: this.img,
        // 修改的 id
        ID: this.id,
      };
      result = JSON.stringify(result);
      let datas = {
        action: 'UpdatePaymentInformation',
        data: result,
      };
      let res = await this.$api.api.modifyQuery(datas);
      this.$api.msg('修改成功');
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/binding/binding',
        });
      }, 1500);
    },
    // 点击添加微信
    async determine() {
      console.log(this.flag);
      if (this.uname == '') {
        return this.$api.msg('请输入姓名');
      }
      if (!(this.wechatAccount || this.aliAccount)) {
        return this.$api.msg('请输入微信号或者是支付宝账号');
      }
      if (!(this.img1 || this.img2)) {
        return this.$api.msg('请上传微信收款二维码或者支付宝收款二维码');
      }
      let datas = {
		  id: this.id,
		   "wechatCode": this.img1,
		   "wechatName": this.uname,
		   "wechatAccount": this.wechatAccount,
		   "aliCode": this.img2,
		   "aliName": this.uname,
		   "aliAccount": this.aliAccount
      };
      let res = await this.$api.api.saveUserPaymentCode(datas);
	  if(res.code == '000000'){
		  setTimeout(() => {
		   uni.navigateBack()
		  }, 400);
	  }else{
		  this.$api.msg(res.msg)
	  }
    },
    // 清空姓名
    removeUname() {
      this.uname = '';
    },
    // 清空微信号
    removeWeiXinNum() {
      this.weiXinNum = '';
    },
  computed: {
    isUname() {
      if (this.uname == '') {
        return false;
      }
      return true;
    },
    isWeiXinNum() {
      if (this.weiXinNum == '') {
        return false;
      }
      return true;
    },
    isFlag() {
      if (this.type == 1) {
        return false;
      }
      return true;
    },
  },
  }
};
</script>

<style lang="scss">
.common {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  line-height: 60rpx;
  .common-left {
    width: 16%;
  }
  .common-right {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1rpx solid #b8b8b8;
    border-radius: 8rpx;
    padding: 20rpx;
    .placeholder-common {
      font-size: 28rpx;
    }
    input {
      width: 100%;
    }
    image {
      width: 40rpx;
      height: 40rpx;
    }
  }
}
// 上传照片区域
.updata {
  position: relative;
  margin: 20rpx auto;
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
.choice {
  display: flex;
  justify-content: center;
  /deep/.uni-radio-input {
    width: 32rpx;
    height: 32rpx;
  }
}
.footer {
  margin: 40rpx auto;
  width: 190rpx;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
  background-color: #223041;
  border-radius: 16rpx;
}
</style>
