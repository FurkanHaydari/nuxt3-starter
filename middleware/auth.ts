import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware((to) => {
    const { authenticated } = storeToRefs(useAuthStore());
    const config = useRuntimeConfig();
    const token = useCookie(config.public.tokenCookieName as string);

    if (token.value) {
        // Token varsa authenticated state'i güncelle
        authenticated.value = true;
    }

    // Eğer token varsa ve login sayfasına gidilmeye çalışılıyorsa ana sayfaya yönlendir
    if (token.value && to?.name === 'auth-login') {
        return navigateTo('/');
    }

    // Eğer token yoksa ve login sayfası değilse login sayfasına yönlendir
    if (!token.value && to?.name !== 'auth-login') {
        abortNavigation();
        return navigateTo('/auth/login');
    }
});