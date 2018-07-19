// 时间戳转换成2018-11-11形式
export const _formatDate = dt => {
  let year = dt.getFullYear()
  let month = dt.getMonth() + 1
  let date = dt.getDate()
  let hour = dt.getHours()
  let minute = dt.getMinutes()
  let second = dt.getSeconds()
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}
