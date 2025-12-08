<template>
  <view>
    <transition name="box">
      <view v-if="isBackTop"
            class="back-top"
            @click="changeBackTop">
        <image src="../../static/back-top.png"></image>
      </view>
    </transition>
  </view>
</template>

<script>
export default {
  props: {
    isBackTop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    };
  },
  methods: {
    changeBackTop() {
      this.$emit('changeIsBackTop')
    }
  },
}
</script>

<style lang="scss">
.box-enter-active {
  transition: all 0.5s ease;
}
.box-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.box-enter, .box-leave-to
/* .box-leave-active for below version 2.1.8 */ {
  // transform: translateX(10px);
  opacity: 0;
}
.back-top {
  position: fixed;
  bottom: 200rpx;
  right: 40rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 1rpx solid #bfbfbf;
  background-color: #fff;
  > image {
    width: 100%;
    height: 100%;
  }
}
</style>
