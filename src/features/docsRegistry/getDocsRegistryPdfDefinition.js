export function getDocsRegistryPdfDefinition(docsRegistry) {
  const docTitle = `Опись документов №${docsRegistry.number}`

  return {
    info: {
      title: docTitle,
    },
    pageSize: 'A4',
    pageOrientation: 'portrait',
    content: [
      { text: 'Text on Portrait' },
      {
        text: 'Text on Landscape',
        pageOrientation: 'landscape',
        pageBreak: 'before',
      },
      {
        text: 'Text on Landscape 2',
        pageOrientation: 'portrait',
        pageBreak: 'after',
      },
      { text: 'Text on Portrait 2' },
    ],
  }
}
