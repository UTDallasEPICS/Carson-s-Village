export function assertTextLimits(data: Record<string, unknown>, limits: Record<string, number>) {
  for (const [field, max] of Object.entries(limits)) {
    const value = data?.[field]
    if (typeof value === 'string' && value.length > max) {
      throw createError({
        statusCode: 400,
        statusMessage: `${field} exceeds the ${max} character limit`,
      })
    }
  }
}
