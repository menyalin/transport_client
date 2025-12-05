export const clientAgreementSelector = ({ allowedAgreements, carrierId }) => {
  if (allowedAgreements.length === 1) return allowedAgreements[0]
  const agreements = allowedAgreements
    .slice()

    .sort((a, b) => {
      // Сначала сравниваем date
      const dateDiff = +new Date(b.date) - +new Date(a.date)
      // Если даты разные, возвращаем их разницу
      if (dateDiff !== 0) return dateDiff
      // Если даты равны, сравниваем createdAt
      return +new Date(b.createdAt) - +new Date(a.createdAt)
    })
  return (
    agreements.find(i => i.executor === carrierId) ||
    agreements.find(i => i.allowedCarriers.includes(carrierId)) ||
    agreements[0] ||
    null
  )
}
