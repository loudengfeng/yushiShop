module.exports = {
  //系统
  domain: {
    // api: 'http://wmirw.pazmm.com/api/', //正式环境地址
    api: 'http://wmirw.pazmm.com:9000/api/' // 测试环境地址
    // 'api': 'http://192.168.110.101:34668/' // 卜hn
    // 'file' : 'https://liuda.nyakarlek.cn/'
    // 'api':'http://192.168.110.104:34668/'
    // api: 'http://121.196.227.128:8080/api/', // 李
  },
  //后台的api接口
  url: {
    //退货
    returnGoods: {
      //退货申请时候的上传图片信息接口
      uploadMainInfo: 'returnGoods/uploadMainInfo',
    },
  },
};