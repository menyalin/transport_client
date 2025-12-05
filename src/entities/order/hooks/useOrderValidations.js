import { plannedDateInRetailPartnersControl } from './utils'

export const useOrderValidations = () => {
  function isValidPrices(agreement, prices, { status }) {
    const STATUSES_WITH_PRICES = ['inProgress', 'completed']
    if (!agreement) return false
    if (!agreement.priceRequired) return true
    if (!STATUSES_WITH_PRICES.includes(status)) return true
    return !!prices.filter(i => i.type === 'base' && i.price > 0).length
  }

  function isValidClientNum(agreement, { num }, { status }) {
    const STATUSES_WITH_CLIENT_NUM = ['inProgress', 'completed']
    if (!agreement) return true
    if (!agreement.clientNumRequired) return true
    if (!STATUSES_WITH_CLIENT_NUM.includes(status)) return true
    return !!num
  }

  function isValidAuctionNum(agreement, { auctionNum }, { status }) {
    const STATUSES_WITH_CLIENT_NUM = ['inProgress', 'completed']
    if (!agreement) return true
    if (!agreement.auctionNumRequired) return true
    if (!STATUSES_WITH_CLIENT_NUM.includes(status)) return true
    return !!auctionNum
  }

  function beforeSubmitOrderValidation(order) {
    let baseResult = [false, null]

    const res = plannedDateInRetailPartnersControl(order.state.status, order.route)

    if (res[0]) return res

    return baseResult
  }

  return {
    isValidPrices,
    isValidClientNum,
    isValidAuctionNum,
    beforeSubmitOrderValidation,
  }
}
