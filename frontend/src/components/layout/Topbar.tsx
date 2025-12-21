import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Menu, ChevronRight, Settings } from 'lucide-react';
import { NotificationCenter } from '@/components/NotificationCenter';

interface TopbarProps {
  onMenuToggle: () => void;
}

/**
 * Full-path titles (for specific routes)
 * Keep this updated with all exact routes (including nested ones) that you use.
 */
const pathTitles: Record<string, string> = {
  '/dashboard/executive': 'Executive Dashboard',

  // Dashboard sections (section home pages)
  '/dashboard/sales': 'Sales & Marketing',
  '/dashboard/manufacturing': 'Manufacturing',
  '/dashboard/qc': 'Quality Control',
  '/dashboard/warehouse': 'Warehouse & Logistics',
  '/dashboard/finance': 'Finance & Accounts',
  '/dashboard/hr': 'Human Resources',
  '/dashboard/fieldops': 'Field Operations',
  '/dashboard/rnd': 'R&D',

  // Admin
  '/admin/users': 'User Management',
  '/admin/roles': 'Roles & Permissions',
  '/admin/audit': 'Audit Logs',
  '/admin/settings': 'Settings',

  // Sales subpages
  '/sales/dealers': 'Dealers',
  '/sales/orders': 'Orders',
  '/fieldops/farmers': 'Farmers',
  '/fieldops/campaigns': 'Campaigns',

  // Manufacturing subpages
  '/manufacturing/dashboard': 'Dashboard',
  '/manufacturing/production-plan': 'Production Plan',
  '/manufacturing/batches': 'Batches',
  '/manufacturing/machines': 'Machines',

  // HR subpages
  '/hr/employees': 'Employees',

  // QC subpages
  '/qc/tests': 'QC Tests',

  // Warehouse subpages
  '/warehouse/inventory': 'Inventory',

  // Finance subpages
  '/finance/invoices': 'Invoices',
  '/finance/payments': 'Payments',

  // Field operations
  '/fieldops/visits': 'Field Visits',

  // R&D
  '/rnd/trials': 'R&D Trials',
};

/**
 * Maps canonical section keys to a user-friendly label and canonical base path.
 * Use the basePath that matches how your router defines the section landing route.
 * If your app uses '/dashboard/sales' as the sales landing, set basePath accordingly.
 */
const sectionMap: Record<string, { label: string; basePath: string }> = {
  sales: { label: 'Sales & Marketing', basePath: '/dashboard/sales' },
  manufacturing: { label: 'Manufacturing', basePath: '/dashboard/manufacturing' },
  qc: { label: 'Quality Control', basePath: '/dashboard/qc' },
  warehouse: { label: 'Warehouse & Logistics', basePath: '/dashboard/warehouse' },
  finance: { label: 'Finance & Accounts', basePath: '/dashboard/finance' },
  hr: { label: 'Human Resources', basePath: '/dashboard/hr' },
  fieldops: { label: 'Field Operations', basePath: '/dashboard/fieldops' },
  rnd: { label: 'R&D', basePath: '/dashboard/rnd' },
  admin: { label: 'Administration', basePath: '/admin/users' },
  // also allow top-level sections like '/sales', '/manufacturing' etc:
  'sales-root': { label: 'Sales & Marketing', basePath: '/sales' },
  'manufacturing-root': { label: 'Manufacturing', basePath: '/manufacturing' },
  'warehouse-root': { label: 'Warehouse & Logistics', basePath: '/warehouse' },
  // add more if needed
};

/**
 * Utility: friendly fallback label from a path segment
 */
const labelFromSegment = (s: string) =>
  s
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

