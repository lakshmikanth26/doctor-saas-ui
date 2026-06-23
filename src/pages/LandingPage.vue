<template>
  <div class="min-h-screen bg-white font-sans" :style="cssVars">

    <!-- ── NAV ── -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg" :style="{ background: clinic.gradient }">
            {{ clinic.emoji }}
          </div>
          <span class="text-xl font-black text-gray-900 tracking-tight">{{ clinic.brand }}</span>
        </div>
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" class="hover:text-gray-900 transition-colors">Features</a>
          <a href="#modules" class="hover:text-gray-900 transition-colors">Modules</a>
          <a href="#pricing" class="hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#faq" class="hover:text-gray-900 transition-colors">FAQ</a>
        </nav>
        <div class="flex items-center gap-3">
          <RouterLink to="/login" class="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors hidden md:block">Sign In</RouterLink>
          <button @click="startDemo" :disabled="demoLoading"
            class="text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
            :style="{ background: clinic.gradient }">
            <svg v-if="demoLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            {{ demoLoading ? 'Loading…' : isPersonalised ? `Hi ${clinicLabel} 👋` : '▶ Demo' }}
          </button>
        </div>
      </div>
    </header>

    <!-- ── HERO ── -->
    <section class="relative overflow-hidden pt-20 pb-28 px-6">
      <!-- Background blob -->
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-10 blur-3xl" :style="{ background: clinic.gradient }"></div>
        <div class="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-8 blur-3xl" :style="{ background: clinic.gradient }"></div>
      </div>

      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border" :style="{ color: clinic.color, borderColor: clinic.color + '40', background: clinic.color + '10' }">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" :style="{ background: clinic.color }"></span>
              {{ clinic.badge }}
            </div>

            <h1 class="text-5xl lg:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight mb-6">
              {{ clinic.headline }}
              <span class="block" :style="{ background: clinic.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }">
                {{ clinic.headlineSub }}
              </span>
            </h1>

            <p class="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              {{ clinic.subtext }}
            </p>

            <div class="flex flex-wrap gap-4 mb-10">
              <button @click="startDemo" :disabled="demoLoading"
                class="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-white font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-70"
                :style="{ background: clinic.gradient }">
                <svg v-if="demoLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                <span v-else>▶</span>
                {{ demoLoading ? 'Signing in…' : isPersonalised ? `See ${clinicLabel}'s Demo →` : 'Demo — See it live' }}
              </button>
              <RouterLink :to="`/register?clinic=${clinicParam}`"
                class="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-base border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
                Get Started Free →
              </RouterLink>
            </div>

            <!-- Social proof -->
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <div class="flex -space-x-2">
                <div v-for="(c, i) in avatarColors" :key="i" class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" :style="{ background: c }">{{ avatarInitials[i] }}</div>
              </div>
              <span><strong class="text-gray-800">500+</strong> clinics trust Mednest</span>
              <span class="hidden sm:flex items-center gap-1">⭐⭐⭐⭐⭐ <strong class="text-gray-800">4.9/5</strong></span>
            </div>
          </div>

          <!-- Dashboard mockup -->
          <div class="relative hidden lg:block">
            <div class="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800 ring-1 ring-white/10">
              <!-- Titlebar -->
              <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <div class="flex-1 mx-4 bg-gray-800 rounded-lg px-3 py-1 text-xs text-gray-400 text-center">app.mednest.in/dashboard</div>
              </div>
              <!-- App content -->
              <div class="flex h-[420px]">
                <!-- Sidebar -->
                <div class="w-48 bg-gray-900 border-r border-gray-800 p-3 space-y-1 shrink-0">
                  <div class="px-3 py-2 mb-3 flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold" :style="{ background: clinic.gradient }">{{ clinic.emoji }}</div>
                    <span class="text-white text-xs font-bold truncate">{{ clinic.demoName }}</span>
                  </div>
                  <div v-for="item in demoNav" :key="item.label" class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors" :class="item.active ? 'text-white font-semibold' : 'text-gray-400'" :style="item.active ? { background: clinic.color + '30' } : {}">
                    <span>{{ item.icon }}</span>
                    <span>{{ item.label }}</span>
                  </div>
                </div>
                <!-- Main -->
                <div class="flex-1 bg-gray-950 p-4 overflow-hidden">
                  <div class="text-white text-sm font-semibold mb-3">Good morning, Dr. {{ clinic.demoDoc }} 👋</div>
                  <div class="grid grid-cols-2 gap-2 mb-3">
                    <div v-for="s in demoStats" :key="s.label" class="bg-gray-900 rounded-xl p-3 border border-gray-800">
                      <div class="text-xl font-black" :style="{ color: clinic.color }">{{ s.value }}</div>
                      <div class="text-gray-500 text-xs mt-0.5">{{ s.label }}</div>
                    </div>
                  </div>
                  <!-- Queue -->
                  <div class="bg-gray-900 rounded-xl p-3 border border-gray-800">
                    <div class="text-gray-400 text-xs font-semibold mb-2">🟢 LIVE QUEUE TODAY</div>
                    <div v-for="p in demoQueue" :key="p.token" class="flex items-center gap-2 py-1.5 border-b border-gray-800 last:border-0">
                      <div class="w-6 h-6 rounded-lg text-white text-xs font-black flex items-center justify-center shrink-0" :style="{ background: p.active ? clinic.gradient : '#374151' }">{{ p.token }}</div>
                      <div class="flex-1 min-w-0">
                        <div class="text-white text-xs font-medium truncate">{{ p.name }}</div>
                        <div class="text-gray-500 text-xs">{{ p.status }}</div>
                      </div>
                      <div class="text-xs font-semibold px-2 py-0.5 rounded-full" :style="p.active ? { background: clinic.color + '20', color: clinic.color } : { background: '#374151', color: '#9ca3af' }">{{ p.label }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Floating cards -->
            <div class="absolute -right-6 top-16 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 w-52">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center text-base" :style="{ background: clinic.color + '15' }">📲</div>
                <span class="text-sm font-bold text-gray-800">SMS Sent!</span>
              </div>
              <p class="text-xs text-gray-500">Patient {{ clinic.smsName }} notified for appointment at 3:30 PM</p>
            </div>
            <div class="absolute -left-8 bottom-16 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 w-48">
              <div class="text-2xl font-black mb-1" :style="{ color: clinic.color }">₹{{ clinic.revenue }}</div>
              <div class="text-xs text-gray-500">Today's revenue</div>
              <div class="flex items-center gap-1 mt-1 text-green-600 text-xs font-semibold">
                <span>↑ 18%</span><span class="text-gray-400">vs yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TRUSTED BY ── -->
    <section class="border-y border-gray-100 bg-gray-50 py-10 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <p class="text-sm text-gray-400 font-medium uppercase tracking-widest mb-6">Trusted by clinics across India</p>
        <div class="flex flex-wrap justify-center gap-8 items-center">
          <div v-for="b in trustedBy" :key="b" class="text-gray-300 font-black text-lg tracking-tight">{{ b }}</div>
        </div>
      </div>
    </section>

    <!-- ── FEATURES ── -->
    <section id="features" class="py-24 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-4" :style="{ color: clinic.color, background: clinic.color + '12' }">
            ✦ Everything you need
          </div>
          <h2 class="text-4xl lg:text-5xl font-black text-gray-900 mb-4">One platform.<br>Zero chaos.</h2>
          <p class="text-xl text-gray-500 max-w-2xl mx-auto">{{ clinic.featuresSubtext }}</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feat in features" :key="feat.title"
            class="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-default">
            <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" :style="{ background: `linear-gradient(135deg, ${clinic.color}06, ${clinic.color}02)` }"></div>
            <div class="relative">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm" :style="{ background: clinic.color + '15' }">{{ feat.icon }}</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ feat.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ feat.desc }}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="tag in feat.tags" :key="tag" class="text-xs px-2.5 py-1 rounded-full font-medium" :style="{ background: clinic.color + '12', color: clinic.color }">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── MODULES DEEP DIVE ── -->
    <section id="modules" class="py-24 px-6 overflow-hidden" :style="{ background: `linear-gradient(135deg, ${clinic.color}08 0%, white 50%, ${clinic.color}05 100%)` }">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">Built for how {{ clinic.specialty }} clinics actually work</h2>
          <p class="text-xl text-gray-500">Every module designed around your daily workflows.</p>
        </div>

        <div class="space-y-24">
          <div v-for="(mod, i) in modules" :key="mod.title" class="grid lg:grid-cols-2 gap-12 items-center" :class="i % 2 === 1 ? 'lg:flex lg:flex-row-reverse' : ''">
            <div>
              <div class="inline-flex items-center gap-2 text-sm font-semibold mb-4 px-3 py-1.5 rounded-full border" :style="{ color: clinic.color, borderColor: clinic.color + '40', background: clinic.color + '10' }">
                {{ mod.icon }} {{ mod.tag }}
              </div>
              <h3 class="text-3xl font-black text-gray-900 mb-4">{{ mod.title }}</h3>
              <p class="text-lg text-gray-500 mb-6 leading-relaxed">{{ mod.desc }}</p>
              <ul class="space-y-3">
                <li v-for="point in mod.points" :key="point" class="flex items-start gap-3 text-gray-700">
                  <span class="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" :style="{ background: clinic.gradient }">✓</span>
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>
            <div class="bg-gray-900 rounded-3xl p-1 shadow-2xl border border-gray-800">
              <div class="bg-gray-950 rounded-2xl p-6">
                <div class="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">{{ mod.mockupTitle }}</div>
                <div v-if="mod.mockupType === 'queue'" class="space-y-2">
                  <div v-for="q in queueMockup" :key="q.token" class="flex items-center gap-3 bg-gray-900 rounded-xl p-3 border border-gray-800">
                    <div class="w-10 h-10 rounded-xl font-black text-lg flex items-center justify-center text-white shrink-0" :style="{ background: q.active ? clinic.gradient : '#374151' }">{{ q.token }}</div>
                    <div class="flex-1">
                      <div class="text-white text-sm font-semibold">{{ q.name }}</div>
                      <div class="text-gray-500 text-xs">{{ q.doctor }}</div>
                    </div>
                    <span class="text-xs font-bold px-2 py-1 rounded-lg" :style="q.active ? { background: clinic.color + '25', color: clinic.color } : { background: '#1f2937', color: '#6b7280' }">{{ q.label }}</span>
                  </div>
                </div>
                <div v-else-if="mod.mockupType === 'emr'" class="space-y-3">
                  <div v-for="field in emrMockup" :key="field.label" class="bg-gray-900 rounded-xl p-3 border border-gray-800">
                    <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ field.label }}</div>
                    <div class="text-white text-sm">{{ field.value }}</div>
                  </div>
                </div>
                <div v-else-if="mod.mockupType === 'billing'" class="space-y-2">
                  <div v-for="inv in billingMockup" :key="inv.id" class="flex items-center gap-3 bg-gray-900 rounded-xl p-3 border border-gray-800">
                    <div class="flex-1">
                      <div class="text-white text-sm font-semibold">{{ inv.patient }}</div>
                      <div class="text-gray-500 text-xs">{{ inv.id }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-white text-sm font-bold">₹{{ inv.amount }}</div>
                      <span class="text-xs px-2 py-0.5 rounded-full font-medium" :style="inv.paid ? { background: '#16a34a20', color: '#4ade80' } : { background: '#f59e0b20', color: '#fbbf24' }">{{ inv.paid ? 'PAID' : 'PENDING' }}</span>
                    </div>
                  </div>
                </div>
                <div v-else-if="mod.mockupType === 'website'" class="space-y-3">
                  <div class="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                    <div class="text-2xl font-black text-white mb-1">{{ clinic.demoName }}</div>
                    <div class="text-xs text-gray-500 mb-3">{{ clinic.tagline }}</div>
                    <div class="h-px bg-gray-800 mb-3"></div>
                    <div class="grid grid-cols-3 gap-2 text-xs text-gray-400">
                      <div>🏥 About</div><div>📅 Book</div><div>📞 Contact</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="h-2 flex-1 rounded-full overflow-hidden bg-gray-800"><div class="h-full rounded-full w-4/5" :style="{ background: clinic.gradient }"></div></div>
                    <span class="text-gray-400 text-xs">Published ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── QUEUE DISPLAY HIGHLIGHT ── -->
    <section class="py-24 px-6 bg-gray-900 text-white overflow-hidden relative">
      <div class="absolute inset-0 opacity-20" :style="{ background: `radial-gradient(ellipse at 70% 50%, ${clinic.color} 0%, transparent 60%)` }"></div>
      <div class="max-w-7xl mx-auto relative grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div class="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border border-white/20 text-white/80 mb-6">
            📺 Patient Queue Display — FREE with every plan
          </div>
          <h2 class="text-4xl lg:text-5xl font-black mb-6 leading-tight">Patients see their token<br><span :style="{ color: clinic.color }">before they arrive.</span></h2>
          <p class="text-gray-400 text-lg mb-8 leading-relaxed">
            Every clinic gets a public queue display URL. Put it on your waiting room TV, WhatsApp it to patients, or embed it on your website. Updates live every 30 seconds — no refresh needed.
          </p>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="qf in queueFeatures" :key="qf" class="flex items-start gap-2 text-sm text-gray-300">
              <span class="mt-0.5" :style="{ color: clinic.color }">✓</span>
              {{ qf }}
            </div>
          </div>
        </div>
        <!-- Queue TV mockup -->
        <div class="bg-gray-950 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
          <div class="p-4" :style="{ background: clinic.gradient }">
            <div class="flex items-center justify-between">
              <div><div class="text-white font-black text-lg">Patient Queue</div><div class="text-white/70 text-sm">{{ clinic.demoName }}</div></div>
              <div class="text-right"><div class="text-white font-mono text-2xl font-bold">10:42 AM</div><div class="text-white/70 text-xs">Saturday, 21 June 2025</div></div>
            </div>
          </div>
          <div class="p-4">
            <div class="rounded-2xl border-2 p-6 text-center mb-4" :style="{ borderColor: clinic.color + '40', background: clinic.color + '10' }">
              <div class="text-gray-400 text-sm font-semibold mb-1">🩺 NOW SERVING</div>
              <div class="font-black text-7xl text-white">07</div>
              <div class="text-gray-300 font-semibold mt-2">{{ clinic.queuePatient1 }}</div>
              <div class="text-gray-500 text-sm">Dr. {{ clinic.demoDoc }}</div>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div v-for="t in [8,9,10]" :key="t" class="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
                <div class="text-2xl font-black text-white">{{ String(t).padStart(2,'0') }}</div>
                <div class="text-gray-500 text-xs mt-1">{{ clinic.queueNames[t-8] }}</div>
                <div class="text-xs mt-1 font-medium" :style="{ color: clinic.color }">{{ t === 8 ? 'Next' : `${t-7} ahead` }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PRICING ── -->
    <section id="pricing" class="py-24 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">Simple, honest pricing</h2>
          <p class="text-xl text-gray-500">No per-patient fees. No hidden charges. Cancel anytime.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="plan in pricing" :key="plan.name"
            class="rounded-3xl p-8 border-2 transition-all relative"
            :class="plan.popular ? 'border-transparent shadow-2xl scale-105' : 'border-gray-100 hover:border-gray-200'"
            :style="plan.popular ? { background: clinic.gradient } : { background: 'white' }">
            <div v-if="plan.popular" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full shadow">MOST POPULAR</div>
            <div :class="plan.popular ? 'text-white' : 'text-gray-900'">
              <div class="text-lg font-black mb-2">{{ plan.name }}</div>
              <div class="flex items-end gap-1 mb-1">
                <span class="text-4xl font-black">₹{{ plan.price }}</span>
                <span class="text-sm mb-2 opacity-70">/month</span>
              </div>
              <p class="text-sm opacity-70 mb-6">{{ plan.desc }}</p>
              <ul class="space-y-2.5 mb-8">
                <li v-for="f in plan.features" :key="f" class="flex items-start gap-2 text-sm">
                  <span class="mt-0.5 font-bold" :style="plan.popular ? { color: 'rgba(255,255,255,0.8)' } : { color: clinic.color }">✓</span>
                  <span :class="plan.popular ? 'text-white/90' : 'text-gray-600'">{{ f }}</span>
                </li>
              </ul>
              <div class="space-y-2">
                <button @click="startDemo" :disabled="demoLoading"
                  class="block w-full text-center py-2.5 rounded-2xl font-bold text-sm transition-all border-2 hover:opacity-90 disabled:opacity-60"
                  :class="plan.popular ? 'border-white/50 text-white hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:bg-gray-50'">
                  ▶ Try Live Demo
                </button>
                <RouterLink :to="`/register?clinic=${clinicParam}&plan=${plan.key}`"
                  class="block text-center py-2.5 rounded-2xl font-bold text-sm transition-all"
                  :class="plan.popular ? 'bg-white hover:bg-gray-50' : 'text-white hover:opacity-90'"
                  :style="plan.popular ? { color: clinic.color } : { background: clinic.gradient }">
                  {{ plan.cta }}
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
        <p class="text-center text-sm text-gray-400 mt-8">All plans include 14-day free trial · No credit card required · Cancel anytime</p>
      </div>
    </section>

    <!-- ── TESTIMONIALS ── -->
    <section class="py-24 px-6" :style="{ background: clinic.color + '06' }">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">Doctors love Mednest</h2>
          <p class="text-xl text-gray-500">Real feedback from {{ clinic.specialty }} clinics across India</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="t in testimonials" :key="t.name" class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center gap-1 mb-3">
              <span v-for="n in 5" :key="n" :style="{ color: clinic.color }">★</span>
            </div>
            <p class="text-gray-700 text-sm leading-relaxed mb-4">"{{ t.text }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" :style="{ background: clinic.gradient }">{{ t.name[0] }}</div>
              <div>
                <div class="font-bold text-sm text-gray-900">{{ t.name }}</div>
                <div class="text-xs text-gray-400">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FAQ ── -->
    <section id="faq" class="py-24 px-6">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-gray-900 mb-4">Common questions</h2>
        </div>
        <div class="space-y-4">
          <div v-for="faq in faqs" :key="faq.q" class="border border-gray-100 rounded-2xl overflow-hidden">
            <button @click="faq.open = !faq.open" class="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
              <span class="font-semibold text-gray-900">{{ faq.q }}</span>
              <span class="text-2xl text-gray-400 transition-transform" :style="faq.open ? 'transform: rotate(45deg)' : ''">+</span>
            </button>
            <div v-if="faq.open" class="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{{ faq.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="py-24 px-6 text-center relative overflow-hidden">
      <div class="absolute inset-0 -z-10" :style="{ background: `linear-gradient(135deg, ${clinic.color}10, ${clinic.color}05)` }"></div>
      <div class="max-w-3xl mx-auto">
        <div class="text-6xl mb-6">{{ clinic.emoji }}</div>
        <h2 class="text-5xl font-black text-gray-900 mb-6">Ready to modernise your {{ clinic.specialty }} clinic?</h2>
        <p class="text-xl text-gray-500 mb-10">Join 500+ clinics already saving 2 hours a day with Mednest. Setup takes under 10 minutes.</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <button @click="startDemo" :disabled="demoLoading"
            class="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-black text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all disabled:opacity-70"
            :style="{ background: clinic.gradient }">
            <svg v-if="demoLoading" class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            <span v-else class="text-2xl">▶</span>
            {{ demoLoading ? 'Loading demo…' : clinicParam !== 'general' ? `See ${clinicLabel}'s Demo →` : 'Try the Live Demo' }}
          </button>
          <RouterLink :to="`/register?clinic=${clinicParam}`"
            class="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
            Get Started Free →
          </RouterLink>
        </div>
        <p class="text-sm text-gray-400 mt-4">No credit card. No setup fee. Full access from day one.</p>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="bg-gray-900 text-gray-400 py-16 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xl font-black" :style="{ background: clinic.gradient }">{{ clinic.emoji }}</div>
              <span class="text-white font-black text-xl">{{ clinic.brand }}</span>
            </div>
            <p class="text-sm leading-relaxed">India's most affordable clinic management platform. Built for solo doctors and small clinics.</p>
          </div>
          <div v-for="col in footerLinks" :key="col.title">
            <h4 class="text-white font-semibold mb-4">{{ col.title }}</h4>
            <ul class="space-y-2">
              <li v-for="link in col.links" :key="link" class="text-sm hover:text-white transition-colors cursor-pointer">{{ link }}</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <span>© 2025 Mednest. All rights reserved.</span>
          <div class="flex gap-6">
            <span class="hover:text-white cursor-pointer">Privacy Policy</span>
            <span class="hover:text-white cursor-pointer">Terms of Service</span>
            <span class="hover:text-white cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDemoStore } from '@/stores/demo'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const demo = useDemoStore()
// type= drives the theme (vet, dental, physiotherapy, mentalHealth)
// name= is the prospect's actual clinic name for personalised greeting
const clinicType = computed(() => route.query.type || route.query.clinic || 'default')
const clinicName = computed(() => route.query.name || null)

// Keep old clinicParam alias so template refs still work
const clinicParam = clinicType

// What to show in the greeting button
const clinicLabel = computed(() => {
  if (clinicName.value) return clinicName.value
  // fallback: humanise the type key e.g. "dentalClinic" → "Dental Clinic"
  const raw = clinicType.value
  if (!raw || raw === 'default') return ''
  const spaced = raw.replace(/([A-Z])/g, ' $1').trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
})

const isPersonalised = computed(() => !!clinicName.value || (clinicType.value !== 'default' && clinicType.value !== 'general'))
const demoLoading = ref(false)
const demoError = ref('')

async function startDemo() {
  demoLoading.value = true
  demoError.value = ''
  try {
    await auth.login({ email: 'Demo@gmail.com', password: 'Demo@1234' })
  } catch {
    // Backend not yet set up or demo account doesn't exist yet —
    // fall back to a fully client-side mock session so the tour still works
    auth.loginAsDemo()
  } finally {
    demo.start()
    await router.push('/dashboard')
    demoLoading.value = false
  }
}

// ── CLINIC CONFIGURATIONS ──────────────────────────────────────────────────
// Supported type= values: vet, dental, physio, mental (+ legacy camelCase aliases)
const CLINIC_CONFIGS = {
  vet: {
    brand: 'VetOS', emoji: '🐾', color: '#16a34a',
    gradient: 'linear-gradient(135deg, #16a34a, #059669)',
    badge: 'Built for Veterinary Clinics',
    headline: 'The smartest way to run', headlineSub: 'your vet clinic.',
    subtext: 'Manage pets, owners, appointments, vaccinations, and billing — all in one place built specifically for veterinary practices.',
    featuresSubtext: 'From puppy checkups to surgery follow-ups, VetOS handles it all.',
    specialty: 'veterinary', demoName: 'City Vet Care', demoDoc: 'Priya',
    tagline: 'Compassionate care for your pets', revenue: '18,400',
    smsName: 'Shyam (Bruno)', queuePatient1: 'Bruno (Golden Retriever)',
    queueNames: ['Milo 🐕', 'Whiskers 🐱', 'Max 🐩'],
  },
  dental: {
    brand: 'DentOS', emoji: '🦷', color: '#0891b2',
    gradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
    badge: 'Built for Dental Clinics',
    headline: 'Dental clinic software', headlineSub: 'patients will love.',
    subtext: 'Smart appointment slots, X-ray document storage, treatment plans, and instant billing. Your team runs smoother every day.',
    featuresSubtext: 'Designed around dental workflows — from first consult to crown delivery.',
    specialty: 'dental', demoName: 'SmileCare Dental', demoDoc: 'Arun',
    tagline: 'Your smile, our priority', revenue: '22,750',
    smsName: 'Meera', queuePatient1: 'Meera R.',
    queueNames: ['Rajesh K.', 'Sunita D.', 'Anil P.'],
  },
  physio: {
    brand: 'PhysioOS', emoji: '💪', color: '#ea580c',
    gradient: 'linear-gradient(135deg, #ea580c, #dc2626)',
    badge: 'Built for Physiotherapy Clinics',
    headline: 'Physio practice software', headlineSub: 'that moves as fast as you.',
    subtext: 'Session notes, exercise plans, progress tracking, and session-wise billing. Everything your physio clinic needs.',
    featuresSubtext: 'Structured around session-based care and patient progress tracking.',
    specialty: 'physiotherapy', demoName: 'ActiveCare Physio', demoDoc: 'Kavya',
    tagline: 'Healing through movement', revenue: '14,200',
    smsName: 'Ravi (Session 4)', queuePatient1: 'Ravi S. (Knee Rehab)',
    queueNames: ['Divya M.', 'Prakash N.', 'Leela V.'],
  },
  mental: {
    brand: 'MindOS', emoji: '🧠', color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    badge: 'Built for Mental Health Practices',
    headline: 'Calm, confidential software', headlineSub: 'for mental health pros.',
    subtext: 'Private session notes, appointment management, and billing — built with the confidentiality your practice demands.',
    featuresSubtext: 'Designed for psychologists, psychiatrists, and counselling practices.',
    specialty: 'mental health', demoName: 'Mindful Wellness Clinic', demoDoc: 'Deepa',
    tagline: 'Your mental health matters', revenue: '28,500',
    smsName: 'Arjun (Anonymous)', queuePatient1: 'Client #07',
    queueNames: ['Client #08', 'Client #09', 'Client #10'],
  },
  default: {
    brand: 'Mednest', emoji: '⚕️', color: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    badge: 'The #1 Clinic Management Platform in India',
    headline: 'Run a smarter clinic.', headlineSub: 'Delight every patient.',
    subtext: 'Appointments, EMR, billing, prescriptions, inventory, staff, and your own website — managed from one elegant dashboard.',
    featuresSubtext: 'Everything a modern clinic needs, without the enterprise price tag.',
    specialty: 'medical', demoName: 'City Medical Center', demoDoc: 'Lakshmi',
    tagline: 'Compassionate care, powered by technology', revenue: '31,200',
    smsName: 'Rahul', queuePatient1: 'Rahul Sharma',
    queueNames: ['Priya K.', 'Suresh M.', 'Ananya R.'],
  },
}
// Legacy camelCase aliases → normalised keys
const TYPE_ALIASES = {
  vetClinic: 'vet', dentalClinic: 'dental', physiotherapy: 'physio', mentalHealth: 'mental',
  general: 'default', clinic: 'default',
}

const clinic = computed(() => {
  const key = TYPE_ALIASES[clinicType.value] || clinicType.value
  return CLINIC_CONFIGS[key] || CLINIC_CONFIGS.default
})

const cssVars = computed(() => ({ '--brand-color': clinic.value.color }))

// ── DEMO DATA ──────────────────────────────────────────────────────────────
const demoNav = computed(() => [
  { icon: '🏠', label: 'Dashboard', active: true },
  { icon: '📅', label: 'Appointments', active: false },
  { icon: '👤', label: 'Patients', active: false },
  { icon: '💰', label: 'Billing', active: false },
  { icon: '📦', label: 'Inventory', active: false },
])
const demoStats = [
  { value: '24', label: "Today's Appts" },
  { value: '₹31K', label: "Revenue" },
  { value: '3', label: 'In Queue' },
  { value: '98%', label: 'Satisfaction' },
]
const demoQueue = computed(() => [
  { token: '07', name: clinic.value.queuePatient1, status: 'Consulting now', label: 'IN PROGRESS', active: true },
  { token: '08', name: clinic.value.queueNames[0], status: 'Waiting', label: 'NEXT', active: false },
  { token: '09', name: clinic.value.queueNames[1], status: 'Waiting', label: '2 ahead', active: false },
])

const avatarColors = ['#2563eb', '#16a34a', '#dc2626', '#7c3aed', '#ea580c']
const avatarInitials = ['D', 'P', 'R', 'S', 'A']

const trustedBy = [
  'Apollo Clinics', 'Rainbow Hospitals', 'Fortis OPD', 'MaxCure', 'Manipal Health', 'Aster Clinics',
]

// ── FEATURES GRID ──────────────────────────────────────────────────────────
const features = [
  { icon: '📅', title: 'Smart Appointment Booking', desc: 'Auto-assign token numbers, pick time slots, and send instant confirmations via SMS and email.', tags: ['Auto Tokens', 'Slot Picker', 'Reminders'] },
  { icon: '📺', title: 'Live Queue Display', desc: 'Public TV-ready queue screen patients can check from home before leaving. Zero waiting room anxiety.', tags: ['TV Screen', 'Mobile View', 'Real-time'] },
  { icon: '🩺', title: 'Electronic Medical Records', desc: 'SOAP notes, vitals tracking, diagnosis history, and full patient timelines — accessible in seconds.', tags: ['SOAP Notes', 'Vitals', 'History'] },
  { icon: '💊', title: 'Digital Prescriptions', desc: 'Create, print, and track prescriptions digitally. Linked to patient records for full medication history.', tags: ['Drug Library', 'Dosage', 'Print'] },
  { icon: '💰', title: 'Billing & Invoicing', desc: 'Auto-generate invoices, record UPI/cash/card payments, and track outstanding dues in one view.', tags: ['Auto Invoice', 'UPI/Cash', 'Dues Tracker'] },
  { icon: '📦', title: 'Inventory Management', desc: 'Track medicines, consumables, and equipment. Get low-stock alerts before you run out.', tags: ['Stock Alerts', 'Adjustments', 'Categories'] },
  { icon: '👥', title: 'Staff Management', desc: 'Manage doctors, nurses, and admin staff. Track leaves, attendance, and set per-branch access.', tags: ['Leave Mgmt', 'Attendance', 'Roles'] },
  { icon: '🌐', title: 'Website Builder', desc: 'Get a professional clinic website in 5 minutes. Book appointments directly from your website.', tags: ['No-code', 'Book Online', 'Blog'] },
  { icon: '🤖', title: 'AI Receptionist', desc: 'Claude AI handles patient queries 24/7, checks availability, and books appointments automatically.', tags: ['Claude AI', '24/7', 'Auto-book'] },
]

// ── MODULE DEEP DIVES ──────────────────────────────────────────────────────
const modules = computed(() => [
  {
    icon: '📅', tag: 'Appointments',
    title: 'Appointments that run themselves.',
    desc: 'Smart scheduling with auto token numbers, real-time availability, and automatic patient notifications — so your front desk can breathe.',
    points: [
      'Patients book online or via AI chat, auto-assigned token numbers',
      'Doctor-wise slot management with configurable working hours',
      'SMS & email confirmations sent instantly on booking',
      'One-click status updates: Waiting → In Progress → Completed',
    ],
    mockupType: 'queue', mockupTitle: '🟢 LIVE QUEUE — TODAY',
  },
  {
    icon: '🩺', tag: 'EMR',
    title: 'Complete records in under 2 minutes.',
    desc: 'Structured SOAP notes, vitals with auto BMI, diagnosis with ICD codes, and a full patient timeline — all from one clean screen.',
    points: [
      'SOAP notes with auto-save as you type',
      'Vitals tracking with automatic BMI calculation',
      'ICD-10 diagnosis codes with primary/secondary tagging',
      'Full patient history timeline across all visits',
    ],
    mockupType: 'emr', mockupTitle: '🩺 SOAP NOTES',
  },
  {
    icon: '💰', tag: 'Billing',
    title: 'Get paid faster, track every rupee.',
    desc: 'Auto-numbered invoices, multi-payment-mode recording, and an outstanding dues tracker that turns your accounts into a clean dashboard.',
    points: [
      'Auto-generated invoice numbers (INV-YYMM-00001 format)',
      'Accept Cash, UPI, Card, Bank Transfer in one step',
      'Partial payment tracking with automatic PAID/PARTIAL status',
      'Dashboard showing revenue, pending, and overdue at a glance',
    ],
    mockupType: 'billing', mockupTitle: '💰 RECENT INVOICES',
  },
  {
    icon: '🌐', tag: 'Website Builder',
    title: 'Your clinic online in 5 minutes.',
    desc: 'Build a professional clinic website with your branding, services, blog, and online booking — no developer needed.',
    points: [
      'Custom subdomain (yourclinic.mednest.app) in seconds',
      'Drag-and-drop page builder with pre-built healthcare templates',
      'Blog for health tips that bring Google traffic',
      'Patients book directly from your website',
    ],
    mockupType: 'website', mockupTitle: '🌐 WEBSITE PREVIEW',
  },
])

// Mockup data
const queueMockup = computed(() => [
  { token: '07', name: clinic.value.queuePatient1, doctor: `Dr. ${clinic.value.demoDoc}`, label: 'NOW SERVING', active: true },
  { token: '08', name: clinic.value.queueNames[0], doctor: `Dr. ${clinic.value.demoDoc}`, label: 'NEXT', active: false },
  { token: '09', name: clinic.value.queueNames[1], doctor: `Dr. ${clinic.value.demoDoc}`, label: '2 AHEAD', active: false },
])

const emrMockup = [
  { label: 'S — Subjective', value: 'Patient complains of knee pain for 3 days, aggravated by stairs.' },
  { label: 'O — Objective', value: 'Tenderness on palpation, ROM limited. No swelling observed.' },
  { label: 'A — Assessment', value: 'M79.3 — Panniculitis · Probable patellofemoral syndrome' },
  { label: 'P — Plan', value: 'Prescribe naproxen 500mg. Physio referral. Review in 1 week.' },
]

const billingMockup = [
  { id: 'INV-2506-00042', patient: 'Rahul Sharma', amount: '1,850', paid: true },
  { id: 'INV-2506-00043', patient: 'Priya Kapoor', amount: '3,200', paid: false },
  { id: 'INV-2506-00044', patient: 'Suresh Menon', amount: '650', paid: true },
]

const queueFeatures = [
  'Works on any TV or phone browser',
  'Live updates every 30 seconds',
  'Shows token number + doctor name',
  'Patients check from home before leaving',
  'No app installation required',
  'Share via WhatsApp or embed on website',
]

// ── PRICING ────────────────────────────────────────────────────────────────
const pricing = [
  {
    name: 'Starter', key: 'starter', price: '999', desc: 'Perfect for solo practitioners',
    cta: 'Start Free Trial',
    popular: false,
    features: ['1 Doctor · 1 Branch', 'Appointments & Queue', 'Patient Records (EMR)', 'Billing & Invoicing', 'Queue Display TV', '500 SMS/month', 'Email support'],
  },
  {
    name: 'Growth', key: 'growth', price: '2,499', desc: 'Best for growing clinics',
    cta: 'Start Free Trial',
    popular: true,
    features: ['Up to 5 Doctors · 2 Branches', 'Everything in Starter', 'Prescriptions & Inventory', 'Staff Management', 'Website Builder', 'AI Receptionist (1,000 queries)', 'WhatsApp notifications', 'Priority support'],
  },
  {
    name: 'Scale', key: 'scale', price: '5,999', desc: 'Multi-branch organisations',
    cta: 'Start Free Trial',
    popular: false,
    features: ['Unlimited Doctors & Branches', 'Everything in Growth', 'CRM & Lead Management', 'Custom domain website', 'Unlimited AI queries', 'Analytics & Reports', 'Dedicated onboarding', 'Phone support'],
  },
]

// ── TESTIMONIALS ───────────────────────────────────────────────────────────
const testimonials = computed(() => [
  {
    name: 'Dr. Suresh Nair', role: `${clinic.value.specialty.charAt(0).toUpperCase() + clinic.value.specialty.slice(1)} Specialist, Kochi`,
    text: "Mednest cut our patient wait time in half. The live queue display is the best feature — patients actually come on time now because they can track their token from home.",
  },
  {
    name: 'Dr. Ananya Krishnan', role: 'General Practitioner, Chennai',
    text: "Setup took 15 minutes and we were live. Billing used to take our staff 1 hour a day. Now it's 10 minutes. The auto-invoice numbering and UPI recording is brilliant.",
  },
  {
    name: 'Dr. Rahul Mehta', role: 'Clinic Owner, Pune (3 branches)',
    text: "Managing 3 branches from one dashboard is a game changer. Staff attendance, inventory across locations, and revenue reports — I check everything from my phone every morning.",
  },
])

// ── FAQ ────────────────────────────────────────────────────────────────────
const faqs = reactive([
  { q: 'Is my patient data safe and private?', a: 'Absolutely. All data is stored encrypted on Supabase (SOC 2 compliant), transmitted over HTTPS, and isolated per clinic — no other clinic can ever see your data. We never sell or share patient data.', open: false },
  { q: 'Do I need to install anything?', a: 'No. Mednest is fully web-based. Works on any computer, tablet, or phone browser. Your staff don\'t need to install anything — just log in.', open: false },
  { q: 'Can I import my existing patient records?', a: 'Yes. We provide a CSV import tool for patient data and can help you migrate from common systems like Practo, eVital, or Excel sheets. Our team assists during onboarding.', open: false },
  { q: 'What happens after the 14-day trial?', a: 'You choose a plan that fits your clinic and continue. We\'ll remind you before the trial ends. If you don\'t upgrade, your account is paused (data preserved) for 30 days.', open: false },
  { q: 'Does it work for multi-branch clinics?', a: 'Yes. The Growth and Scale plans support multiple branches with separate staff, inventory, and queues — all manageable from one login with branch-level access control.', open: false },
  { q: 'Is there a setup fee or per-patient charge?', a: 'None. Flat monthly pricing only. Add unlimited patients, create unlimited appointments, and generate unlimited invoices — no per-use fees ever.', open: false },
])

// ── FOOTER ─────────────────────────────────────────────────────────────────
const footerLinks = [
  { title: 'Product', links: ['Features', 'Pricing', 'Queue Display', 'Website Builder', 'AI Receptionist'] },
  { title: 'For Clinics', links: ['General Practice', 'Dental Clinics', 'Veterinary', 'Physiotherapy', 'Mental Health'] },
  { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact', 'Status'] },
]
</script>

<style scoped>
section { scroll-margin-top: 80px; }
</style>
