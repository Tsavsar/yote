import { ImageResponse } from 'next/og'
import { SITE_NAME } from '../lib/site'

export const alt = `${SITE_NAME}, input components for React`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* The preview stage's grid: 4.8px dots on a 38.5px pitch, scaled to this
   canvas. Drawn as circles rather than a tiled radial-gradient, because
   satori paints the gradient once and does not repeat it.
   It stops above the field rather than running behind it — the grid is the
   ground the hero sits on, and a dot showing through the card it is under
   reads as a mistake. */
const GRID = { pitch: 34, radius: 2.4, height: 200 }
const DOTS: { x: number; y: number }[] = []
for (let y = GRID.pitch / 2; y < GRID.height; y += GRID.pitch) {
  for (let x = GRID.pitch / 2; x < size.width; x += GRID.pitch) DOTS.push({ x, y })
}

/**
 * The card a link to this site renders as.
 *
 * It is the hero: the dot grid the previews sit on, the name inside one of
 * the fields the library makes, then the pitch. A component library's link
 * preview should be a component — the pill is the real geometry, the same
 * radius, hairline and shadow the Input renders, rather than a logo lockup
 * that could belong to anything.
 *
 * Generated rather than drawn, so it cannot fall out of step with the words
 * on the page, and so there is no binary in the repo to remember to update.
 * The mark's paths are copied from public/yote-mark.svg rather than redrawn:
 * satori cannot rasterise an external file, and the card every link renders
 * is the wrong place to approximate a logo.
 *
 * Every element states `display: flex`. satori refuses any node with more
 * than one child that does not, and the error it throws does not say which
 * node it meant.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#ffffff',
        padding: '0 76px 74px',
      }}
    >
      <svg
        width={size.width}
        height={GRID.height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {DOTS.map((dot) => (
          <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={GRID.radius} fill="#ededed" />
        ))}
      </svg>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          width: '772px',
          height: '78px',
          padding: '0 28px',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: '20px',
          background: '#ffffff',
          boxShadow: '0 2px 4px 0 rgba(54, 54, 54, 0.04)',
        }}
      >
        <svg width="44" height="33" viewBox="0 0 25 19" fill="none">
          <path
            d="M24.0356 10.8833L15.5507 7.82976L15.5451 7.82821C15.0001 7.63366 14.4092 7.76571 14.0008 8.16944C13.5921 8.5728 13.4622 9.15561 13.6618 9.68817L16.7616 18.0496C16.9751 18.6213 17.5275 19 18.1428 19H18.1749C18.8028 18.9862 19.3538 18.5814 19.5435 17.9926L20.3947 15.3738C20.5355 14.9407 20.88 14.6013 21.3196 14.4626L23.9742 13.6251C24.5755 13.4375 24.9871 12.8948 24.9996 12.2736C25.0136 11.6538 24.6244 11.0943 24.0356 10.8833Z"
            fill="#171717"
          />
          <path
            d="M12.4119 11.2075C12.3785 11.1472 12.3491 11.0847 12.3268 11.0196C11.8882 9.73847 12.2165 8.35105 13.1974 7.38271C13.881 6.70645 14.5868 6.51476 15.5494 6.51476C15.9554 6.51476 16.3571 6.58147 16.7422 6.71405C16.7509 6.71694 18.8446 7.6064 20.9494 8.42844C21.8718 8.78869 22.8568 8.11335 22.8569 7.13584L22.8571 3.87037C22.8571 1.7359 21.0951 0 18.9285 0H3.92856C1.76199 0 0 1.7359 0 3.87037V10.2037C0 12.3382 1.76199 14.0741 3.92856 14.0741H11.593C12.6777 14.0741 13.3666 12.93 12.8468 11.9921L12.4119 11.2075ZM7.14268 7.03704C7.14268 7.81432 6.50309 8.44444 5.7141 8.44444C4.92513 8.44444 4.28553 7.81432 4.28553 7.03704C4.28553 6.25975 4.92513 5.62963 5.7141 5.62963C6.50309 5.62963 7.14268 6.25975 7.14268 7.03704ZM12.1427 7.03704C12.1427 7.81432 11.5031 8.44444 10.7141 8.44444C9.92513 8.44444 9.28553 7.81432 9.28553 7.03704C9.28553 6.25975 9.92513 5.62963 10.7141 5.62963C11.5031 5.62963 12.1427 6.25975 12.1427 7.03704Z"
            fill="#171717"
          />
        </svg>
        <div style={{ display: 'flex', fontSize: 32, color: '#171717' }}>{SITE_NAME} inputs</div>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: 66,
          color: '#171717',
          letterSpacing: '-1.6px',
          marginTop: '44px',
        }}
      >
        input components for React.
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 27,
          color: '#5c5c5c',
          marginTop: '22px',
        }}
      >
        <div style={{ display: 'flex' }}>
          Every state designed, every transition tuned, every edge case handled.
        </div>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          Install it and the field already feels right.
        </div>
      </div>
    </div>,
    size,
  )
}
