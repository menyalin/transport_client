export const carrierAgreementSelector = ({ crewState, allowedAgreements = [], executorInClientAgreement }) => {
  if (allowedAgreements.length === 0) return null
  const sortedAgreements = [...allowedAgreements].sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate))
  if (crewState.outsourceAgreement) {
    return sortedAgreements.find(item => item._id === crewState.outsourceAgreement)
  }

  if (executorInClientAgreement) {
    return sortedAgreements.find(item => item.customer === executorInClientAgreement)
  }
  return sortedAgreements[0]
}
