module.exports = {
  //系统
  domain: {
    api: 'http://wmirw.pazmm.com/api/', //正式环境地址
    // api: 'http://wmirw.pazmm.com:9000/api/' // 测试环境地址
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
