<template>
  <view class="appeal-box">
    <view class="order-list">
      <view class="left">{{detail.buyName}}：</view>
      <view class="right">
        {{ detail.BuyerUserId }}
      </view>
    </view>
    <view class="order-list">
      <view class="left">{{detail.sellName}}：</view>
      <view class="right">
        {{ detail.SellerUserId }}
      </view>
    </view>
    <view class="order-list">
      <view class="left">订单号：</view>
      <view class="right">
        {{ detail.FishRecordId }}
      </view>
    </view>
    <view class="order-list">
      <view class="left">时间：</view>
      <view class="right">
        {{ detail.CreateDate }}
      </view>
    </view>
    <view class="order-list">
      <view class="left">单价(CNY/FC)：</view>
      <view class="right">
        {{ detail.FishPrice }}
      </view>
    </view>
    <view class="order-list">
      <view class="left">总金额(CNY)：</view>
      <view class="right">
        {{ detail.Balance }}
      </view>
    </view>
    <view class="order-list">
      <view class="left">总数量(FC)：</view>
      <view class="right">
        {{ detail.FishNumber }}
      </view>
    </view>
    <view class="order-list"
          v-if="pp">
      <view class="left">对方申诉理由：</view>
      <view class="right">
        {{ detail.AppealReason }}
      </view>
    </view>
    <view style="margin-top: 30rpx; color: #223041; font-size: 28rpx;"
          v-if="pp">应诉理由：</view>
    <view style="margin-top: 30rpx; color: #223041; font-size: 28rpx;"
          v-else>申诉理由：</view>
    <textarea class="evaluate-text"
              :maxlength="100"
              v-model="evaluateText"
              placeholder="请输入理由"></textarea>
    <!-- 照片区域 -->
    <view class="photo-box">
      <view class="photo-total">{{ imgList.length }}/1</view>
      <!-- 预览的照片区域 -->
      <view class="preview">
        <view class="preview-list"
              v-for="(item, index) in imgList"
              :key="index">
          <image class="preview-img"
                 :src="item"></image>
          <image class="del-img"
                 @click="removeImg(index)"
                 src="/static/delete.png"></image>
        </view>
        <view class="upload-img"
              @click="upload">
          <image src="/static/temp/camera.png"></image>
          <view>上传图片</view>
        </view>
      </view>
    </view>
    <view class="submit-box"
          @click="submit">
      <view class="submit">提交</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imgList: [],
      // 最多上传的图片张数
      imgCount: 1,
      // 发布评论上传的照片
      evaluateImgUrlList: [],
      evaluateText: '',
      sellInfo: '',
      detail: '',
      id: '',
      evaluateImgUrlList: '',
      pp: ''
    };
  },
  onLoad(option) {
    this.pp = option.pp
    if (this.pp) {
      uni.setNavigationBarTitle({
        title: '应诉'
      });
    }
    this.id = option.id;
    this.getData(option.id);
  },
  methods: {
    async getData(id) {
      let data = {
        FishRecordId: id,
      };
      let StringData = JSON.stringify(data);
      let param = {
        action: 'ReadFishOrderRecord',
        data: StringData,
      };
      let res = await this.$api.api.getFish(param);
      if (res.data.status == true) {
        res.data.data[0].FishPrice = Number(res.data.data[0].FishPrice).toFixed(
          2
        );
        res.data.data[0].FishNumber = Number(
          res.data.data[0].FishNumber
        ).toFixed(2);
        res.data.data[0].Balance = Number(res.data.data[0].Balance).toFixed(2);
        this.detail = res.data.data[0];
        this.detail.sellName = this.detail.SellerUserId.TransactionType ? "卖家ID" : "买家ID"
        this.detail.buyName = this.detail.SellerUserId.TransactionType ? "买家ID" : "卖家ID"
        this.sellInfo = res.data.sellerPayInformation[0];
      }
    },
    async submit() {
      if (this.evaluateText == '') return this.$api.msg('请输入申诉理由');
      if (this.imgList.length == 0) return this.$api.msg('请上传图片');

      let data = {
        FishRecordId: this.id,
        AppealReason: this.evaluateText,
        AppealProof: this.evaluateImgUrlList,
      };
      let StringData = JSON.stringify(data);
      let param = {
        data: StringData,
        action: 'AppealFishRecord',
      };
      let res = await this.$api.api.getFish(param);
      console.log(res.data.status);
      if (res.data.status == true) {
        this.$api.msg('提交成功');
        if(this.pp){
			setTimeout(() => {
			  uni.navigateBack({
			    delta: 1,
			  });
			}, 800);
		}else{
			setTimeout(() => {
			  uni.navigateBack({
			    delta: 2,
			  });
			}, 800);
		}
      } else {
        this.$api.msg(res.data.message);
      }

      // let userId = uni.getStorageSync('UserId');
      // if (this.detail.SellerUserId == userId) {
      //   if (!this.detail.TransactionType) {
      //     let data = {
      //       FishRecordId: this.id,
      //       AppealReason: this.evaluateText,
      //       AppealProof: this.evaluateImgUrlList,
      //     };
      //     let StringData = JSON.stringify(data);
      //     let param = {
      //       data: StringData,
      //       action: 'AppealFishRecord',
      //     };
      //     let res = await this.$api.api.getFish(param);
      //     console.log(res.data.status);
      //     if (res.data.status == true) {
      //       this.$api.msg('提交成功');
      //       setTimeout(() => {
      //         uni.navigateBack({
      //           delta: 2,
      //         });
      //       }, 800);
      //     } else {
      //       this.$api.msg(res.data.message);
      //     }
      //   }
      // } else if (this.detail.BuyerUserId == userId) {
      //   if (this.detail.TransactionType) {
      //     let data = {
      //       FishRecordId: this.id,
      //       AppealReason: this.evaluateText,
      //       AppealProof: this.evaluateImgUrlList,
      //     };
      //     let StringData = JSON.stringify(data);
      //     let param = {
      //       data: StringData,
      //       action: 'PleaFishRecord',
      //     };
      //     let res = await this.$api.api.getFish(param);
      //     console.log(res.data.status);
      //     if (res.data.status == true) {
      //       this.$api.msg('提交成功');
      //       setTimeout(() => {
      //         uni.navigateBack({
      //           delta: 2,
      //         });
      //       }, 800);
      //     } else {
      //       this.$api.msg(res.data.message);
      //     }
      //   }
      // }
    },
    // 上传照片
    upload() {
      if (this.imgCount > 1) {
        return this.$api.msg('只能上传一张');
      }
      uni.chooseImage({
        count: this.imgCount,
        success: (res) => {
          let img = res.tempFilePaths[0];
          this.imgList.push(img);
          this.imgCount++;
          this.updataImg();
        },
      });
    },
    removeImg(index) {
      this.imgList = [];
      this.imgCount = 1;
    },
    // 上传照片
    updataImg() {
      uni.showLoading({
        title: '上传图片',
        mask: true,
      });
      // 上传图片
      uni.uploadFile({
        url: this.$config.domain.api + 'API/Files.ashx',
        filePath: this.imgList[0],
        name: 'file',
        formData: {
          action: 'VoucherUpload',
          dlogo: true,
        },
        success: (res) => {
          console.log(res);
          if (res.errMsg == 'uploadFile:ok') {
            uni.hideLoading();
            var imgUrl = this.$config.domain.api + res.data;
            this.evaluateImgUrlList = imgUrl;
            this.$api.msg('上传成功');
          }
        },
      });
    },
  },
};
</script>

