<script setup lang="ts">
    const { locale, toLocalePath } = useSiteLocale()
    const siteCopy = useSiteCopy()
</script>

<template>
    <div class="flex gap-16 w-full text-sm text-muted">
        <span>&copy; {{ new Date().getFullYear() }} Castrel AI</span>
        <div class="flex gap-4">
            <NuxtLink :to="toLocalePath('/docs/security/terms-of-service', locale)"
                class="hover:text-foreground transition-colors">
                {{ siteCopy.terms }}
            </NuxtLink>
            <NuxtLink :to="toLocalePath('/docs/security/privacy-policy', locale)"
                class="hover:text-foreground transition-colors">
                {{ siteCopy.privacy }}
            </NuxtLink>
        </div>
    </div>
</template>
