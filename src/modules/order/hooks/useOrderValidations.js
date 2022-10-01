export const useOrderValidations = () => {
  
  function isValidPrices(agreement, prices, { status } ) {
    const STATUSES_WITH_PRICES = ['inProgress', 'completed']
    if (!agreement)  return false
    if (!agreement.priceRequired) return true
    if (!STATUSES_WITH_PRICES.includes(status)) return true
    return !!prices.filter(i => (i.type === 'base' && i.price > 0)).length 
  }

  function isValidClientNum(agreement, { num }, { status }) {
    const STATUSES_WITH_CLIENT_NUM = ['inProgress', 'completed']
    if (!agreement)  return true
    if (!agreement.clientNumRequired) return true
    if (!STATUSES_WITH_CLIENT_NUM.includes(status)) return true
    return !!num
  }


  return {
    isValidPrices,
    isValidClientNum,
  }
}