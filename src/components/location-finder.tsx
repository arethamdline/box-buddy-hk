import { useState } from 'react';
import { Clock, List, LocateFixed, MapPin, Navigation, Search, TrainFront } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { locations } from '@/data/mock-data';
import { useT } from '@/lib/i18n';

type Loc = (typeof locations)[number];
function LocationRow({ l, nearest }: { l: Loc; nearest?: boolean }) {
  const t = useT();
  return (
    <div className="flex gap-3 rounded-lg border bg-card p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-primary"><MapPin className="size-5" /></span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{l.name}</h3>{nearest && <span className="rounded-full bg-accent-strong px-2 py-0.5 text-[11px] font-bold text-accent-strong-foreground">{t('Nearest')}</span>}</div>
        <p className="text-sm text-muted-foreground">{t(l.type)} · {l.km} km</p>
        <p className="mt-1 text-sm">{l.address}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span className="flex items-center gap-1"><TrainFront className="size-3.5" />{l.mtr}</span><span className="flex items-center gap-1"><Clock className="size-3.5" />{t(l.hours)}</span></div>
      </div>
      <Button size="icon" variant="ghost" aria-label={`${t('Directions')} ${l.name}`} className="shrink-0"><Navigation /></Button>
    </div>
  );
}

export function LocationFinder() {
  const t = useT();
  const [q, setQ] = useState('');
  const [all, setAll] = useState(false);
  const query = q.trim().toLowerCase();
  const matches = locations.filter((l) => !query || [l.name, l.district, l.address, l.mtr].some((x) => x.toLowerCase().includes(query)));
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <h2 className="font-display text-xl font-bold">{t('Find a service point')}</h2>
        <label htmlFor="loc-search" className="mt-4 block text-sm font-semibold">{t('Search your location')}</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input id="loc-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('District, street or MTR station')} className="h-12 w-full rounded-md border bg-background pl-10 pr-3 text-base outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button variant="outline" size="lg" onClick={() => setQ('Kwun Tong')}><LocateFixed />{t('Use my location')}</Button>
            <Button variant="secondary" size="lg" onClick={() => setAll(true)}><List />{t('View all locations')}</Button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {matches.length ? matches.slice(0, 2).map((l, i) => <LocationRow key={l.id} l={l} nearest={i === 0} />) : <p className="text-sm text-muted-foreground">{t('No matching locations')}</p>}
        </div>
      </CardContent>
      <Dialog open={all} onOpenChange={setAll}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{t('All locations')}</DialogTitle></DialogHeader>
          <div className="space-y-3">{locations.map((l, i) => <LocationRow key={l.id} l={l} nearest={i === 0} />)}</div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
