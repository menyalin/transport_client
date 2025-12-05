export default ({ truck, trailer, driver }) => {
  const d = {
    truckMark: truck?.brand,
    truckRegNum: truck?.regNum,
    trailerRegNum: trailer?.regNum,
    driver: driver?.fullName,
    passportId: driver?.passportId,
    passportIssued: driver?.passportIssued,
    passportDate: driver?.passportDate,
    licenseId: driver?.licenseId,
    licenseDate: driver?.licenseDate,
    phone: driver?.phone,
    phone2: driver?.phone2,
  }
  let resStr = `${d.truckMark ? d.truckMark + '\t' : ''}${d.truckRegNum}  ${d.trailerRegNum || ''}\n`
  resStr += `${d.driver}\n`
  resStr += `Паспорт ${d.passportId || '-'}, Выдан ${d.passportIssued || '-'}, от ${
    d.passportDate ? new Date(d.passportDate).toLocaleDateString() : '-'
  }\n`
  resStr += `ВУ ${d.licenseId || '-'}, от ${d.licenseDate ? new Date(d.licenseDate).toLocaleDateString() : '-'}\n`
  resStr += `тел: ${d.phone || ''}  ${d.phone2 || ''}`
  navigator.clipboard.writeText(resStr).then()
}
