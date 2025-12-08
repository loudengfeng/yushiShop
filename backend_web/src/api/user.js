import request from '@/utils/request'
import qs from 'qs'

export function register(data){
  return request ({
    url:'user/register',
    method:'post',
    data:data,
    transformRequest: [data => {
      return qs.stringify(data);
    }],
  })
}

export function login(data){
  return request ({
    url:'tob/auth/login',
    method:'post',
    data:data,
    // transformRequest: [data => {
    //   return qs.stringify(data);
    // }],
  })
}
export function userList(data){
  return request ({
    url:'tob/user/list',
    method:'post',
    data:data
  })
}
export function saveUser(data){
  return request ({
    url:'tob/user/save',
    method:'post',
    data:data
  })
}
export function userIdentity(data){
  return request ({
    url:'tob/userIdentity/list',
    method:'post',
    data:data
  })
}
export function userIdentityAudit(data){
  return request ({
    url:'tob/userIdentity/audit',
    method:'post',
    data:data
  })
}
