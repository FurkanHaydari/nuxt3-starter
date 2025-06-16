export default defineNuxtRouteMiddleware(async (to) => {
  // Reset password sayfası için token kontrolü
  if (to.path === '/auth/reset-password') {
    const token = to.query.token as string
    
    if (!token || token.trim() === '') {
      // Token yoksa forgot-password sayfasına yönlendir
      return navigateTo('/auth/forgot-password')
    }
    
    // Token çok kısa ise (muhtemelen geçersiz)
    if (token.length < 10) {
      return navigateTo('/auth/forgot-password')
    }

    // Backend'den token validation
    try {
      const api = useApi()
      const response = await api.auth.validateResetToken({ token })
      
      if (!response.isSuccess || !response.data?.isValid) {
        // Token geçersiz ise 404 hatası fırlat
        throw createError({
          statusCode: 400,
          statusMessage: 'Geçersiz veya süresi dolmuş şifre sıfırlama linki'
        })
      }
    } catch (error: any) {
      // API hatası durumunda da 404 fırlat
      console.error('Token validation error:', error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Şifre sıfırlama linki doğrulanamadı'
      })
    }
  }
}) 