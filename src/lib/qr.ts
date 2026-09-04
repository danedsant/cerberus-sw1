import QRCode from 'qrcode'

export function generatePin(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const letter1 = letters[Math.floor(Math.random() * letters.length)]
  const letter2 = letters[Math.floor(Math.random() * letters.length)]
  const numbers = Math.floor(100 + Math.random() * 900)
  return `${letter1}${letter2}-${numbers}`
}

export async function generateQR(visitaId: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/#/visita/${visitaId}`
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 256,
    margin: 2,
    color: {
      dark: '#1F2937',
      light: '#FFFFFF',
    },
  })
  return qrDataUrl
}
