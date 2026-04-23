import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Annotation, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraduationCap, MapPin, X } from 'lucide-react';

const GEO_URL = '/world-110m.json';

interface Institution {
  name_ar: string; name_en: string;
  city_ar: string; city_en: string;
  country_ar: string; country_en: string;
  region: string; color: string;
  coordinates: [number, number];
  offset: [number, number]; // label offset in px [dx, dy]
}

const institutions: Institution[] = [
  { name_ar: 'كلية الملك فهد الأمنية', name_en: 'King Fahd Security College', city_ar: 'الرياض', city_en: 'Riyadh', country_ar: 'المملكة العربية السعودية', country_en: 'Saudi Arabia', region: 'sa', color: '#2e6066', coordinates: [46.6753, 24.7136], offset: [40, 30] },
  { name_ar: 'كلية هنري لي', name_en: 'Henry Lee College', city_ar: 'نيو هيفن', city_en: 'New Haven', country_ar: 'الولايات المتحدة', country_en: 'United States', region: 'us', color: '#3b6bbf', coordinates: [-72.9279, 41.3083], offset: [-60, -30] },
  { name_ar: 'كلية جون جاي', name_en: 'John Jay College', city_ar: 'نيويورك', city_en: 'New York', country_ar: 'الولايات المتحدة', country_en: 'United States', region: 'us', color: '#3b6bbf', coordinates: [-73.9911, 40.7706], offset: [-90, 30] },
  { name_ar: 'مركز جورج سي مارشال', name_en: 'George C. Marshall Center', city_ar: 'غارميش', city_en: 'Garmisch', country_ar: 'ألمانيا', country_en: 'Germany', region: 'us', color: '#3b6bbf', coordinates: [11.0958, 47.4920], offset: [-50, -40] },
  { name_ar: 'CEPOL', name_en: 'CEPOL', city_ar: 'بودابست', city_en: 'Budapest', country_ar: 'المجر', country_en: 'Hungary', region: 'eu', color: '#7c3d9e', coordinates: [19.0402, 47.4979], offset: [40, -25] },
  { name_ar: "كينجز كوليدج لندن", name_en: "King's College London", city_ar: 'لندن', city_en: 'London', country_ar: 'المملكة المتحدة', country_en: 'United Kingdom', region: 'eu', color: '#7c3d9e', coordinates: [-0.1163, 51.5114], offset: [-80, -45] },
  { name_ar: 'جامعة ساسكس', name_en: 'University of Sussex', city_ar: 'برايتون', city_en: 'Brighton', country_ar: 'المملكة المتحدة', country_en: 'United Kingdom', region: 'eu', color: '#7c3d9e', coordinates: [-0.0875, 50.8662], offset: [-70, 35] },
  { name_ar: 'NFSU', name_en: 'NFSU', city_ar: 'غاندي ناغار', city_en: 'Gandhinagar', country_ar: 'الهند', country_en: 'India', region: 'as', color: '#c0392b', coordinates: [72.6369, 23.2156], offset: [40, 35] },
  { name_ar: 'جامعة الشعب الصيني للأمن العام', name_en: "Chinese People's Public Security University", city_ar: 'بكين', city_en: 'Beijing', country_ar: 'الصين', country_en: 'China', region: 'as', color: '#c0392b', coordinates: [116.4074, 39.9042], offset: [50, -35] },
  { name_ar: 'جامعة الشرطة الكورية', name_en: 'Korean National Police University', city_ar: 'أسان', city_en: 'Asan', country_ar: 'كوريا الجنوبية', country_en: 'South Korea', region: 'as', color: '#c0392b', coordinates: [127.0042, 36.7898], offset: [60, 30] },
  { name_ar: 'الجامعة الوطنية اللبنانية للعلوم الأمنية', name_en: 'Lebanese National University of Security Sciences', city_ar: 'بيروت', city_en: 'Beirut', country_ar: 'لبنان', country_en: 'Lebanon', region: 'me', color: '#16a085', coordinates: [35.5018, 33.8938], offset: [-60, -35] },
  { name_ar: 'معهد دراسات الدفاع الوطني', name_en: 'National Defense Studies Institute', city_ar: 'أبوظبي', city_en: 'Abu Dhabi', country_ar: 'الإمارات', country_en: 'UAE', region: 'me', color: '#16a085', coordinates: [54.3773, 24.4539], offset: [50, 25] },
];

