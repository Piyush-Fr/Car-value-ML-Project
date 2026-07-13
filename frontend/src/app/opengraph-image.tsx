import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Monovaluation - AI-powered vehicle valuation'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 160, 
            height: 160, 
            borderRadius: 40,
            background: 'white',
            color: '#0A0A0A',
            fontSize: 100, 
            fontWeight: 'bold', 
            marginBottom: 40 
          }}
        >
          M
        </div>
        <div style={{ fontSize: 80, fontWeight: 'bold', letterSpacing: '0.1em' }}>
          MONOVALUATION
        </div>
        <div style={{ fontSize: 40, color: '#A0A0A0', marginTop: 20, fontWeight: 'normal' }}>
          AI-powered vehicle valuation and market insights
        </div>
      </div>
    ),
    { ...size }
  )
}
