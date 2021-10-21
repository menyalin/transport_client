export const roundingHours = (h) => {
  switch (true) {
    case h < 6:
      return 0
    case h < 12:
      return 6
    case h < 18:
      return 12
    case h < 24:
      return 18
    default:
      return 0
  }
}