const regions = [
  { id: 'sa', label_ar: 'السعودية', label_en: 'Saudi Arabia', color: '#2e6066' },
  { id: 'us', label_ar: 'أمريكا', label_en: 'USA', color: '#3b6bbf' },
  { id: 'eu', label_ar: 'أوروبا', label_en: 'Europe', color: '#7c3d9e' },
  { id: 'as', label_ar: 'آسيا', label_en: 'Asia', color: '#c0392b' },
  { id: 'me', label_ar: 'الشرق الأوسط', label_en: 'Middle East', color: '#16a085' },
];

export function BenchmarkWorldMap() {
  const { t, isRTL } = useLanguage();
  const [hovered, setHovered] = useState<Institution | null>(null);
  const [selected, setSelected] = useState<Institution | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const visible = activeRegion ? institutions.filter(i => i.region === activeRegion) : institutions;

  return (
    <div className="space-y-4">
      {/* Region filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveRegion(null)}
          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
          style={{
            borderColor: !activeRegion ? '#c9a96e' : 'hsl(var(--border))',
            background: !activeRegion ? '#c9a96e15' : 'transparent',
            color: !activeRegion ? '#c9a96e' : 'hsl(var(--muted-foreground))',
          }}
        >
          {t('الكل', 'All')} ({institutions.length})
        </button>
        {regions.map(r => {
          const count = institutions.filter(i => i.region === r.id).length;
          const active = activeRegion === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRegion(active ? null : r.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                borderColor: `${r.color}${active ? 'ff' : '40'}`,
                background: `${r.color}${active ? '25' : '10'}`,
                color: r.color,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
              {t(r.label_ar, r.label_en)} ({count})
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="relative rounded-2xl border bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 overflow-hidden shadow-inner">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 165 }}
          style={{ width: '100%', height: 'auto', maxHeight: 560 }}
        >
          <ZoomableGroup center={[20, 25]} zoom={1} minZoom={1} maxZoom={5}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: 'hsl(var(--muted))', stroke: 'hsl(var(--border))', strokeWidth: 0.4, outline: 'none' },
                      hover: { fill: 'hsl(var(--muted-foreground) / 0.2)', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {visible.map((inst, i) => {
              const isActive = hovered?.name_en === inst.name_en || selected?.name_en === inst.name_en;
              return (
                <Marker key={i} coordinates={inst.coordinates}>
                  <circle r={10} fill={inst.color} opacity={0.15}>
                    <animate attributeName="r" from="6" to="14" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle
                    r={isActive ? 6 : 4}
                    fill={inst.color}
                    stroke="white"
                    strokeWidth={1.5}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={() => setHovered(inst)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(inst)}
                  />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {hovered && !selected && (
          <div
            className="absolute top-4 px-3 py-2 rounded-lg bg-card border shadow-lg pointer-events-none text-xs"
            style={{ [isRTL ? 'right' : 'left']: 16, borderColor: `${hovered.color}50` }}
          >
            <div className="font-bold text-foreground">{t(hovered.name_ar, hovered.name_en)}</div>
            <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {t(hovered.city_ar, hovered.city_en)}, {t(hovered.country_ar, hovered.country_en)}
            </div>
          </div>
        )}

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-4 rounded-xl bg-card border shadow-xl"
              style={{ borderColor: `${selected.color}60` }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 end-2 p-1 rounded-md hover:bg-muted transition"
                aria-label="close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${selected.color}15` }}
                >
                  <GraduationCap className="h-5 w-5" style={{ color: selected.color }} />
                </div>
                <div className="flex-1 min-w-0 pe-6">
                  <h4 className="font-bold text-foreground text-sm leading-tight">
                    {t(selected.name_ar, selected.name_en)}
                  </h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {t(selected.city_ar, selected.city_en)}, {t(selected.country_ar, selected.country_en)}
                  </p>
                  <span
                    className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: `${selected.color}15`, color: selected.color }}
                  >
                    {t(regions.find(r => r.id === selected.region)?.label_ar || '', regions.find(r => r.id === selected.region)?.label_en || '')}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {t('انقر على أي علامة لعرض تفاصيل المؤسسة • استخدم العجلة للتكبير', 'Click any marker for details • Scroll to zoom')}
      </p>
    </div>
  );
}
