import request from '@/utils/request'
export function productList(data){
  return request ({
    url:'tob/product/list',
    method:'post',
    data:data
  })
}
export function orderList(data) {
  return request({
    url: 'tob/order/list',
    method: 'post',
    data: data
  })
}
  export function orderDetail(data) {
    return request({
      url: 'tob/order/detail',
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
export function saveProduct(data) {
  return request({
    url: 'tob/product/save',
    method: 'post',
    data: data
  })
}
export function deleteProduct(data) {
  return request({
    url: 'tob/product/delete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function productReSale(data) {
  return request({
    url: 'tob/product/reSale',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function makeOrderComplete(data) {
  return request({
    url: 'tob/order/makeOrderComplete',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function setSubPrice(data) {
  return request({
    url: 'tob/order/setSubPrice',
    method: 'post',
    data: data
  })
}

export function reSaleBatch(data) {
  return request({
    url: 'tob/product/reSaleBatch',
    method: 'post',
    data: data
  })
}
