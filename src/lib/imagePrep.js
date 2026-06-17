// Liest ausgewählte Bilddateien, verkleinert sie clientseitig auf eine
// vernünftige Kantenlänge und liefert `{ name, dataUrl }`-Objekte zurück.
const MAX_FILES = 5
const MAX_EDGE = 1600

export async function prepareImages(fileList) {
  const files = Array.from(fileList)
    .filter((file) => /^image\//.test(file.type))
    .slice(0, MAX_FILES)
  const out = []
  for (const file of files) {
    out.push({ name: file.name, dataUrl: await downscaleToDataUrl(file) })
  }
  return out
}

function downscaleToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }
    img.src = url
  })
}
