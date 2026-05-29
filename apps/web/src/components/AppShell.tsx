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
    <div className="min-h-screen max-w-md mx-auto flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <Link to="/" className="font-bold text-lg">
          {t.app.name}
        </Link>
        <Link to="/profile" className="btn-ghost text-sm">
          {t.nav.profile}
        </Link>
      </div>

      <main className="flex-1 px-4 py-4 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/90 backdrop-blur border-t border-black/5">
        <div className="grid grid-cols-5">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] ${isActive ? 'text-ink font-semibold' : 'text-ink/45'}`
              }
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
