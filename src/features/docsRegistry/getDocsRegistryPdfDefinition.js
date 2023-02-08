import store from '@/store'

class TableDataTDO {
  constructor(orders) {
    this.items = orders.map((i, idx) => ({
      idx: idx + 1,
      driverName: i.driverName,
      place: i.placeName,
      numbers: i.docNumbers,
      orderNumber: i.routeNumber,
      orderDate: new Date(i.orderDate).toLocaleDateString(),
      docTypes: i.docTypesStr,
      note: i.note,
    }))
  }
  tableRows(headers) {
    return this.items.map((row) => {
      return headers.map((col) => {
        // if (!row[col.value])
        //   return {
        //     text: ' ',
        //     headlineLevel: idx + 1 === headers.length ? 1 : 0,
        //   }
        return {
          text: row[col.value] || ' ',
          alignment: 'center',
          headlineLevel: 1,
        }
      })
    })
  }
}
const getCompanyName = (docsRegistry) => {
  return store.getters.myCompanies.find((i) => i._id === docsRegistry.company)
    .fullName
}

const getClientName = (docsRegistry) => {
  return store.getters.partnersMap.get(docsRegistry.client)?.fullName || '???'
}

const getPlaceName = (docsRegistry) => {
  const client = store.getters.partnersMap.get(docsRegistry.client)
  if (!client || !client.placesForTransferDocs) return ''
  const place = client.placesForTransferDocs.find(
    (place) => place.address === docsRegistry.placeForTransferDocs
  )
  return place?.title || '???'
}

const getPlaces = (docsRegistry) => {
  const placesSet = new Set(docsRegistry.orders.map((i) => i.placeName))
  return Array.from(placesSet)
    .sort((a, b) => (a > b ? 1 : -1))
    .join(', ')
}

export function getDocsRegistryPdfDefinition(docsRegistry) {
  const content = new TableDataTDO(docsRegistry.orders)

  const docRegistryDateStr = new Date(
    docsRegistry.createdAt
  ).toLocaleDateString()

  const $docTitle = `Опись первичных документов №${docsRegistry.number} от ${docRegistryDateStr}`
  const $fileTitle = `Опись документов №${docsRegistry.number} от ${docRegistryDateStr}`
  const $companyName = getCompanyName(docsRegistry)
  const $placeName = getPlaceName(docsRegistry)
  const $clientName = getClientName(docsRegistry)
  const $places = getPlaces(docsRegistry)
  const $note = docsRegistry.note

  const tableHeaders = [
    { title: '№', value: 'idx', width: 'auto' },
    { title: 'Площадка', value: 'place', width: 'auto' },
    { title: 'Дата', value: 'orderDate', width: 'auto' },
    { title: 'Номер документа', value: 'numbers', width: '*' },
    { title: 'Водитель', value: 'driverName', width: '*' },
    { title: 'Номер рейса', value: 'orderNumber', width: 'auto' },
    { title: 'Сопроводительные док-ты', value: 'docTypes', width: '*' },
    { title: 'Примечание', value: 'note', width: '*' },
  ]

  return {
    info: { title: $fileTitle },
    pageSize: 'A4',
    // pageOrientation: 'landscape',
    pageOrientation: 'portrait',
    pageMargins: [20, 20, 20, 20],
    footer: (currentPage, pageCount) => ({
      text: 'Страница ' + currentPage.toString() + ' из ' + pageCount,
      style: 'pageFooter',
    }),
    pageBreakBefore: (
      currentNode,
      followingNodesOnPage,
      nodesOnNextPage,
      _previousNodesOnPage
    ) =>
      currentNode.headlineLevel === 1 &&
      followingNodesOnPage.length < tableHeaders.length + 1 &&
      nodesOnNextPage.length === 5,

    content: [
      {
        stack: [
          `Транспортная компания: ${$companyName}`,
          `Заказчик: ${$clientName}`,
          {
            text: [
              'Площадка приема первичных документов: ',
              { text: $placeName, bold: true },
            ],
          },
          {
            text: [
              'Площадки: ',
              {
                text: $places,
                bold: true,
              },
            ],
          },
        ],
        style: 'header',
      },
      {
        text: $docTitle,
        style: 'docTitle',
      },
      {
        style: 'table',
        table: {
          headerRows: 1,
          widths: tableHeaders.map((column) => column.width),
          body: [
            //HEADERS
            tableHeaders.map((column) => ({
              text: column.title,
              style: 'tableHeader',
            })),
            ...content.tableRows(tableHeaders),
          ],
        },
      },
      { text: $note, style: 'note' },
      {
        columns: [
          { width: '*', text: 'Сдал:   _________________' },
          { width: '*', text: 'Принял:   _________________' },
        ],
        style: 'signatures',
      },
    ],
    styles: {
      header: {
        margin: [10, 10],
        fontSize: 12,
      },
      docTitle: {
        fontSize: 16,
        margin: [0, 5],
        alignment: 'center',
        bold: true,
      },
      table: {
        fontSize: 8,
      },
      tableHeader: {
        bold: true,
        alignment: 'center',
      },
      note: {
        fontSize: 8,
        italics: true,
        margin: [30, 10],
      },
      signatures: {
        alignment: 'center',
        fontSize: 12,
        margin: [5, 50],
      },

      pageFooter: {
        alignment: 'center',
        fontSize: 8,
        margin: [20, 5],
      },
    },
  }
}
