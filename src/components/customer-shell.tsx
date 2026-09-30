import { Link } from '@tanstack/react-router';
import { Bot, CalendarPlus, Home, LayoutDashboard, UserRound } from 'lucide-react';
import { Brand } from './brand';
import { Button } from './ui/button';
import { LanguageToggle } from './language-toggle';
import { useT } from '@/lib/i18n';
export function CustomerShell({children}:{children:React.ReactNode}){
 const t=useT();
 const items=[{to:'/' as const,label:'Home',icon:Home},{to:'/book' as const,label:'Book',icon:CalendarPlus},{to:'/portal' as const,label:'My storage',icon:UserRound}];
 return <div className="min-h-screen bg-background text-foreground">
  <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
   <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
    <Link to="/" aria-label="BoxHarbour home" className="min-w-0"><Brand className="[&>span:last-child]:hidden sm:[&>span:last-child]:inline"/></Link>
    <nav className="hidden items-center gap-1 lg:flex">{items.map(i=><Button asChild variant="ghost" key={i.to}><Link to={i.to} activeOptions={{exact:i.to==='/'}} activeProps={{className:'bg-accent text-accent-foreground'}}><i.icon/>{t(i.label)}</Link></Button>)}</nav>
    <div className="flex min-w-0 items-center gap-2">
     <LanguageToggle/>
     <Button asChild variant="boxie" className="hidden md:inline-flex"><Link to="/assistant"><Bot/>{t('Ask Boxie')}</Link></Button>
     <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex"><Link to="/staff"><LayoutDashboard/>{t('Staff')}</Link></Button>
    </div>
   </div>
  </header>
  <main className="pb-24 lg:pb-0">{children}</main>
  <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 items-end border-t bg-background px-2 pb-[max(env(safe-area-inset-bottom),0.375rem)] pt-1.5 lg:hidden">
   {[items[0],null,items[1],items[2]].map((i,idx)=>i?<Link key={i.to} to={i.to} activeOptions={{exact:i.to==='/'}} activeProps={{className:'text-primary'}} inactiveProps={{className:'text-muted-foreground'}} className="flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-medium"><i.icon className="size-5"/><span className="truncate">{t(i.label)}</span></Link>
   :<Link key={idx} to="/assistant" className="-mt-6 flex min-w-0 flex-col items-center gap-1 text-[11px] font-bold text-accent-strong-ink"><span className="grid size-14 place-items-center rounded-full bg-accent-strong text-accent-strong-foreground shadow-boxie ring-4 ring-background"><Bot className="size-6"/></span><span className="truncate">{t('Ask Boxie')}</span></Link>)}
  </nav>
 </div>
}