<style lang="scss">
.appeal-box {
  padding: 30rpx 3%;
  .order-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 28rpx;
    height: 80rpx;

    .left {
      color: #223041;
    }

    .right {
      color: #5e5e5e;
      display: flex;
      align-items: center;

      text {
        margin-left: 15rpx;
        margin-right: 15rpx;
      }
    }
  }
  .evaluate-text {
    margin-top: 30rpx;
    width: 100%;
    height: 200rpx;
    border: 1rpx solid #f0f0f0;
    border-radius: 20rpx;
    padding: 20rpx;
    box-sizing: border-box;
    font-size: 28rpx;
  }
  // 照片区域
  .photo-box {
    margin-top: 20rpx;
    .photo-total {
      text-align: right;
      // margin: 20rpx 0;
    }
    .preview {
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      .preview-list {
        position: relative;
        .preview-img {
          margin: 0 20rpx;
          width: 180rpx;
          height: 180rpx;
        }
        .del-img {
          position: absolute;
          top: -16rpx;
          right: 1rpx;
          width: 40rpx;
          height: 40rpx;
        }
      }
      .upload-img {
        margin: 0 20rpx;
        width: 180rpx;
        height: 180rpx;
        border: 1rpx dashed #98a76c;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        > image {
          width: 60rpx;
          height: 46rpx;
          margin-bottom: 10rpx;
        }
      }
    }
  }
  .submit-box {
    width: 100%;
    position: relative;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    height: 72rpx;
  }
  .submit {
    position: absolute;
    right: 20rpx;
    width: 216rpx;
    height: 72rpx;
    border-radius: 36rpx;
    background-color: #c34554;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 30rpx;
  }
}
</style>
