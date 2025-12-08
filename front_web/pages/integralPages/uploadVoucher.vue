<template>
  <view>
    <!-- 上传照片区域 -->
    <view class="updata" @click="updata">
      <view class="updata-box">
        <view class="updata-content" v-if="!img">
          <image src="../../static/temp/camera.png"></image>
          <view>上传转账的凭证照片</view>
        </view>
        <view v-else class="img1">
          <image :src="img"></image>
        </view>
      </view>
    </view>
    <view class="common">
      <view class="common-left">金额</view>
      <view class="common-right">
        <input
          v-model="price"
          type="number"
          placeholder="请输入充值金额"
          placeholder-class="placeholder-common"
        />
      </view>
    </view>
    <view class="common">
      <view class="common-left">备注</view>
      <view class="common-right">
        <input
          v-model="bz"
          placeholder="请输入备注"
          placeholder-class="placeholder-common"
        />
      </view>
    </view>
    <!-- 支付方式 -->
    <view class="payWay">
      <text
        v-for="(item, index) in payWay"
        :key="index"
        :class="item.checked ? 'chose' : ''"
        @click="choose(index)"
        >{{ item.name }}</text
      >
    </view>
    <view class="submit" @click="submit">确认上传</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      img: '',
      price: '',
      bz: '',
      payWay: [
        {
          id: 11,
          name: '支付宝',
          checked: true,
          type: 11,
        },
        {
          id: 12,
          name: '微信',
          checked: false,
          type: 12,
        },
        {
          id: 10,
          name: '银联支付',
          checked: false,
          type: 10,
        },
      ],
      payLists: [],
      payId: [],
      flag: '',
    };
  },
  onLoad() {
    this.getPayWay();
  },
  methods: {
    // 查询绑定银行卡 支付宝 微信
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
        console.log(this.payLists);
        this.choose(0);
      }
    },
    choose(index) {
      this.payId = [];
      console.log(this.payLists);
      this.payLists.forEach((item, index) => {
        if (item.Type) {
          this.payId.push(item.Type);
        }
      });
      var obj = {};
      this.payId.forEach((item, index) => {
        obj[item] = item;
      });
      // console.log(obj)
      let pp = this.payWay[index].type;
      // console.log(obj)
      if (obj[pp] == undefined) {
        uni.showModal({
          title: '提示',
          content: '请去绑定',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/binding/binding',
              });
            } else if (res.cancel) {
              // uni.navigateTo({
              //   url: '/pages/integralPages/offlineTransaction'
              // })
            }
          },
        });
        return;
      }
      for (var i in this.payWay) {
        var obj = this.payWay[i];
        obj.checked = index == i;
      }
    },
    updata() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.img = res.tempFiles[0].path;
          console.log(this.img);
          uni.uploadFile({
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
                this.$api.msg('上传成功');
                this.img = this.$config.domain.api + res.data;
                this.flag = true;
              }
            },
          });
        },
      });
    },
    submit() {
      let pay = '';
      for (var i in this.payWay) {
        var obj = this.payWay[i];
        if (obj.checked) {
          pay = obj.id;
          this.choose(i);
        }
      }
      if (!this.img) {
        this.$api.msg('请上传支付凭证图片');
        return;
      }
      if (!this.flag) {
        return this.$api.msg('请等图片上传完成');
      }
      if (!this.price) {
        this.$api.msg('金额不能为空');
        return;
      }
      let da = {
        Balance: this.price,
        PayWay: pay,
        Remark: this.bz,
        Proof: this.img,
      };
      let cc = JSON.stringify(da);
      let param = {
        action: 'SubmitRecharge',
        data: cc,
      };
      // console.log(this.$api.api)
      this.$api.api.SubmitRecharge(param).then((res) => {
        if (res.data.status == true) {
          this.$api.msg('提交成功');
          setTimeout(function () {
            uni.navigateBack({
              delta: 2,
            });
          }, 800);
        } else {
          this.$api.msg(res.data.message);
        }
      });
    },
  },
};
</script>

<style lang="scss">
// 上传照片区域
.img1 {
  width: 558rpx;
  height: 294rpx;
  image {
    height: 100%;
    width: 100%;
  }
}
.payWay {
  display: flex;
  justify-content: start;
  padding-left: 30rpx;
  margin-top: 50rpx;
  text {
    display: block;
    height: 60rpx;
    width: 135rpx;
    border-radius: 10rpx;
    line-height: 60rpx;
    text-align: center;
    border: 1rpx solid #eeeeee;
    margin-right: 20rpx;
  }
}
.chose {
  background-color: #223041;
  color: #ffffff;
}
.common {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  line-height: 60rpx;
  .common-left {
    margin-right: 10rpx;
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
      font-size: 26rpx;
    }
    image {
      width: 40rpx;
      height: 40rpx;
    }
  }
}
.updata {
  position: relative;
  margin: 100rpx auto 40rpx;
  width: 558rpx;
  height: 294rpx;
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
        width: 140rpx;
        height: 100rpx;
      }
    }
  }
}
.submit {
  height: 69rpx;
  width: 191rpx;
  background-color: #223041;
  border-radius: 8rpx;
  text-align: center;
  line-height: 69rpx;
  color: #ffffff;
  font-size: 28rpx;
  margin: 100rpx auto 0;
}
</style>
