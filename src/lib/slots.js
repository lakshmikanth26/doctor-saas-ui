/** Local calendar date as YYYY-MM-DD (avoids UTC drift from toISOString). */
export function localTodayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatSlotTime(raw) {
  if (!raw) return ''
  if (typeof raw === 'string' && /^\d{2}:\d{2}$/.test(raw)) return raw
  const d = new Date(raw)
  if (isNaN(d.getTime())) {
    const match = String(raw).match(/(\d{1,2}):(\d{2})/)
    if (match) {
      return `${String(match[1]).padStart(2, '0')}:${match[2]}`
    }
    return ''
  }
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function isPastSlot(timeStr, dateIso) {
  if (!timeStr || !dateIso || dateIso !== localTodayIso()) return false
  const [h, m] = timeStr.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return false
  const now = new Date()
  return h < now.getHours() || (h === now.getHours() && m < now.getMinutes())
}

export function normalizeSlots(rawSlots, dateIso) {
  return (rawSlots || [])
    .map((s) => {
      const time = formatSlotTime(s?.time ?? s?.scheduledTime ?? s)
      if (!time || isPastSlot(time, dateIso)) return null
      const busy = s.available === false || s.busy === true
      return { time, busy }
    })
    .filter(Boolean)
}

export function generateDefaultSlots(dateIso) {
  const out = []
  for (let h = 9; h <= 18; h++) {
    const time = `${String(h).padStart(2, '0')}:00`
    if (!isPastSlot(time, dateIso)) out.push({ time, busy: false })
  }
  return out
}
