import api from '@/lib/api'
import axios from 'axios'
import { getApiBaseUrl } from '@/lib/apiBase.js'

const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js'
const CF_ENV = import.meta.env.VITE_CASHFREE_ENV || 'sandbox'

let sdkReady = null

function loadSdk() {
  if (sdkReady) return sdkReady
  sdkReady = new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = SDK_URL
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'))
    document.head.appendChild(script)
  })
  return sdkReady
}

async function initCashfree() {
  await loadSdk()
  if (typeof window.Cashfree?.load === 'function') {
    return window.Cashfree.load({ mode: CF_ENV })
  }
  return window.Cashfree({ mode: CF_ENV })
}

async function verifyOrder(orderId, { publicApi = false } = {}) {
  const path = `/payments/cashfree/verify?order_id=${encodeURIComponent(orderId)}`
  if (publicApi) {
    const { data } = await axios.get(`${getApiBaseUrl()}${path}`)
    return data.data?.status
  }
  const { data } = await api.get(path)
  return data.data?.status
}

function pickOrderId(order, result) {
  return (
    order?.orderId
    || order?.order_id
    || order?.cfOrderId
    || order?.cf_order_id
    || result?.paymentDetails?.orderId
    || result?.paymentDetails?.order_id
  )
}

/**
 * Opens Cashfree checkout in a modal popup, then verifies payment server-side.
 * @returns {{ status: string, orderId?: string, error?: unknown }}
 */
export async function launchCashfreeCheckout({ paymentSessionId, orderId, order, publicApi = false } = {}) {
  if (!paymentSessionId) {
    throw new Error('Missing payment session ID')
  }

  const cashfree = await initCashfree()
  const result = await cashfree.checkout({
    paymentSessionId,
    redirectTarget: '_modal',
  })

  if (result?.error) {
    return { status: 'CANCELLED', orderId, error: result.error }
  }

  if (result?.redirect) {
    window.location.href = result.redirect
    return { status: 'REDIRECT', orderId }
  }

  const oid = orderId || pickOrderId(order, result)
  if (!oid) {
    return { status: 'UNKNOWN', error: new Error('Could not determine order ID') }
  }

  const paymentStatus = await verifyOrder(oid, { publicApi })
  return { status: paymentStatus || 'UNKNOWN', orderId: oid }
}
