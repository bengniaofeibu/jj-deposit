import axios from 'axios'
import Qs from 'qs'
import baseUrl from './baseUrl'

/**
 * data={
 *   type:'post',请求类型
 *   data：data,接口参数
 *   conType:'',请求格式
 *   url:'http', 请求地址
 * }
 * **/
export default class publicMethods {
  static request (data) {
    return new Promise((resolve, reject) => {
      let newData = ''
      if (data.conType === 'application/x-www-form-urlencoded') {
        newData = Qs.stringify(data.data)
      } else {
        newData = JSON.stringify(data.data)
      }
      axios({
        method: data.type ? data.type : 'post',
        url: data.url.indexOf('http') === 0 ? data.url : baseUrl.jjBaseUrl + data.url,
        data: data.type !== 'get' ? newData : '',
        params: data.type === 'get' ? data.data : '',
        headers: {
          'Content-Type': data.conType ? data.conType : 'application/json; charset=UTF-8'
        },
        withCredentials: false
      }).then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }

  static S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  // 随机数 deviceId
  static newGuid () {
    return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4())
  }

  static getQS (paras) {
    let url = location.href
    let paraArr = url.substring(url.indexOf('?') + 1, url.length).split('&')
    let paraObj = {}
    for (let i = 0; i < paraArr.length; i++) {
      paraObj[paraArr[i].split('=')[0].toLowerCase()] = paraArr[i].split('=')[1]
    }
    let returnValue = paraObj[paras.toLowerCase()]
    if (typeof (returnValue) === 'undefined') {
      return ''
    } else {
      return decodeURIComponent(returnValue)
    }
  }
  // 去除前后空格
  static trim (str) {
    return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
  }
}
