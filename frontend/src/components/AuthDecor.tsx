/** Decorative background for the auth pages — soft blurred clouds, looping
 *  dashed flight path, dot grids and a warm glow behind the illustration,
 *  matching the Figma Login/SignUp stage graphics. */

function SoftCloud({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 560 240" aria-hidden>
      <defs>
        <filter id="cloudBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <g fill="#ffffff" filter="url(#cloudBlur)">
        <ellipse cx="120" cy="190" rx="150" ry="80" />
        <ellipse cx="260" cy="150" rx="120" ry="75" />
        <ellipse cx="395" cy="185" rx="135" ry="78" />
        <ellipse cx="330" cy="110" rx="85" ry="55" />
        <ellipse cx="180" cy="105" rx="75" ry="48" />
      </g>
    </svg>
  )
}

function DotGrid({ className, color = '#c3cdec' }: { className: string; color?: string }) {
  const dots = []
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      dots.push(<circle key={`${r}-${c}`} cx={6 + c * 17} cy={6 + r * 17} r="2.1" />)
    }
  }
  return (
    <svg className={className} width="98" height="78" viewBox="0 0 98 78" fill={color} aria-hidden>
      {dots}
    </svg>
  )
}

/** Dashed flight path with a loop-the-loop, as in the Figma art. */
function FlightPath({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 340 150" fill="none" aria-hidden>
      <path
        d="M10 128c40 6 78 2 106-14 26-15 30-44 12-54-16-9-38 2-36 22 2 22 32 30 62 22 38-10 78-44 178-86"
        stroke="#aebbe2"
        strokeWidth="2.2"
        strokeDasharray="1 10"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Faint hand-drawn circle scribble behind the illustration. */
function Scribble({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 220 220" fill="none" aria-hidden>
      <path
        d="M178 96c8 38-18 76-62 86s-88-10-98-46 14-74 56-86c34-10 76 0 92 26 12 20 10 44-6 60"
        stroke="#e8d9b8"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  )
}

export default function AuthDecor() {
  return (
    <div className="auth-decor" aria-hidden>
      {/* warm glow behind the right-side illustration */}
      <span className="auth-decor__glow" />
      <FlightPath className="auth-decor__path" />
      <SoftCloud className="auth-decor__cloud auth-decor__cloud--big" />
      <SoftCloud className="auth-decor__cloud auth-decor__cloud--mid" />
      <SoftCloud className="auth-decor__cloud auth-decor__cloud--right" />
      <Scribble className="auth-decor__scribble" />
      <DotGrid className="auth-decor__dots auth-decor__dots--left" />
      <DotGrid className="auth-decor__dots auth-decor__dots--right" color="#dcc89a" />
    </div>
  )
}
