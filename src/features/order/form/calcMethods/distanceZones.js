export default ({ distance, zones }) => {
  const sortedZones = zones.slice().sort((a, b) => a.value - b.value)
  for (let i = 0; i < sortedZones.length; i++) {
    if (sortedZones[i].value >= distance) return sortedZones[i].price
  }
  return 0
}
