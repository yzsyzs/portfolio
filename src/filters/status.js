export const gameStatus = (type) => {
  if (!type) {
    return
  }
  let gameStatus = {
    'TRADEIN': '买入中',
    'HOLDING': '持股买出中',
    // '2': '持股买出中',
    'TRADEOUT': '持股中'
  }
  return gameStatus[type]
}
