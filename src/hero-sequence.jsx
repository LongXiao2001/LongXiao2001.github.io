import {AbsoluteFill, Html5Video, interpolate, useCurrentFrame} from 'remotion';

const ticks = [0, 20, 40, 60, 80, 100, 120];

export function HeroSequence() {
  const frame = useCurrentFrame();
  const progress = (frame % 120) / 120;
  const reveal = interpolate(frame % 120, [0, 92], [0.08, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return <AbsoluteFill className="sequence-canvas">
    <div className="sequence-label">RESEARCH PROJECTION · 120 FRAMES</div>
    <div className="sequence-ticks">{ticks.map((tick) => <span key={tick}>{String(tick).padStart(3, '0')}</span>)}</div>
    <div className="sequence-frames" style={{'--reveal': reveal}}>
      <div className="latent-field" />
      <Html5Video src="./media/talking-avatar.mp4" muted className="sequence-video" />
      <div className="frame-grid" />
    </div>
    <div className="sequence-playhead" style={{left: `${progress * 100}%`}}><span>{String(frame % 120).padStart(3, '0')}</span></div>
    <div className="sequence-tracks">
      <span>OUTPUT FRAMES</span><i style={{transform: `scaleX(${reveal})`}} />
      <span>CAUSAL MASK</span><i style={{transform: `scaleX(${1 - progress * 0.7})`}} />
      <span>AUDIO / ACTION</span><i className="wave-track" />
    </div>
    <div className="sequence-status">CAUSAL · STREAMING · CONTROLLABLE</div>
  </AbsoluteFill>;
}
