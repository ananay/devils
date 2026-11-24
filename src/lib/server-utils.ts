// Server-only utilities - do not import in client components

// Fetch URL content for various features
export async function fetchUrl(url: string): Promise<{ data: string; status: number }> {
  const response = await fetch(url)
  const data = await response.text()
  return { data, status: response.status }
}

// Parse XML for bulk imports
export async function parseXml(xmlString: string): Promise<Record<string, unknown>> {
  const xml2js = await import('xml2js')
  const parser = new xml2js.Parser({
    explicitArray: false,
    explicitRoot: false,
  })
  return parser.parseStringPromise(xmlString)
}