export const Topbar: React.FC<TopbarProps> = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  /**
   * Build breadcrumbs with the specific requirement:
   * Home (always -> /dashboard/executive) -> Section -> Subpage
   */
  const getBreadcrumbs = () => {
    const pathname = location.pathname;
    // normalize trailing slash
    const path = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
    const segments = path.split('/').filter(Boolean); // e.g. ['dashboard','sales','batches']

    // Start with Home -> points to executive dashboard
    const breadcrumbs: Array<{ label: string; path: string; isCurrent?: boolean }> = [
      { label: 'Home', path: '/dashboard/executive' },
    ];

    // If the full path matches a title exactly, we can pick section/subpage intelligently.
    // Determine sectionKey: prefer the second segment if first is 'dashboard', otherwise first segment.
    let sectionSegment = '';
    let subSegments: string[] = [];

    if (segments.length === 0) {
      // root path -> treat Home as current (but Home always goes to executive)
      return breadcrumbs;
    }

    if (segments[0] === 'dashboard') {
      // e.g. /dashboard/sales/batches  or /dashboard/sales
      sectionSegment = segments[1] || 'executive';
      subSegments = segments.slice(2); // rest are subpages
      // If only /dashboard or /dashboard/executive -> Home should be current
      if (!sectionSegment || sectionSegment === 'executive') {
        // mark Home as current
        breadcrumbs[0].isCurrent = true;
        return breadcrumbs;
      }
    } else {
      // path not under /dashboard, like /manufacturing/batches or /sales/dealers
      sectionSegment = segments[0];
      subSegments = segments.slice(1);
    }

    // Resolve section label and base path using sectionMap or pathTitles
    const potentialSectionKey = sectionSegment;
    let sectionLabel = '';
    let sectionBasePath = '';

    // Check canonical keys first (direct)
    if (sectionMap[potentialSectionKey]) {
      sectionLabel = sectionMap[potentialSectionKey].label;
      sectionBasePath = sectionMap[potentialSectionKey].basePath;
    } else if (sectionMap[`${potentialSectionKey}-root`]) {
      sectionLabel = sectionMap[`${potentialSectionKey}-root`].label;
      sectionBasePath = sectionMap[`${potentialSectionKey}-root`].basePath;
    } else {
      // try pathTitles for '/dashboard/<section>' or '/<section>'
      const dashPath = `/dashboard/${potentialSectionKey}`;
      const rootPath = `/${potentialSectionKey}`;
      if (pathTitles[dashPath]) {
        sectionLabel = pathTitles[dashPath];
        sectionBasePath = dashPath;
      } else if (pathTitles[rootPath]) {
        sectionLabel = pathTitles[rootPath];
        sectionBasePath = rootPath;
      } else {
        // fallback: humanize segment and point to `/dashboard/{section}` (common pattern)
        sectionLabel = labelFromSegment(potentialSectionKey);
        sectionBasePath = `/dashboard/${potentialSectionKey}`;
      }
    }

    // push section crumb
    breadcrumbs.push({ label: sectionLabel, path: sectionBasePath });

    // Subpage handling: if there is a specific subpage route (e.g. '/manufacturing/batches'),
    // compute fullSubPath and its title.
    if (subSegments.length > 0) {
      // build fullSubPath forms to check mapping:
      // try: /<section>/<sub> and /dashboard/<section>/<sub>
      const subPath1 = `/${sectionSegment}/${subSegments.join('/')}`;
      const subPath2 = `/dashboard/${sectionSegment}/${subSegments.join('/')}`;
      const subPath3 = `/${subSegments.join('/')}`; // fallback

      let subLabel = '';
      let subPath = '';

      if (pathTitles[subPath2]) {
        subLabel = pathTitles[subPath2];
        subPath = subPath2;
      } else if (pathTitles[subPath1]) {
        subLabel = pathTitles[subPath1];
        subPath = subPath1;
      } else if (pathTitles[path]) {
        // exact current path matched
        subLabel = pathTitles[path];
        subPath = path;
      } else {
        // fallback: label from last segment
        subLabel = labelFromSegment(subSegments[subSegments.length - 1]);
        // attempt to link to the most reasonable path
        subPath = subPath2; // default attempt
      }

      // push subpage crumb and mark as current
      breadcrumbs.push({ label: subLabel, path: subPath, isCurrent: true });
    } else {
      // No subpage: section is the current page
      breadcrumbs[breadcrumbs.length - 1].isCurrent = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Page title fallback: if current full path has a mapping use it; otherwise use last breadcrumb label
  const pageTitle =
    pathTitles[location.pathname] ||
    breadcrumbs.length > 1
      ? breadcrumbs[breadcrumbs.length - 1].label
      : 'Dashboard';

  return (
    <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1 text-sm" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={`${crumb.path}-${index}`}>
              {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              {crumb.isCurrent ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.path}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Mobile Title */}
        <h1 className="md:hidden font-semibold text-lg">{pageTitle}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-64">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
          />
          <kbd className="hidden xl:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        {/* Search Button (Mobile) */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Search">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <NotificationCenter />

        {/* Settings */}
        <Link to="/admin/settings" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Settings">
          <Settings className="w-5 h-5" />
        </Link>

        {/* User Avatar */}
        <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role ? user.role.replace('_', ' ') : ''}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {(user?.name && user.name.charAt(0)) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
  