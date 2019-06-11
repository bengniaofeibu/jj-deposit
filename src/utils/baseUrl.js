let baseUrl
let env = 'prod'
switch (env) {
  case 'dev': // 开发
    baseUrl = {
      jjBaseUrl: 'http://localhost:8888'
    }
    break

  case 'test': // 测试
    baseUrl = {
      jjBaseUrl: 'http://106.14.143.28:8888'
    }
    break

  case 'prod': // 正式
    baseUrl = {
      jjBaseUrl: 'http://47.101.202.147:8888'
    }
    break
}

module.exports = baseUrl
