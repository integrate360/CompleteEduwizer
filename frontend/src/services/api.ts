/**
 * API layer for the Eduwizer backend (EduwizerBackend).
 * Endpoint contract mirrors the legacy EduwizerFrontend/src/Services/api.js.
 */

const BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'https://eduwizer.com/api'

const TOKEN_KEY = 'ew_token'
const USER_ID_KEY = 'ew_userId'

export const session = {
  get token() {
    return localStorage.getItem(TOKEN_KEY)
  },
  get userId() {
    return localStorage.getItem(USER_ID_KEY)
  },
  save(token: string, userId: string) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_ID_KEY, userId)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
  },
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

interface ApiEnvelope<T> {
  success?: number | boolean
  data?: T
  message?: string
  session?: string
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; form?: FormData } = {},
): Promise<ApiEnvelope<T>> {
  const headers: Record<string, string> = {}
  const token = session.token
  if (token) headers.Authorization = `Bearer ${token}`

  let body: BodyInit | undefined
  if (options.form) {
    body = options.form
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(options.body)
  }

  // Abort the request if the backend hangs, so the UI never spins forever.
  // Uploads get a longer window than normal JSON calls.
  const timeoutMs = options.form ? 60000 : 30000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? (body ? 'POST' : 'GET'),
      headers,
      body,
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection and try again.', 0)
    }
    throw new ApiError('Network error. Please try again.', 0)
  }
  clearTimeout(timer)

  let payload: ApiEnvelope<T>
  try {
    payload = (await res.json()) as ApiEnvelope<T>
  } catch {
    payload = {}
  }

  if (res.status === 401 || res.status === 403) {
    // expired/invalid token — drop the session so the UI can react
    if (token) session.clear()
  }
  if (!res.ok) {
    throw new ApiError(payload.message ?? `Request failed (${res.status})`, res.status)
  }
  return payload
}

/* ---------------- types ---------------- */

export interface FeaturedItem {
  _id: string
  url: string
  fileType: string
}

export interface Leader {
  _id?: string
  name: string
  url?: string
  position?: string
  location?: string
  country?: string
  linkedIn?: string
}

export interface Award {
  _id?: string
  title: string
  url: string
  fileType?: string
}

export interface EventItem {
  _id: string
  title: string
  description: string
  image: string
  data?: string
  createdTimestamp?: string
}

export interface BlogItem extends EventItem {
  author?: string
}

export interface Profile {
  _id?: string
  firstName?: string
  lastName?: string
  userName?: string
  email?: string
  phone?: string | number
  whatsapp?: string | number
  address?: string
  country?: string
  state?: string
  city?: string
  aboutMe?: string
  experience?: string | number
  education?: string
  skills?: string
  languages?: string
  awardsAndRecognition?: string
  url?: string
  resume?: string
  userType?: string
  preference?: string
  [key: string]: unknown
}

export interface SignUpBody {
  firstName: string
  lastName: string
  userName: string
  password: string
  email: string
  phone: number
  age?: number
  experience?: number
  country: string
  state: string
  city?: string
  preference: string
  board?: string
  url: string
  resume: string
  fileType: string
  userType: string
}

/* ---------------- auth ---------------- */

export interface LoginResponse {
  success?: number
  message?: string
  session?: string
  data?: { _id: string; userType?: string }
}

export async function login(userName: string, password: string): Promise<LoginResponse> {
  return (await request<LoginResponse['data']>('/eduwizer/login', {
    body: { userName, password },
  })) as LoginResponse
}

export function signup(body: SignUpBody) {
  return request<{ _id: string }>('/eduwizer/signup', { body })
}

export function sendOtp(userId: string) {
  return request('/eduwizer/send/otp', { body: { userId } })
}

export function verifyOtp(userId: string, otp: string) {
  // backend expects { userId, code:<number> }
  return request('/eduwizer/verify/otp', { body: { userId, code: Number(otp) } })
}

export function forgotPassword(email: string) {
  return request('/eduwizer/forgotPassword', { body: { email } })
}

export function setNewPassword(token: string, newPassword: string) {
  return request('/eduwizer/setNewPassword', { body: { token, newPassword } })
}

export function searchProfiles(body: Record<string, unknown>) {
  return request<Profile[]>('/eduwizer/searchProfile', { body })
}

/* ---------------- profile ---------------- */

export function getProfile() {
  return request<Profile>('/eduwizer/getProfile')
}

export function updateProfile(body: Profile) {
  return request<Profile>('/eduwizer/updateProfile', { body })
}

/* ---------------- uploads ---------------- */

export async function uploadFile(file: File): Promise<string> {
  const form = new FormData()
  form.append('admin', 'true')
  form.append('file', file)
  const resp = await request<string>('/uploadResume', { form })
  return resp.data as string
}

/* ---------------- marketing content ---------------- */

export function getFeaturedLists() {
  return request<FeaturedItem[]>('/admin/eduwizer/getFeaturedLists')
}

export function getAboutChancellors() {
  return request<Leader[]>('/admin/eduwizer/getAboutChancellors')
}

export function getAwardsAndRecognitions() {
  return request<Award[]>('/admin/eduwizer/getAwardsAndRecognitions')
}

export function getEvents() {
  return request<EventItem[]>('/admin/eduwizer/getEvents')
}

export function getEventById(id: string) {
  return request<EventItem[]>(`/admin/eduwizer/getEvents?eventId=${id}`)
}

export function getBlogs() {
  return request<BlogItem[]>('/admin/eduwizer/getBlogs')
}

export function getBlogById(id: string) {
  return request<BlogItem[]>(`/admin/eduwizer/getBlogs?blogId=${id}`)
}

/* ---------------- forms ---------------- */

export interface SeoOverride {
  title?: string
  description?: string
  ogImage?: string
  keywords?: string
}

/** Admin-managed SEO overrides keyed by pageKey ("home", "blog:<id>", …). */
export function getSeoOverrides() {
  return request<Record<string, SeoOverride>>('/admin/eduwizer/seo')
}

export function subscribe(email: string) {
  return request('/eduwizer/susbcribe', { body: { email } })
}

export function contactUs(body: { name: string; email: string; phone: string; message: string }) {
  return request('/eduwizer/contact-us', { body })
}
