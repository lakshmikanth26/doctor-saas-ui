<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Website Builder</h1>
      <div class="flex gap-2">
        <a v-if="site?.subdomain" :href="`https://${site.subdomain}.mednest.app`" target="_blank" class="btn-secondary btn-sm">
          🔗 Preview
        </a>
        <button @click="publish" class="btn-primary" :disabled="publishing">
          {{ publishing ? 'Publishing…' : site?.status === 'PUBLISHED' ? '✓ Published' : 'Publish Website' }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
      <button v-for="t in ['Settings', 'Pages', 'Blog']" :key="t" @click="tab = t"
        class="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
        :class="tab === t ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'">
        {{ t }}
      </button>
    </div>

    <!-- Settings Tab -->
    <div v-if="tab === 'Settings'" class="max-w-2xl">
      <form @submit.prevent="saveSettings" class="card space-y-4">
        <div><label class="label">Clinic Name (display)</label><input v-model="siteForm.name" class="input" /></div>
        <div><label class="label">Tagline</label><input v-model="siteForm.tagline" class="input" placeholder="Your trusted healthcare partner" /></div>
        <div><label class="label">Subdomain</label>
          <div class="flex items-center">
            <input v-model="siteForm.subdomain" class="input rounded-r-none" placeholder="myclinic" />
            <span class="bg-gray-100 border border-l-0 border-white/10 rounded-r-lg px-3 py-2 text-sm text-slate-500">.mednest.app</span>
          </div>
        </div>
        <div><label class="label">Phone</label><input v-model="siteForm.phone" class="input" /></div>
        <div><label class="label">Email</label><input v-model="siteForm.email" class="input" /></div>
        <div><label class="label">Address</label><textarea v-model="siteForm.address" class="input" rows="2" /></div>
        <div><label class="label">Working Hours</label><input v-model="siteForm.workingHours" class="input" placeholder="Mon–Sat: 9 AM – 6 PM" /></div>
        <div>
          <label class="label">Theme Color</label>
          <div class="flex gap-2">
            <button v-for="c in themes" :key="c" type="button"
              @click="siteForm.themeColor = c"
              class="w-8 h-8 rounded-full border-2 transition-all"
              :style="{ backgroundColor: c }"
              :class="siteForm.themeColor === c ? 'border-gray-900 scale-110' : 'border-transparent'" />
          </div>
        </div>
        <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save Settings' }}</button>
      </form>
    </div>

    <!-- Pages Tab -->
    <div v-if="tab === 'Pages'">
      <div class="flex justify-end mb-3"><button @click="openPageForm()" class="btn-primary">+ New Page</button></div>
      <div class="space-y-2">
        <div v-for="page in pages" :key="page.id" class="card flex items-center justify-between">
          <div>
            <p class="font-medium">{{ page.title }}</p>
            <p class="text-sm text-slate-400">/{{ page.slug }}</p>
          </div>
          <div class="flex gap-2 items-center">
            <span :class="page.isPublished ? 'badge-green' : 'badge-gray'">{{ page.isPublished ? 'Published' : 'Draft' }}</span>
            <button @click="openPageForm(page)" class="btn-secondary btn-sm">Edit</button>
            <button @click="deletePage(page.slug)" class="btn btn-secondary btn-sm text-red-600">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog Tab -->
    <div v-if="tab === 'Blog'">
      <div class="flex justify-end mb-3"><button @click="openBlogForm()" class="btn-primary">+ New Post</button></div>
      <div class="space-y-2">
        <div v-for="b in blogs" :key="b.id" class="card flex items-center justify-between">
          <div>
            <p class="font-medium">{{ b.title }}</p>
            <p class="text-sm text-slate-400">/blog/{{ b.slug }}</p>
          </div>
          <div class="flex gap-2 items-center">
            <span :class="b.isPublished ? 'badge-green' : 'badge-gray'">{{ b.isPublished ? 'Published' : 'Draft' }}</span>
            <button @click="openBlogForm(b)" class="btn-secondary btn-sm">Edit</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Page / Blog Modal -->
    <Modal :show="showPageModal" :title="editingPage ? 'Edit Page' : 'New Page'" @close="showPageModal = false" size="lg">
      <div class="space-y-3">
        <div><label class="label">Title *</label><input v-model="pageForm.title" class="input" required /></div>
        <div><label class="label">Slug *</label><input v-model="pageForm.slug" class="input" placeholder="about-us" required /></div>
        <div><label class="label">Content (HTML/Markdown)</label><textarea v-model="pageForm.content" class="input font-mono text-sm" rows="8" /></div>
        <div class="flex items-center gap-2"><input type="checkbox" v-model="pageForm.isPublished" /><label class="text-sm">Published</label></div>
      </div>
      <template #footer>
        <button @click="showPageModal = false" class="btn-secondary">Cancel</button>
        <button @click="savePage" class="btn-primary">Save</button>
      </template>
    </Modal>

    <Modal :show="showBlogModal" :title="editingBlog ? 'Edit Blog Post' : 'New Blog Post'" @close="showBlogModal = false" size="lg">
      <div class="space-y-3">
        <div><label class="label">Title *</label><input v-model="blogForm.title" class="input" required /></div>
        <div><label class="label">Slug *</label><input v-model="blogForm.slug" class="input" required /></div>
        <div><label class="label">Excerpt</label><textarea v-model="blogForm.excerpt" class="input" rows="2" /></div>
        <div><label class="label">Content</label><textarea v-model="blogForm.content" class="input font-mono text-sm" rows="8" /></div>
        <div class="flex items-center gap-2"><input type="checkbox" v-model="blogForm.isPublished" /><label class="text-sm">Publish immediately</label></div>
      </div>
      <template #footer>
        <button @click="showBlogModal = false" class="btn-secondary">Cancel</button>
        <button @click="saveBlog" class="btn-primary">Save</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/lib/api'
import Modal from '@/components/Modal.vue'

const tab = ref('Settings'); const site = ref(null); const saving = ref(false); const publishing = ref(false)
const pages = ref([]); const blogs = ref([])
const showPageModal = ref(false); const showBlogModal = ref(false)
const editingPage = ref(null); const editingBlog = ref(null)
const themes = ['#2563eb', '#16a34a', '#dc2626', '#7c3aed', '#ea580c', '#0891b2']

const siteForm = ref({ name: '', tagline: '', subdomain: '', phone: '', email: '', address: '', workingHours: '', themeColor: '#2563eb' })
const pageForm = ref({ title: '', slug: '', content: '', isPublished: false })
const blogForm = ref({ title: '', slug: '', excerpt: '', content: '', isPublished: false })

async function load() {
  const { data } = await api.get('/website').catch(() => ({ data: { data: null } }))
  site.value = data.data
  if (data.data) Object.assign(siteForm.value, data.data)
  loadPages(); loadBlogs()
}
async function loadPages() {
  const { data } = await api.get('/website/pages').catch(() => ({ data: { data: [] } }))
  pages.value = data.data || []
}
async function loadBlogs() {
  const { data } = await api.get('/website/blogs').catch(() => ({ data: { data: { blogs: [] } } }))
  blogs.value = data.data?.blogs || []
}

async function saveSettings() {
  saving.value = true
  await api.put('/website', siteForm.value)
  saving.value = false; load()
}
async function publish() {
  publishing.value = true
  await api.post('/website/publish').catch(() => {})
  publishing.value = false; load()
}

function openPageForm(p = null) { editingPage.value = p; pageForm.value = p ? { ...p } : { title: '', slug: '', content: '', isPublished: false }; showPageModal.value = true }
async function savePage() {
  await api.put(`/website/pages/${pageForm.value.slug}`, pageForm.value)
  showPageModal.value = false; loadPages()
}
async function deletePage(slug) {
  if (!confirm('Delete this page?')) return
  await api.delete(`/website/pages/${slug}`)
  loadPages()
}

function openBlogForm(b = null) { editingBlog.value = b; blogForm.value = b ? { ...b } : { title: '', slug: '', excerpt: '', content: '', isPublished: false }; showBlogModal.value = true }
async function saveBlog() {
  await api.put(`/website/blogs/${blogForm.value.slug}`, blogForm.value)
  showBlogModal.value = false; loadBlogs()
}

onMounted(load)
</script>
