<template>
  <div>
    <el-card shadow="hover">
      <div class="head">
        <!-- 头部左边 -->
        <div class="head-left">
          <!-- 左边上部分区域 -->
          <div class="left-top">
            <!-- 时间区域 -->
            <div class="timer">
              <span class="timer-title">今日</span>
              <span class="now-date">{{ nowDate }}</span>
              <span>{{ nowWeek }}</span>
            </div>
            <!-- 累计区域 -->
            <div class="cumulative">欢迎登录后台系统，累计售出{{ shopNum }}件商品，请继续加油</div>
          </div>
          <!-- 左边下部分区域 -->
          <!-- 首页的 slot -->
          <slot name="Dashboard-left-down"></slot>
          <!-- 今日收益和人数 slot -->
          <slot name="Today"></slot>
        </div>
        <!-- 头部右边 -->
        <div class="head-right">
          <div class="right-common">
            <img src="@/assets/img/warehousing.png" alt />
            <div>
              <div class="right-common-num">{{ warehousingNum }}</div>
              <div class="right-common-text">待入库</div>
            </div>
          </div>
          <div class="right-common">
            <img src="@/assets/img/examine.png" alt />
            <div>
              <div class="right-common-num">{{ examineNum }}</div>
              <div class="right-common-text">待审核</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 星期
      nowWeek: '',
      // 日期
      nowDate: '',
      // 售出的商品数量
      shopNum: 3422,
      // 待入库数量
      warehousingNum: 20,
      // 待审核数量
      examineNum: 7
    };
  },
  created() {
    // 获取当前时间
    this.setNowTimes();
  },
  methods: {
    // 获取当前时间
    setNowTimes() {
      let myDate = new Date();
      // console.log(myDate);
      let wk = myDate.getDay();
      let yy = String(myDate.getFullYear());
      let mm = myDate.getMonth() + 1;
      let dd = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());
      let hou = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours());
      let min = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes());
      let sec = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds());
      let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      let week = weeks[wk];
      this.nowDate = yy + '-' + mm + '-' + dd;
      // 时间
      // this.nowTime = hou + ':' + min + ':' + sec;
      this.nowWeek = week;
    }
  }
};
</script>

<style lang="scss" scoped>
/*/deep/.el-card__body {*/
/*  padding: 0 !important;*/
/*}*/
// 卡片的内边距
.el-card {
  padding: 0 50px;
}
// 头部区域
.head {
  display: flex;
  justify-content: space-between;
  height: 138px;
  background: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  // padding: 0 58px;
  // 头部左边
  .head-left {
    width: 45%;
    height: 76px;
    // 左边上部分区域
    .left-top {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      // 时间区域
      .timer {
        font-weight: 500;
        color: #343a49;
        font-size: 14px;
        .timer-title {
          color: #66b98d;
          font-size: 18px;
        }
        .now-date {
          margin: 0 10px;
        }
      }
      // 累计区域
      .cumulative {
        font-size: 14px;
        font-weight: 400;
        color: #343a49;
      }
    }
    // 左边下部分区域
  }
  // 头部右边
  .head-right {
    width: 35%;
    display: flex;
    align-items: center;
    .right-common {
      display: flex;
      align-items: center;
      margin: 0 20px;
      > img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      > div {
        text-align: center;
        .right-common-num {
          font-size: 24px;
          color: #343a49;
        }
        .right-common-text {
          font-size: 16px;
          color: #949494;
        }
        > div {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 20px 0;
        }
      }
    }
  }
}
</style>
