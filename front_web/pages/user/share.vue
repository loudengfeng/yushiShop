<template>
  <view class="box">
    <view style="color: #545454;"
      >好友通过您分享出去的内容, 并下载APP 成功注册之后.Ta将成为您的粉丝</view
    >
    <view class="box-img">
      <image :src="imageUrl"></image>
    </view>
    <button @click="copy">点击保存图片</button>
  </view>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: '../../static/share.png',
    };
  },
  methods: {
    // 点击保存图片
    copy(e) {
      // #ifdef H5 || MP-WEIXIN
      uni.downloadFile({
        url: this.imageUrl,
        success: (res) => {
          // console.log(res);
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: (ress) => {
              console.log(ress);
            },
          });
        },
      });
      // uni.downloadFile({  // 下载图片
      //   url: this.imageUrl,
      //   success: (res) => {
      //     console.log(res)
      //     uni.saveImageToPhotosAlbum({        // 保存图片到本地
      //       filePath: res.tempFilePath,     // 图片临时路径
      //       success: function () {
      //         uni.showToast({
      //           "title": "保存成功",
      //           duration: 2000
      //         })
      //       },
      //     })
      //   }
      // })
      // #endif
      // #ifdef APP-PLUS
      uni.saveImageToPhotosAlbum({
        filePath: this.imageUrl,
        success: () => {
          this.$api.msg('保存成功');
        },
      });
      // #endif
    },
  },
};
</script>

<style lang="scss">
.box {
  padding: 30rpx;
  .box-img {
    margin: 30rpx auto;
    width: 400rpx;
    height: 600rpx;
    > image {
      width: 100%;
      height: 100%;
    }
  }
  button {
    color: #fff;
    background-color: #323f6c;
    &:after {
      width: 0;
      height: 0;
    }
  }
}
</style>
