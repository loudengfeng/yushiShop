import request from '@/utils/request'
import qs from 'qs'

export function selectVip(data){
  return request ({
    url:'vip/selectVip',
    method:'post',
    data:data,
    transformRequest: [data => {
      return qs.stringify(data);
    }],
  })
}

export function addVip(data){
  return request ({
    url:'vip/addVip',
    method:'post',
    data:data,
    transformRequest: [data => {
      return qs.stringify(data);
    }],
  })
}

export function upDateVip(data){
  return request ({
    url:'vip/updateVip',
    method:'post',
    data:data,
    transformRequest: [data => {
      return qs.stringify(data);
    }],
  })
}

export function deleteVip(data){
  return request ({
    url:'vip/deleteVip',
    method:'post',
    data:data,
    transformRequest: [data => {
      return qs.stringify(data);
    }],
  })
}

export function vipExport(data){
  return request ({
    url:'vip/export',
    method:'post',
    data:data,
    transformRequest: [data => {
      return qs.stringify(data);
    }],
  })
}

export function vipImport(data){
  return request ({
    url:'vip/importExcel',
    method:'post',
    data:data
  })
}

