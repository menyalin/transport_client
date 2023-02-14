import store from '@/store'
import dayjs from 'dayjs'

export default class TableData {
  constructor(docsRegistry) {
    this.docsRegistry = docsRegistry

    this.headers = [
      { title: '№', value: 'idx', width: 'auto' },
      { title: 'Площадка', value: 'place', width: 'auto' },
      { title: 'Дата', value: 'orderDate', width: 'auto' },
      { title: 'Номер документа', value: 'numbers', width: '*' },
      { title: 'Водитель', value: 'driverName', width: '*' },
      { title: 'Номер рейса', value: 'orderNumber', width: 'auto' },
      { title: 'Сопроводительные док-ты', value: 'docTypes', width: '*' },
      { title: 'Примечание', value: 'note', width: '*' },
    ]

    this.items = docsRegistry.orders.map((i, idx) => ({
      idx: idx + 1,
      driverName: i.driverName,
      place: i.placeName,
      numbers: i.docNumbers,
      orderNumber: i.routeNumber,
      orderDate: new Date(i.orderDate).toLocaleDateString(),
      docTypes: i.docTypesStr,
      note: i.note || ' ',
    }))
  }

  get docRegistryDateStr() {
    return new Date(this.docsRegistry.createdAt).toLocaleDateString()
  }
  get $docTitle() {
    return `Опись первичных документов №${this.docsRegistry.number} от ${this.docRegistryDateStr}`
  }
  get $fileTitle() {
    return `Опись документов №${this.docsRegistry.number} от ${this.docRegistryDateStr}`
  }
  get $companyName() {
    return this.getCompanyName()
  }
  get $placeName() {
    return this.placeName()
  }
  get $clientName() {
    return this.getClientName()
  }
  get $places() {
    return this.getPlaces()
  }
  get $note() {
    return this.docsRegistry.note || ' '
  }

  get fileNameStr() {
    return `Опись №${this.docsRegistry.number} от ${dayjs(
      this.docsRegistry.date
    ).format('YYYY-MM-DD')} : ${this.$placeName}`
  }

  tableRows() {
    return this.items.map((row) => {
      return this.headers.map((col, idx) => {
        return {
          text: row[col.value] || ' ',
          alignment: 'center',
          headlineLevel: idx === 0 ? 2 : 1,
        }
      })
    })
  }

  getCompanyName() {
    return store.getters.myCompanies.find(
      (i) => i._id === this.docsRegistry.company
    ).fullName
  }
  placeName() {
    const client = store.getters.partnersMap.get(this.docsRegistry.client)
    if (!client || !client.placesForTransferDocs) return ''
    const place = client.placesForTransferDocs.find(
      (place) => place.address === this.docsRegistry.placeForTransferDocs
    )
    return place?.title || '???'
  }

  getClientName() {
    return (
      store.getters.partnersMap.get(this.docsRegistry.client)?.fullName || '???'
    )
  }
  getPlaces() {
    const placesSet = new Set(this.docsRegistry.orders.map((i) => i.placeName))
    return Array.from(placesSet)
      .sort((a, b) => (a > b ? 1 : -1))
      .join(', ')
  }
}
