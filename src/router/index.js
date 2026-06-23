import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public
    { path: '/', component: () => import('@/pages/LandingPage.vue'), meta: { public: true } },
    { path: '/login', component: () => import('@/pages/LoginPage.vue'), meta: { public: true } },
    { path: '/register', component: () => import('@/pages/RegisterPage.vue'), meta: { public: true } },
    { path: '/queue/:orgSlug', component: () => import('@/pages/QueueDisplayPage.vue'), meta: { public: true } },
    { path: '/portal', component: () => import('@/pages/portal/PatientPortal.vue'), meta: { public: true } },
    { path: '/portal/:orgSlug', component: () => import('@/pages/portal/PatientPortal.vue'), meta: { public: true } },
    { path: '/payment/status', component: () => import('@/pages/PaymentStatusPage.vue'), meta: { public: true } },

    // App shell
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      redirect: '/dashboard',
      children: [
        { path: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },

        // Patients
        { path: 'patients', component: () => import('@/pages/patients/PatientsPage.vue') },
        { path: 'patients/new', component: () => import('@/pages/patients/PatientFormPage.vue') },
        { path: 'patients/:id', component: () => import('@/pages/patients/PatientDetailPage.vue') },
        { path: 'patients/:id/edit', component: () => import('@/pages/patients/PatientFormPage.vue') },

        // Appointments
        { path: 'appointments', component: () => import('@/pages/appointments/AppointmentsPage.vue') },
        { path: 'appointments/new', component: () => import('@/pages/appointments/AppointmentFormPage.vue') },

        // EMR
        { path: 'visits/:visitId', component: () => import('@/pages/emr/VisitPage.vue') },

        // Billing
        { path: 'billing', component: () => import('@/pages/billing/BillingPage.vue') },
        { path: 'billing/new', component: () => import('@/pages/billing/InvoiceFormPage.vue') },
        { path: 'billing/:id', component: () => import('@/pages/billing/InvoiceDetailPage.vue') },

        // Prescriptions
        { path: 'prescriptions', component: () => import('@/pages/prescriptions/PrescriptionsPage.vue') },

        // Inventory
        { path: 'inventory', component: () => import('@/pages/inventory/InventoryPage.vue') },

        // Staff
        { path: 'staff', component: () => import('@/pages/staff/StaffPage.vue') },
        { path: 'staff/:id', component: () => import('@/pages/staff/StaffDetailPage.vue') },
        { path: 'staff/leave', component: () => import('@/pages/staff/LeaveRequestsPage.vue') },
        { path: 'staff/attendance', component: () => import('@/pages/staff/AttendancePage.vue') },

        // Website Builder
        { path: 'website', component: () => import('@/pages/website/WebsitePage.vue') },

        // CRM (admin only)
        { path: 'crm', component: () => import('@/pages/crm/CRMPage.vue') },

        // Settings
        { path: 'settings', component: () => import('@/pages/SettingsPage.vue') },
      ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('access_token')
  if (!to.meta.public && !token) return '/login'
  if (to.meta.public && token && (to.path === '/login' || to.path === '/register')) return '/dashboard'
})

export default router
