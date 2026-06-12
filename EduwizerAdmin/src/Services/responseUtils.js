export function isSuccessValue(val) {
  return val === 1 || val === "1" || val === true;
}

export function getApiMessage(data, fallback) {
  return data?.message || data?.error || fallback;
}

export function normalizePaginatedListResponse(data) {
  const raw = data?.data;
  if (Array.isArray(raw)) {
    return { items: raw, pagination: data?.pagination || null };
  }
  if (raw && Array.isArray(raw.items)) {
    const page = Number(raw.page) || Number(data?.pagination?.page) || 1;
    const limit = Number(raw.limit) || Number(data?.pagination?.limit) || 10;
    const total = Number(raw.total) || Number(data?.pagination?.total) || raw.items.length;
    return {
      items: raw.items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }
  return { items: [], pagination: data?.pagination || null };
}

export function normalizeSingleRecordResponse(resp) {
  if (!resp) return null;
  const data = resp?.data;
  if (Array.isArray(data)) {
    return data[0] || null;
  }
  if (data && typeof data === "object") {
    // if data contains a nested data field (e.g., { data: {...} })
    if (data.data) {
      return data.data;
    }
    return data;
  }
  return null;
}
