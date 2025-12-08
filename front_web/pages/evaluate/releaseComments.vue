<template>
  <view class="box">
    <!-- 头部商品详情区域 -->
    <view class="box-title">
      <view class="title-left">
        <image :src="ThumbnailsUrl"></image>
      </view>
      <view class="title-right">
        <view class="right-shopName">{{ ItemDescription }}</view>
        <view class="right-details">{{ AttributesValue }}</view>
      </view>
    </view>
    <!-- 商品评价区域 -->
    <view class="evaluate">商品评价</view>
    <!-- 好中评区域 -->
    <view class="content">
      <radio-group @change="contentChange"
                   class="content-group">
        <label v-for="(item, index) in evaluate"
               :key="index">
          <radio :value="item.id"
                 color="#fa436a"
                 :checked="current == item.id" />
          <text :class="current == item.id ? 'active' : ''">{{
            item.text
          }}</text>
        </label>
      </radio-group>
    </view>
    <textarea class="evaluate-text"
              :maxlength="100"
              v-model="evaluateText"
              placeholder="请输入您的评价(不超过一百个字)"></textarea>
    <!-- 照片区域 -->
    <view class="photo-box">
      <view class="photo-total">{{ evaluateImgUrlList.length }}/9</view>
      <!-- 预览的照片区域 -->
      <view class="preview">
        <view class="preview-list"
              v-for="(item, index) in evaluateImgUrlList"
              :key="index">
          <image class="preview-img"
                 :src="item"></image>
          <image class="del-img"
                 @click="removeImg(index)"
                 src="../../static/delete.png"></image>
        </view>
        <view class="upload-img"
              @click="upload">
          <image src="../../static/temp/camera.png"></image>
          <view>上传买家秀</view>
        </view>
      </view>
    </view>
    <view class="release"
          @click="releaseImg">发布</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 最多上传的图片张数
      imgCount: 9,
      // 上传的图片数组
      imgList: [],
      // 评价绑定的内容
      evaluateText: '',
      // 好评的选择内容
      evaluate: [
        {
          id: '3',
          text: '好评',
        },
        {
          id: '2',
          text: '中评',
        },
        {
          id: '1',
          text: '差评',
        },
      ],
      // 默认好评的选中项
      current: 3,
      // 商品信息
      details: '',
      // 详细 id
      OrderItemsID: '',
      // 商品的图片
      ThumbnailsUrl: '',
      // 商品的名称
      ItemDescription: '',
      // 详细规格
      AttributesValue: '',
      // 发布评论上传的照片
      evaluateImgUrlList: [],
      // 商品的 id
      ProductId: '',
    };
  },
  onLoad(options) {
    // console.log(JSON.parse(options.itemGood));
    this.OrderItemsID = JSON.parse(options.itemGood).ID;
    this.ThumbnailsUrl =
      this.$config.domain.api + JSON.parse(options.itemGood).ImgUrl;
    this.ItemDescription = JSON.parse(options.itemGood).ItemDescription;
    this.AttributesValue = JSON.parse(options.itemGood).AttributesValue;
    this.ProductId = JSON.parse(options.itemGood).ProductId;
  },
  methods: {
    // 上传照片
    upload() {
      if (this.imgCount < 0) {
        return this.$api.msg('最多上传九张');
      }
      uni.chooseImage({
        count: 1,
        success: (res) => {
          uni.showLoading({
            title: '上传图片',
            mask: true,
          });
          console.log(res)
          uni.uploadFile({
            url: this.$config.domain.api + 'API/Files.ashx',
            filePath: res.tempFiles[0].path,
            name: 'file',
            formData: {
              action: 'VoucherUpload',
              dlogo: true,
            },
            success: res => {
              var imgUrl = this.$config.domain.api + res.data;
              this.evaluateImgUrlList.push(imgUrl);
              this.imgList.push(imgUrl)
              // uni.hideLoading();
              this.$api.msg('上传成功');
              this.imgCount = 8 - this.evaluateImgUrlList.length;
            }
          })
        },
      });
    },
    // 点击发布
    releaseImg() {
      this.submitData = null;
      if (this.evaluateText == '') {
        this.$api.msg('请输入评价内容');
        return false;
      }
      this.updataText();
    },
    // 上传评论内容
    async updataText() {
      let data = {
        action: 'EvaluateOrder',
        Evaluation: this.evaluateText,
        OrderItemsID: this.OrderItemsID,
        Score: this.current,
        ImgUrlList: this.evaluateImgUrlList,
      };
      let res = await this.$api.api.evaluate(data);
      // console.log(res);
      if (res.data.status == true) {
        this.$api.msg('发布成功');
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/evaluate/evaluateResult?ProductId=' + this.ProductId,
          });
        }, 1500);
      }
    },
    // 上传照片
    // updataImg() {
    //   uni.showLoading({
    //     title: '上传图片',
    //     mask: true,
    //   });
    //   for (let i = 0; i < this.imgList.length; i++) {
    //     // 上传图片
    //     uni.uploadFile({
    //       url: this.$config.domain.api + 'API/Files.ashx',
    //       filePath: this.imgList[i].path,
    //       name: 'file',
    //       formData: {
    //         action: 'VoucherUpload',
    //         dlogo: true,
    //       },
    //       success: (res) => {
    //         console.log(res);
    //         if (res.errMsg == 'uploadFile:ok') {
    //           uni.hideLoading();
    //           var imgUrl = this.$config.domain.api + res.data;
    //           this.evaluateImgUrlList.push(imgUrl);
    //           this.$api.msg('上传成功');
    //           // setTimeout(() => {
    //           //   uni.switchTab({
    //           //     url: '/pages/index/index'
    //           //   });
    //           // }, 1500);
    //         }
    //       },
    //     });
    //   }
    // },
    // 删除照片
    removeImg(index) {
      uni.showModal({
        content: '确定删除这张吗',
        success: (res) => {
          if (res.confirm) {
            this.imgList.splice(index, 1);
            this.evaluateImgUrlList.splice(index, 1)
            this.imgCount++;
          } else if (res.cancel) {
          }
        },
      });
    },
    // 评价改变的时候
    contentChange(e) {
      this.current = e.detail.value;
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #f0f0f0;
  .box {
    margin: 60rpx auto 0;
    width: 700rpx;
    height: 100%;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 20rpx;
    box-sizing: border-box;
    // 头部商品详情区域
    .box-title {
      image {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
      display: flex;
      .title-left {
        width: 120rpx;
        width: 30%;
        height: 120rpx;
        margin-right: 40rpx;
        border-radius: 20rpx;
      }
      .title-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .right-shopName {
          font-size: 28rpx;
          color: #000;
          line-height: 1.5;
        }
        .right-details {
          font-size: 24rpx;
          color: #6d6d6d;
          line-height: 1.5;
        }
      }
    }
    // 商品评价区域
    .evaluate {
      color: #000;
      font-size: 28rpx;
      margin: 40rpx 0;
    }
    // 好中评区域
    .content {
      margin: 40rpx 0;
      .content-group {
        display: flex;
        justify-content: space-evenly;
        .active {
          color: $uni-color-primary;
        }
      }
    }
    .evaluate-text {
      width: 100%;
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
        margin: 20rpx 0;
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
    .release {
      width: 166rpx;
      height: 54rpx;
      border-radius: 27rpx;
      margin: 40rpx auto 20rpx;
      line-height: 54rpx;
      text-align: center;
      border: 1rpx solid #000;
    }
  }
}
</style>
