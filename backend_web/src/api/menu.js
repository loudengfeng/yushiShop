import request from '@/utils/request'
import qs from 'qs'

export function addMenu(data){
  return request ({
    url:'menu/insert',
    method:'post',
    data:data,
    transformRequest: [data => {
      return qs.stringify(data);
    }],
  })
}

export function searchMenu(data){
  return request ({
    url:'menu/selectAll',
    method:'post',
    data:data,
    transformRequest: [data => {
      return qs.stringify(data);
    }],
  })
}

