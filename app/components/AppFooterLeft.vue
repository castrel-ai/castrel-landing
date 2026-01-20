<template>
    <div class="flex items-center justify-start w-full gap-4 text-sm text-muted">
        <span>&copy; {{ new Date().getFullYear() }} Castrel AI</span>
        <NuxtLink to="/docs/security/privacy-policy"
            class="hover:text-foreground transition-colors">
            Privacy
        </NuxtLink>
    </div>
</template>
