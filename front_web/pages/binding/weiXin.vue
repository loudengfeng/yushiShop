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
        <image
          src="/static/delete.png"
          v-if="isUname"
          @click="removeUname"
        ></image>
      </view>
    </view>
    <view class="common">
      <view class="common-left">微信号</view>
      <view class="common-right">
        <input
          v-model="weiXinNum"
          placeholder="请输入您的微信号"
          placeholder-class="placeholder-common"
        />
        <image
          src="/static/delete.png"
          v-if="isWeiXinNum"
          @click="removeWeiXinNum"
        ></image>
      </view>
    </view>
    <!-- 上传照片区域 -->
    <view class="updata" @click="updata">
      <view class="updata-box" v-if="copyImg == '' ? true : false">
        <view class="updata-content">
          <image src="../../static/temp/camera.png"></image>
          <view>上传微信收款二维码</view>
        </view>
      </view>
      <image
        class="img"
        v-if="copyImg == '' ? false : true"
        :src="copyImg"
      ></image>
    </view>
    <view class="choice">
      <label class="radio">
        <radio value="1" checked="true" />支付协议</label
      >
    </view>
    <view v-if="isFlag" class="footer" @click="determine">确定</view>
    <view v-else class="footer" @click="modifyCopy">修改</view>
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
      // 显示图片的路径
      img: '',
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
    };
  },
  onLoad(options) {
    this.type = options.type;
    // 查询银行卡、微信、支付宝
    if (this.type == 1) {
      this.getQuery();
    } else {
      (this.uname = ''), (this.weiXinNum = ''), (this.img = '');
    }
  },
  methods: {
    // 查询银行卡、微信、支付宝
    async getQuery() {
      let result = {};
      result = JSON.stringify(result);
      let datas = {
        action: 'ReadPaymentInformation',
        data: result,
      };
      let res = await this.$api.api.query(datas);
      if (res.data.status == true) {
        var list = res.data.data;
        for (var i = 0; i < list.length; i++) {
          if (list[i].Type == 12) {
            this.weiXinObj = list[i];
          }
        }
        this.uname = this.weiXinObj.Name;
        this.weiXinNum = this.weiXinObj.Account;
        this.img = this.weiXinObj.ImgUrl;
        this.id = this.weiXinObj.ID;
        this.copyImg = this.weiXinObj.ImgUrl;
      }
    },
    // 点击上传照片
    updata() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.copyImg = res.tempFiles[0].path;
          let uploadTask = uni.uploadFile({
            url: this.$config.domain.api + 'API/Files.ashx',
            filePath: res.tempFiles[0].path,
            name: 'file',
            formData: {
              action: 'VoucherUpload',
              dlogo: true,
            },
            success: (res) => {
              console.log(res);
              if (res.errMsg == 'uploadFile:ok') {
                this.img = this.$config.domain.api + res.data;
                this.$api.msg('上传完成', 1500, true, 'none');
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
      };
      result = JSON.stringify(result);
      let datas = {
		   "wechatCode": "https://pics4.baidu.com/feed/6159252dd42a2834c0d1a2e21194bde514cebf91.png",
		   "wechatName": "朱",
		   "wechatAccount": "1357892223",
		   "aliCode": "https://pics4.baidu.com/feed/6159252dd42a2834c0d1a2e21194bde514cebf91.png",
		   "aliName": "zhu",
		   "aliAccount": "9752272252525"
      };
      let res = await this.$api.api.saveUserPaymentCode(datas);
      if (res.data.status == true) {
        this.$api.msg('添加成功');
        var info = uni.getStorageSync('info');
        if (info) {
          if (info == 1) {
            uni.removeStorage('info');
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/integralPages/OTCBusiness/index',
              });
            }, 900);
          } else {
            uni.removeStorage('info');
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/FishCurrency/transaction/transaction',
              });
            }, 900);
          }
        } else {
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/binding/binding',
            });
          }, 1500);
        }
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
      > image {
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
