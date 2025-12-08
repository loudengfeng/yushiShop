<script>
/**
 * vuex管理登陆状态，具体可以参考官方登陆模板示例
 */
import { mapMutations } from 'vuex';
export default {
  methods: {
    ...mapMutations(['login'])
  },
  onLaunch: function (e) {
    uni.setStorageSync('openId', e.query.openId);
    uni.setStorageSync('Referral2Id', e.query.Referral2Id);
    if (e.query.PageUrl == 'register') {
      uni.navigateTo({
        url: '/pages/public/register'
      });
    }
    let token = uni.getStorageSync('token');
    if (e.query.PageUrl == 'login' && !token) {
      uni.navigateTo({
        url: '/pages/public/login'
      });
    }
    if (e.query.PageUrl == 'login' && token) {
      uni.navigateTo({
        url: '/pages/user/user'
      });
    }
    let userInfo = uni.getStorageSync('userInfo') || '';
    if (userInfo.id) {
      //更新登陆状态
      uni.getStorage({
        key: 'userInfo',
        success: res => {
          this.login(res.data);
        }
      });
    }
    var browser = {
      versions: (function () {
        var u = navigator.userAgent,
          app = navigator.appVersion;
        return {
          //移动终端浏览器版本信息
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
          iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
      })(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    if (browser.versions.mobile) {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        uni.setStorageSync('isWeixin', true);
      } else {
        uni.setStorageSync('isWeixin', false);
      }
    }
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  }
};
</script>

<style lang="scss">
@import "/common/css/common.scss";
</style>
