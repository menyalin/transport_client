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
      return headers.map((col, idx) => {
        // if (!row[col.value])
        //   return {
        //     text: ' ',
        //     headlineLevel: idx + 1 === headers.length ? 1 : 0,
        //   }
        return {
          text: row[col.value] || ' ',
          alignment: 'center',
          headlineLevel: idx === 0 ? 2 : 1,
          fake: true,
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

const getPlaces = (docsRegistry) => {
  const placesSet = new Set(docsRegistry.orders.map((i) => i.placeName))
  return Array.from(placesSet)
    .sort((a, b) => (a > b ? 1 : -1))
    .join(', ')
}

export function getDocsRegistryPdfDefinition(docsRegistry, placeName) {
  const content = new TableDataTDO(docsRegistry.orders)

  const docRegistryDateStr = new Date(
    docsRegistry.createdAt
  ).toLocaleDateString()

  const $docTitle = `Опись первичных документов №${docsRegistry.number} от ${docRegistryDateStr}`
  const $fileTitle = `Опись документов №${docsRegistry.number} от ${docRegistryDateStr}`
  const $companyName = getCompanyName(docsRegistry)
  const $placeName = placeName
  const $clientName = getClientName(docsRegistry)
  const $places = getPlaces(docsRegistry)
  const $note = docsRegistry.note || ''

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
    // pageBreakBefore: (
    //   currentNode,
    //   followingNodesOnPage,
    //   nodesOnNextPage,
    //   _previousNodesOnPage
    // ) => {
    //   const tableCellsOnPage = followingNodesOnPage.filter(
    //     (n) => n.headlineLevel >= 1
    //   )
    //   // const _tableCellsOnNextPage = nodesOnNextPage.filter(
    //   //   (n) => n.headlineLevel >= 1
    //   // )
    //   return (
    //     currentNode.headlineLevel === 2 &&
    //     tableCellsOnPage.length <= tableHeaders.length + 1 &&
    //     // tableCellsOnNextPage.length <= tableHeaders.length &&
    //     nodesOnNextPage.length < 5
    //   )
    // },

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
          dontBreakRows: false,
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
      { text: `Примечание: ${$note}`, style: 'note' },
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
        margin: [5, 40],
      },

      pageFooter: {
        alignment: 'center',
        fontSize: 8,
        margin: [20, 5],
      },
    },
  }
}
