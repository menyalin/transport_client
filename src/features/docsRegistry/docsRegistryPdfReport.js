

export function docsRegistryPdfReport(reportData) {
  
  return {
    info: { title: reportData.$fileTitle },
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
          `Транспортная компания: ${reportData.$companyName}`,
          `Заказчик: ${reportData.$clientName}`,
          {
            text: [
              'Площадка приема первичных документов: ',
              { text: reportData.$placeName, bold: true },
            ],
          },
          {
            text: [
              'Площадки: ',
              {
                text: reportData.$places,
                bold: true,
              },
            ],
          },
        ],
        style: 'header',
      },
      {
        text: reportData.$docTitle,
        style: 'docTitle',
      },
      {
        style: 'table',
        table: {
          headerRows: 1,
          dontBreakRows: false,
          widths: reportData.headers.map((column) => column.width),
          body: [
            //HEADERS
            reportData.headers.map((column) => ({
              text: column.title,
              style: 'tableHeader',
            })),
            ...reportData.tableRows(),
          ],
        },
      },
      { text: `${reportData.$note}`, style: 'note' },
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
