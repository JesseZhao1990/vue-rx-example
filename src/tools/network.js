import axios from 'axios'
import cfg from 'cfg'
const axiosInstance = axios.create({
  baseURL: cfg.axiosBaseURL
})

export function post (url, params) {
  return new Promise((resolve, reject) => {
    axiosInstance.post(url, params)
      .then(res => {
        networkErrorHandler(res, resolve, reject)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function get (url, params) {
  return new Promise((resolve, reject) => {
    axiosInstance.get(url, {params: params})
      .then(res => {
        networkErrorHandler(res, resolve, reject)
      })
      .catch((err) => { reject(err) })
  })
}

// 网络请求错误集中处理
function networkErrorHandler (res, resolve, reject) {
  if (res.data.code !== '000') {
    reject(res.data.msg)
  } else {
    resolve(res.data)
  }
}
