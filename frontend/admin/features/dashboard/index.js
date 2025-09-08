/**
 * Dashboard Feature exports
 * Este archivo facilita la importación de componentes y servicios del dashboard desde otros módulos
 */

// Components
export { default as Dashboard } from './Dashboard';
export { default as MetricCard } from './components/MetricCard';
export { default as ActionCard } from './components/ActionCard';
export { default as AlertCard } from './components/AlertCard';
export { default as ActivityCalendar } from './components/ActivityCalendar';

export { default as RecentTickets } from './components/RecentTickets';
export { default as LeadTracker } from './components/LeadTracker';

// Store y Hooks
export { useDashboardStore } from './lib/store/dashboard-store';
export { useDashboardRefresh } from './lib/hooks/useDashboardRefresh';

// Services
export {
  fetchDashboardMetrics,
  fetchDashboardAlerts,
  fetchQuickActions,
  fetchRecentLeads,
  fetchRecentTickets,

  fetchCalendarActivities
} from './lib/services/api';

// Adapters
export {
  metricsAdapter,
  alertsAdapter,
  actionsAdapter,
  leadsAdapter,
  ticketsAdapter,

  calendarActivitiesAdapter
} from './lib/adapters';

// Data (opcional, sólo para testing)
export {
  dashboardMetrics,
  overviewAlerts,
  quickActions,
  recentLeads,
  recentTickets,

} from './lib/config/mockedData';
