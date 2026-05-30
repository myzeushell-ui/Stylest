import { NavLink, Outlet, Link } from 'react-router-dom';
import { t } from '../i18n';

// Нижняя навигация — мобильный-первый паттерн.
const tabs = [
  { to: '/', label: t.nav.home, icon: '🏠', end: true },
  { to: '/wardrobe', label: t.nav.wardrobe, icon: '👕' },
  { to: '/beauty', label: t.nav.beauty, icon: '✨' },
  { to: '/fitness', label: t.nav.fitness, icon: '🏃' },
  { to: '/styledna', label: t.nav.styledna, icon: '🧬' },
];

export function AppShell() {
  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col relative">
      <div className="flex items-center justify-between px-5 pt-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-xl bg-ink text-accent font-bold">О</span>
          <span className="font-bold text-lg tracking-tight">{t.app.name}</span>
        </Link>
        <Link to="/profile" className="btn-ghost text-sm">
          {t.nav.profile}
        </Link>
      </div>

      <main className="flex-1 px-4 py-4 pb-28">
        <Outlet />
      </main>

      {/* Плавающая кнопка AI-стилиста — всегда под рукой (голос/текст) */}
      <Link
        to="/chat"
        className="fixed bottom-24 right-[max(1rem,calc(50%-13rem))] z-20 grid place-items-center w-14 h-14 rounded-full bg-ink text-accent shadow-lg active:scale-95 transition"
        title="AI-стилист"
      >
        <span className="text-2xl">💬</span>
      </Link>

      <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/85 backdrop-blur-xl border-t border-black/5 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition ${
                  isActive ? 'text-ink font-semibold' : 'text-ink/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-lg transition ${isActive ? 'scale-110' : ''}`}>{tab.icon}</span>
                  {tab.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
