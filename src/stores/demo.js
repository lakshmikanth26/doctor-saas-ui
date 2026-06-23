import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const DEMO_STEPS = [
  {
    id: 'dashboard',
    path: '/dashboard',
    icon: '🏠',
    title: 'Dashboard — Your clinic at a glance',
    insight: `The dashboard gives you a real-time snapshot of your clinic's heartbeat. See today's appointments, patients in queue, revenue, and low-stock alerts — all before your first patient walks in. Everything updates live so you never miss a beat.`,
    tip: 'Tip: Bookmark this page — it\'s the first thing your staff should open every morning.',
  },
  {
    id: 'patients-new',
    path: '/patients/new',
    icon: '👤',
    title: 'Patient Registration — Under 60 seconds',
    insight: `Adding a patient takes less than a minute. Mednest auto-generates a unique MRN (Medical Record Number) so you never duplicate records. Enter name, phone, date of birth, and optional details like blood group and emergency contact — that's it.`,
    tip: 'Tip: Phone number doubles as the login for patient portal access (coming soon).',
    mockFill: {
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '9876543210',
      email: 'priya.sharma@gmail.com',
      dateOfBirth: '1990-05-15',
      gender: 'FEMALE',
      bloodGroup: 'B+',
      address: '14, MG Road, Bengaluru 560001',
    },
  },
  {
    id: 'patients',
    path: '/patients',
    icon: '👥',
    title: 'Patient List — Your entire practice in one view',
    insight: `Search 10,000+ patients instantly by name, phone, or MRN. Each card shows the last visit date so you can spot patients who haven't been back in a while. Click any patient to open their full medical history, invoices, and appointments.`,
    tip: 'Tip: The search is fuzzy — "Priy" will find "Priya", "Priyanka", and "Priyesh".',
  },
  {
    id: 'appointments-new',
    path: '/appointments/new',
    icon: '📅',
    title: 'Appointments — Smart scheduling that runs itself',
    insight: `Book appointments in 3 clicks: pick the patient, choose a doctor, and select an open slot. Mednest automatically assigns a token number and sends an SMS confirmation. The patient can check their queue position from home before leaving.`,
    tip: 'Tip: Set doctor working hours in Settings → Staff to control which slots appear.',
    mockFill: {
      type: 'SCHEDULED',
      reason: 'Routine check-up and blood pressure monitoring',
    },
  },
  {
    id: 'appointments',
    path: '/appointments',
    icon: '🗓️',
    title: 'Appointment Queue — Your day, organised',
    insight: `Every appointment shows status, token number, patient name, and doctor. Change status with one click: Waiting → In Progress → Completed. The queue auto-refreshes so your front desk and doctors always see the same live view.`,
    tip: 'Tip: The 📺 Queue Display button opens a TV-friendly screen you can put in the waiting room.',
  },
  {
    id: 'emr',
    path: '/patients',
    icon: '🩺',
    title: 'EMR / Medical Records — SOAP in seconds',
    insight: `Each visit gets a structured SOAP note: Subjective (what the patient says), Objective (what you observe), Assessment (your diagnosis with ICD-10 codes), Plan (what's next). Vitals auto-calculate BMI. Every visit is timestamped and immutable — no accidental edits.`,
    tip: 'Tip: Open any patient → click a visit date to see the full SOAP note from that day.',
  },
  {
    id: 'prescriptions',
    path: '/prescriptions',
    icon: '💊',
    title: 'Prescriptions — Digital & printable',
    insight: `Create prescriptions linked to a visit. Add medicines from your drug library, set dosage, frequency, and duration in plain English ("twice daily for 5 days"). Print with your clinic letterhead or share a PDF link directly to the patient's phone.`,
    tip: 'Tip: Repeat prescriptions for follow-ups are pre-filled from the last visit — one click to duplicate.',
  },
  {
    id: 'billing',
    path: '/billing',
    icon: '💰',
    title: 'Billing — Get paid in under 2 minutes',
    insight: `Generate a GST-ready invoice linked to any appointment. Accept Cash, UPI, Card, or Bank Transfer in the same step. Partial payments are tracked automatically — the invoice stays "PARTIALLY PAID" until settled. Download PDF or WhatsApp the link to the patient.`,
    tip: 'Tip: Bulk-select pending invoices and send payment reminders in one click.',
  },
  {
    id: 'inventory',
    path: '/inventory',
    icon: '📦',
    title: 'Inventory — Never run out again',
    insight: `Track every medicine, consumable, and equipment item. Set a reorder level and Mednest automatically flags items that need restocking. Every prescription auto-deducts from inventory so your stock count is always accurate without manual counting.`,
    tip: 'Tip: The Low Stock tab shows only items below reorder level — check it every Monday morning.',
  },
  {
    id: 'staff',
    path: '/staff',
    icon: '👥',
    title: 'Staff Management — Your whole team in one place',
    insight: `Manage doctors, nurses, receptionists, and admin staff with role-based access. Track leave requests with approval workflow, log attendance, and set which branches each staff member can access. Doctors only see their own patients; admins see everything.`,
    tip: 'Tip: Set a staff member\'s role to DOCTOR to make them appear in the appointment booking dropdown.',
  },
  {
    id: 'website',
    path: '/website',
    icon: '🌐',
    title: 'Website Builder — Your clinic, online in 5 minutes',
    insight: `Every clinic on Mednest gets a free public website at yourclinic.mednest.app. Add your services, team, gallery, and a blog. Patients can book appointments directly from your website. No developer or hosting costs — ever.`,
    tip: 'Tip: Add a WhatsApp button to your website — it\'s the #1 driver of new patient inquiries in India.',
  },
  {
    id: 'patient-portal',
    path: '/portal/city-medical-demo',
    icon: '🏥',
    title: 'Patient Portal — Book without calling the clinic',
    insight: `Patients visit your public portal link and book appointments themselves — no app download, no login, no phone call needed. They pick a doctor, choose a date on the calendar, and select an open time slot. Busy slots are shown in red so there\'s no double-booking. Works on any phone.`,
    tip: 'Tip: Share your portal link as /portal/your-clinic-slug — patients land directly on your clinic\'s booking page.',
  },
  {
    id: 'queue-display',
    path: '/queue/demo',
    icon: '📺',
    title: 'Queue Display — Zero waiting-room anxiety',
    insight: `After booking, every patient gets a token number. They track their position live from this public screen — no login required. Put it on a waiting-room TV, share the URL on WhatsApp, or embed it on your website. When token 4 moves to "Now Serving", token 5 knows to get ready.`,
    tip: 'Tip: The URL is /queue/your-clinic-slug — shareable as a QR code at your reception desk.',
  },
  {
    id: 'settings',
    path: '/settings',
    icon: '⚙️',
    title: 'Settings — Set up once, run forever',
    insight: `Configure your clinic name, logo, address, GST number, working hours, and multi-branch details here. Everything you set appears on invoices, prescriptions, and your website automatically. Change your billing prefix, time zone, or currency in seconds.`,
    tip: 'Tip: Add your digital signature image here to make prescriptions legally valid for printing.',
  },
]

