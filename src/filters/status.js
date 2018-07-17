export const gameStatus = (type) => {
  if (!type) {
    return
  }
  let gameStatus = {
    '0': '买入中',
    '1': '持股中',
    '2': '持股买出中',
    '3': '买入卖出中'
  }
  return gameStatus[type]
}
