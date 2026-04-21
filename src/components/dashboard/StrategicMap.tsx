import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface Pillar {
  id: string;
  name_ar: string;
  name_en: string;
  color: string;
  icon: string;
  type: string;
  sort_order: number;
}

interface Goal {
  id: string;
  name_ar: string;
  name_en: string;
  pillar_id: string;
  sort_order: number;
}

interface Initiative {
  id: string;
  name_ar: string;
  name_en: string;
  pillar_id: string;
  goal_id: string | null;
  sort_order: number;
}

interface Props {
  pillars: Pillar[];
  goals: Goal[];
  initiatives: Initiative[];
}

// ── SVG helpers ──────────────────────────────────────────
const CX = 550, CY = 550;
const GAP = 1.0;

function polar(r: number, deg: number) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arcPath(r1: number, r2: number, a1: number, a2: number) {
  const p1 = polar(r2, a2), p2 = polar(r2, a1);
  const p3 = polar(r1, a1), p4 = polar(r1, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M${p1.x},${p1.y} A${r2},${r2} 0 ${large} 0 ${p2.x},${p2.y} L${p3.x},${p3.y} A${r1},${r1} 0 ${large} 1 ${p4.x},${p4.y}Z`;
}

function midAngle(a1: number, a2: number) { return (a1 + a2) / 2; }
function midRadius(r1: number, r2: number) { return (r1 + r2) / 2; }

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

/** Fit text into available space, truncating with … if needed */
function fitText(text: string, maxChars: number, maxLines: number): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const w of words) {
    if (lines.length >= maxLines) break;
    if (current && (current + ' ' + w).length > maxChars) {
      lines.push(current);
      current = w;
    } else {
      current = current ? current + ' ' + w : w;
    }
  }

  if (current) {
    if (lines.length >= maxLines) {
      // Truncate last line with ellipsis
      const last = lines[lines.length - 1];
      if (last.length > maxChars - 1) {
        lines[lines.length - 1] = last.substring(0, maxChars - 1) + '…';
      }
    } else {
      lines.push(current);
    }
  }

  // Check if we consumed all words; if not, add ellipsis to last line
  const consumed = lines.join(' ').replace('…', '').trim();
  if (consumed.length < text.length && !lines[lines.length - 1]?.endsWith('…')) {
    const last = lines[lines.length - 1] || '';
    if (last.length > maxChars - 1) {
      lines[lines.length - 1] = last.substring(0, maxChars - 1) + '…';
    } else {
      lines[lines.length - 1] = last + '…';
    }
  }

  return lines;
}

// ── Tooltip ──────────────────────────────────────────────
function Tooltip({ x, y, text, visible }: { x: number; y: number; text: string; visible: boolean }) {
  if (!visible || !text) return null;
  return (
    <div
      className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg bg-foreground text-background text-xs font-medium shadow-lg max-w-[280px] text-center leading-relaxed"
      style={{ left: x, top: y - 44, transform: 'translateX(-50%)' }}
    >
      {text}
    </div>
  );
}

// ── Arc Segment ──────────────────────────────────────────
interface ArcProps {
  r1: number; r2: number; a1: number; a2: number;
  fill: string; stroke?: string; strokeWidth?: number;
  label?: string; fontSize?: number; textColor?: string;
  maxCharsPerLine?: number; maxLines?: number;
  verticalText?: boolean;
  onHover?: (e: React.MouseEvent, text: string) => void;
  onLeave?: () => void;
  onClick?: (label: string, fill: string) => void;
}

function ArcSegment({
  r1, r2, a1, a2, fill,
  stroke = '#ffffff', strokeWidth = 1.5,
  label, fontSize = 11, textColor = '#fff',
  maxCharsPerLine = 12, maxLines = 3,
  verticalText = false,
  onHover, onLeave, onClick,
}: ArcProps) {
  const angleDiff = a2 - a1;
  if (angleDiff < 0.5) return null;

  const ma = midAngle(a1, a2);
  const mr = midRadius(r1, r2);
  const pos = polar(mr, ma);

  // Rotate text radially; flip if on bottom half so text is always readable
  let rotation = ma;
  if (ma > 90 && ma < 270) rotation += 180;

  // Available space
  const arcLen = (angleDiff * Math.PI / 180) * mr;
  const radialSpace = r2 - r1;

  if (verticalText && label) {
    // Vertical text: write along the radial direction, multi-line allowed
    const maxFontByArc = arcLen * 0.45;
    const adjustedFontSize = Math.max(6, Math.min(fontSize, maxFontByArc, 12));
    const showText = adjustedFontSize >= 5;

    // Rotate perpendicular so text reads along the radius
    // Flip on the left half (180-360°) so text always reads outward
    let textRotation = ma - 90;
    if (ma > 180) textRotation += 180;

    // Calculate how many chars fit per line (along radius) and how many lines fit (along arc)
    const charsPerLine = Math.floor(radialSpace / (adjustedFontSize * 0.65));
    const lineH = adjustedFontSize * 1.25;
    const availableLines = Math.max(1, Math.floor(arcLen / lineH));
    const lines = fitText(label, charsPerLine, availableLines);

    return (
      <g
        className="cursor-pointer"
        style={{ pointerEvents: 'all' }}
        onMouseMove={(e) => onHover?.(e, label || '')}
        onMouseLeave={onLeave}
        onClick={(e) => { e.stopPropagation(); onClick?.(label, fill); }}
      >
        <path
          d={arcPath(r1, r2, a1, a2)}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className="transition-all duration-200 hover:brightness-110 hover:opacity-90"
        />
        {showText && lines.length > 0 && (
          <text
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={textColor}
            fontSize={adjustedFontSize}
            fontWeight="600"
            fontFamily="inherit"
            transform={`rotate(${textRotation}, ${pos.x}, ${pos.y})`}
          >
            {lines.map((line, i) => (
              <tspan
                key={i}
                x={pos.x}
                dy={i === 0 ? -((lines.length - 1) * lineH) / 2 : lineH}
              >
                {line}
              </tspan>
            ))}
          </text>
        )}
        {!showText && <title>{label}</title>}
      </g>
    );
  }

  // Default horizontal/radial text
  const maxFontByArc = arcLen / 2.5;
  const maxFontByRadial = radialSpace * 0.28;
  const adjustedFontSize = Math.max(5, Math.min(fontSize, maxFontByArc, maxFontByRadial));

  const showText = adjustedFontSize >= 6 && label;
  const lines = showText ? fitText(label, maxCharsPerLine, maxLines) : [];
  const lineHeight = adjustedFontSize * 1.3;

  return (
      <g
        className="cursor-pointer"
        style={{ pointerEvents: 'all' }}
        onMouseMove={(e) => onHover?.(e, label || '')}
        onMouseLeave={onLeave}
        onClick={(e) => { e.stopPropagation(); onClick?.(label || '', fill); }}
      >
      <path
        d={arcPath(r1, r2, a1, a2)}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className="transition-all duration-200 hover:brightness-110 hover:opacity-90"
      />
      {lines.length > 0 && (
        <text
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontSize={adjustedFontSize}
          fontWeight="600"
          fontFamily="inherit"
          transform={`rotate(${rotation}, ${pos.x}, ${pos.y})`}
        >
          {lines.map((line, i) => (
            <tspan
              key={i}
              x={pos.x}
              dy={i === 0 ? -((lines.length - 1) * lineHeight) / 2 : lineHeight}
            >
              {line}
            </tspan>
          ))}
        </text>
      )}
      {!showText && label && <title>{label}</title>}
    </g>
  );
}

// ── Main Component ───────────────────────────────────────
export function StrategicMap({ pillars, goals, initiatives }: Props) {
  const { t } = useLanguage();
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, text: '', visible: false });
  const [selectedItem, setSelectedItem] = useState<{ text: string; color: string } | null>(null);

  const handleHover = (e: React.MouseEvent, text: string) => {
    setTooltip({ x: e.clientX, y: e.clientY, text, visible: true });
  };
  const handleLeave = () => setTooltip(prev => ({ ...prev, visible: false }));
  const handleClick = (text: string, color: string) => {
    if (text) setSelectedItem({ text, color });
  };

  const data = useMemo(() => {
    return pillars.map(pillar => {
      const pGoals = goals.filter(g => g.pillar_id === pillar.id);
      const pInits = initiatives.filter(i => i.pillar_id === pillar.id);

      const goalsWithInits = pGoals.map(goal => {
        const gInits = pInits.filter(i => i.goal_id === goal.id);
        return { ...goal, initiatives: gInits };
      });

      const orphanInits = pInits.filter(i => !i.goal_id || !pGoals.find(g => g.id === i.goal_id));

      const weight = Math.max(
        goalsWithInits.reduce((s, g) => s + Math.max(g.initiatives.length, 1), 0) + orphanInits.length,
        1
      );

      return { pillar, goals: goalsWithInits, orphanInits, weight };
    });
  }, [pillars, goals, initiatives]);

  const totalWeight = data.reduce((s, d) => s + d.weight, 0);

  // Enlarged radii
  const R_CENTER = 90;
  const R1_IN = 98, R1_OUT = 185;
  const R2_IN = 190, R2_OUT = 310;
  const R3_IN = 316, R3_OUT = 490;

  let currentAngle = 0;
  const pillarArcs: { a1: number; a2: number; pillar: Pillar }[] = [];
  const goalArcs: { a1: number; a2: number; goal: Goal; color: string }[] = [];
  const initArcs: { a1: number; a2: number; init: Initiative; color: string }[] = [];

  for (const d of data) {
    const pillarSpan = (d.weight / totalWeight) * 360;
    const a1 = currentAngle + GAP / 2;
    const a2 = currentAngle + pillarSpan - GAP / 2;

    pillarArcs.push({ a1, a2, pillar: d.pillar });

    let goalAngle = a1;
    const goalItems = [...d.goals];
    if (d.orphanInits.length > 0) {
      goalItems.push({
        id: '__orphan_' + d.pillar.id,
        name_ar: '',
        name_en: '',
        pillar_id: d.pillar.id,
        sort_order: 999,
        initiatives: d.orphanInits,
      } as any);
    }

    for (const gData of goalItems) {
      const gInits = (gData as any).initiatives || [];
      const gWeight = Math.max(gInits.length, 1);
      const goalSpan = (gWeight / d.weight) * pillarSpan;
      const ga1 = goalAngle + GAP / 2;
      const ga2 = goalAngle + goalSpan - GAP / 2;

      if (ga2 > ga1) {
        goalArcs.push({ a1: ga1, a2: ga2, goal: gData, color: d.pillar.color });

        let initAngle = ga1;
        if (gInits.length > 0) {
          const initSpan = (ga2 - ga1) / gInits.length;
          for (const init of gInits) {
            const ia1 = initAngle + GAP / 4;
            const ia2 = initAngle + initSpan - GAP / 4;
            if (ia2 > ia1) {
              initArcs.push({ a1: ia1, a2: ia2, init, color: d.pillar.color });
            }
            initAngle += initSpan;
          }
        }
      }
      goalAngle += goalSpan;
    }

    currentAngle += pillarSpan;
  }

  const VB = CX * 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="section-header">
        <h2 className="font-bold text-lg text-foreground">
          {t('الخريطة الاستراتيجية', 'Strategic Map')}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {t('الركائز ← الأهداف الاستراتيجية ← المبادرات', 'Pillars → Strategic Goals → Initiatives')}
        </p>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card p-6 overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="relative w-full max-w-[960px] mx-auto overflow-hidden">
          <svg viewBox={`0 0 ${VB} ${VB}`} className="w-full h-auto" style={{ fontFamily: 'inherit' }}>
            {/* Ring 3 – Initiatives (outermost, lighter) */}
            {initArcs.map(({ a1, a2, init, color }, i) => (
              <ArcSegment
                key={`init-${i}`}
                r1={R3_IN} r2={R3_OUT}
                a1={a1} a2={a2}
                fill={adjustColor(color, 90)}
                stroke="#ffffff"
                strokeWidth={1}
                label={t(init.name_ar, init.name_en)}
                fontSize={9.5}
                textColor="#444"
                maxCharsPerLine={11}
                maxLines={4}
                verticalText={true}
                onHover={handleHover}
                onLeave={handleLeave}
                onClick={handleClick}
              />
            ))}

            {/* Ring 2 – Strategic Goals */}
            {goalArcs.map(({ a1, a2, goal, color }, i) => (
              <ArcSegment
                key={`goal-${i}`}
                r1={R2_IN} r2={R2_OUT}
                a1={a1} a2={a2}
                fill={adjustColor(color, 20)}
                stroke="#ffffff"
                strokeWidth={1.5}
                label={goal.name_ar ? t(goal.name_ar, goal.name_en) : ''}
                fontSize={13}
                textColor="#fff"
                maxCharsPerLine={14}
                maxLines={3}
                verticalText={true}
                onHover={handleHover}
                onLeave={handleLeave}
                onClick={handleClick}
              />
            ))}

            {/* Ring 1 – Pillars */}
            {pillarArcs.map(({ a1, a2, pillar }, i) => (
              <ArcSegment
                key={`pillar-${i}`}
                r1={R1_IN} r2={R1_OUT}
                a1={a1} a2={a2}
                fill={pillar.color}
                stroke="#ffffff"
                strokeWidth={2}
                label={t(pillar.name_ar, pillar.name_en)}
                fontSize={15}
                textColor="#fff"
                maxCharsPerLine={10}
                maxLines={2}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            ))}

            {/* Center circle */}
            <circle cx={CX} cy={CY} r={R_CENTER} fill="white" stroke="hsl(var(--border))" strokeWidth={2} />
            <text x={CX} y={CY - 14} textAnchor="middle" dominantBaseline="central" fill="hsl(var(--foreground))" fontSize="14" fontWeight="700" fontFamily="inherit">
              {t('الخطة الاستراتيجية', 'Strategic Plan')}
            </text>
            <text x={CX} y={CY + 10} textAnchor="middle" dominantBaseline="central" fill="hsl(var(--muted-foreground))" fontSize="13" fontWeight="600" fontFamily="inherit">
              NAUSS-2029
            </text>
          </svg>

          {/* Selected item overlay - contained within map frame only */}
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden"
              onClick={() => setSelectedItem(null)}
            >
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
              <div
                className="relative max-w-md w-full mx-4 p-6 rounded-2xl shadow-2xl border border-border/60 cursor-pointer max-h-[80%] overflow-y-auto"
                style={{ background: selectedItem.color, color: '#fff' }}
                onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
              >
                <p className="text-lg font-bold leading-relaxed text-center">
                  {selectedItem.text}
                </p>
                <p className="text-xs text-white/70 text-center mt-3">
                  {t('اضغط للإغلاق', 'Click to close')}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Tooltip {...tooltip} />
    </motion.div>
  );
}