export const useDemoStore = defineStore('demo', () => {
  const active = ref(false)
  const step = ref(0)
  const minimised = ref(false)

  const currentStep = computed(() => DEMO_STEPS[step.value] || DEMO_STEPS[0])
  const isFirst = computed(() => step.value === 0)
  const isLast = computed(() => step.value === DEMO_STEPS.length - 1)
  const progress = computed(() => Math.round(((step.value + 1) / DEMO_STEPS.length) * 100))

  function start() {
    active.value = true
    step.value = 0
    minimised.value = false
    localStorage.setItem('demo_active', '1')
    localStorage.setItem('demo_step', '0')
  }

  function next() {
    if (step.value < DEMO_STEPS.length - 1) {
      step.value++
      localStorage.setItem('demo_step', String(step.value))
    }
  }

  function prev() {
    if (step.value > 0) {
      step.value--
      localStorage.setItem('demo_step', String(step.value))
    }
  }

  function goTo(idx) {
    step.value = Math.max(0, Math.min(idx, DEMO_STEPS.length - 1))
    localStorage.setItem('demo_step', String(step.value))
  }

  function stop() {
    active.value = false
    step.value = 0
    minimised.value = false
    localStorage.removeItem('demo_active')
    localStorage.removeItem('demo_step')
  }

  function resume() {
    const savedStep = parseInt(localStorage.getItem('demo_step') || '0')
    if (localStorage.getItem('demo_active') && localStorage.getItem('demo_mode')) {
      active.value = true
      step.value = savedStep
    } else {
      // Clear any stale demo state
      localStorage.removeItem('demo_active')
      localStorage.removeItem('demo_step')
    }
  }

  return { active, step, minimised, currentStep, isFirst, isLast, progress, start, next, prev, goTo, stop, resume }
})
