export default class constant {
  static conType = {
    form: 'application/x-www-form-urlencoded',
    json: 'application/json; charset=UTF-8',
    file: 'multipart/form-data'
  }
  static method = {
    get: 'get',
    post: 'post',
    del: 'delete',
    put: 'put'
  }
}
