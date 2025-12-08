<template>
  <view>
    <view class="common">
      <view class="common-left">收款姓名</view>
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
      <view class="common-left">支付宝账号</view>
      <view class="common-right">
        <input
          v-model="zhiFuBaoNum"
          placeholder="请输入您的支付宝账号"
          placeholder-class="placeholder-common"
        />
        <image
          src="/static/delete.png"
          v-if="isWeiXinNum"
          @click="removeZhiFuBaoNum"
        ></image>
      </view>
    </view>
    <!-- 上传照片区域 -->
    <view class="updata" @click="updata">
      <view class="updata-box" v-if="copyImg == '' ? true : false">
        <view class="updata-content">
          <image src="../../static/temp/camera.png"></image>
          <view>上传支付宝收款二维码</view>
        </view>
      </view>
      <image class="img" v-else :src="copyImg"></image>
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
      copyImg: '',
      // 姓名
      uname: '',
      // 支付宝账号
      zhiFuBaoNum: '',
      // 显示图片的路径
      img: '',
      // 根据 type 判断是否有数据 从而判断是修改还是增加
      type: '',
      // // 判断是增加还是更新
      // flag: null,
      // 查询到的支付宝数据
      zhiFuBaoObj: '',
      // 根据 查询到的 id 修改数据
      id: '',
      // 判断图片是否上传完成
      flag: '',
    };
  },
  onLoad(options) {
    this.type = options.type;
    //  查询银行卡、微信、支付宝
    if (this.type == 1) {
      this.getQuery();
    } else {
      (this.uname = ''), (this.zhiFuBaoNum = '');
      this.img = '';
    }
  },
  methods: {
    modifyCopy() {
      uni.showModal({
        content: '确定修改',
        success: (res) => {
          if (res.confirm) {
            this.modify();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    // 点击修改数据
    async modify() {
      if (!this.flag) {
        return this.$api.msg('请等图片上传完成');
      }
      if (this.uname == '') {
        return this.$api.msg('请输入姓名');
      }
      if (this.zhiFuBaoNum == '') {
        return this.$api.msg('请输入支付宝账号');
      }
      if (this.img == '') {
        return this.$api.msg('请上传支付宝收款二维码');
      }
      let result = {
        Type: 11,
        // 账号
        Account: this.zhiFuBaoNum,
        // 银行名称
        AccountName: '支付宝',
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
      if (res.data.status == true) {
        this.$api.msg('修改成功');
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/binding/binding',
          });
        }, 1500);
      }
    },
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
          if (list[i].Type == 11) {
            this.zhiFuBaoObj = list[i];
          }
        }
        this.uname = this.zhiFuBaoObj.Name;
        this.zhiFuBaoNum = this.zhiFuBaoObj.Account;
        this.img = this.zhiFuBaoObj.ImgUrl;
        this.id = this.zhiFuBaoObj.ID;
        this.copyImg = this.zhiFuBaoObj.ImgUrl;
      }
    },
    // 点击上传照片
    updata() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.copyImg = res.tempFiles[0].path;
          uni.uploadFile({
            url: this.$config.domain.api + 'API/Files.ashx',
            filePath: res.tempFiles[0].path,
            name: 'file',
            formData: {
              action: 'VoucherUpload',
              dlogo: true,
            },
            success: (res) => {
              if (res.errMsg == 'uploadFile:ok') {
                this.img = this.$config.domain.api + res.data;
                this.flag = true;
                this.$api.msg('上传完成', 1500, true, 'none');
              } else {
                this.$api.msg('上传失败 请重新上传');
              }
            },
          });
        },
      });
    },
    // uploadFile() {
    //   uni.uploadFile({
    //     url: this.$config.domain.api + 'API/Files.ashx',
    //     filePath: this.img,
    //     name: 'file',
    //     formData: {
    //       action: 'VoucherUpload',
    //       dlogo: true
    //     },
    //     success: res => {
    //       if (res.errMsg == "uploadFile:ok") {
    //         this.img = this.$config.domain.api + res.data
    //       } else {
    //         this.$api.msg('上传失败 请重新上传')
    //       }
    //     }
    //   })
    // },
    // 点击发送
    async determine() {
      if (!this.flag) {
        return this.$api.msg('请等图片上传完成');
      }
      if (this.uname == '') {
        return this.$api.msg('请输入姓名');
      }
      if (this.zhiFuBaoNum == '') {
        return this.$api.msg('请输入支付宝账号');
      }
      if (this.img == '') {
        return this.$api.msg('请上传支付宝收款二维码');
      }
      let result = {};
      result = {
        Type: 11,
        // 账号
        Account: this.zhiFuBaoNum,
        // 银行名称
        AccountName: '支付宝',
        // 用户名
        Name: this.uname,
        // 图片路径
        ImgUrl: this.img,
      };
      result = JSON.stringify(result);
      let datas = {
        action: 'CreatePaymentInformation',
        data: result,
      };
      let res = await this.$api.api.addTo(datas);
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
          }, 900);
        }
      }
    },
    // 清空姓名
    removeUname() {
      this.uname = '';
    },
    // 支付宝账号
    removeZhiFuBaoNum() {
      this.zhiFuBaoNum = '';
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
      if (this.zhiFuBaoNum == '') {
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
    width: 24%;
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
  padding: 4rpx;
  border: 1rpx dashed #6c7aa7;
  .img {
    width: 100%;
    height: 100%;
  }
  .updata-box {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .updata-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      > view {
        width: 100%;
        text-align: center;
      }
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
