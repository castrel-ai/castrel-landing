<script setup lang="ts">
    const appConfig = useAppConfig()
    const site = useSiteConfig()
    const { locale, toLocalePath } = useSiteLocale()
</script>

<template>
    <UHeader
        :ui="{ center: 'flex-1' }"
        :to="toLocalePath('/', locale)"
        :title="appConfig.header?.title || site.name"
    >
        <AppHeaderCenter />

        <template #title>
            <AppHeaderLogo class="h-6 w-auto shrink-0" />
        </template>

        <template #right>
            <AppHeaderCTA />
            <SiteThemeSwitch />

            <UContentSearchButton class="lg:hidden" />
        </template>

        <template #toggle="{ open, toggle }">
            <IconMenuToggle
                :open="open"
                class="lg:hidden"
                @click="toggle"
            />
        </template>

        <template #body>
            <AppHeaderBody />
        </template>
    </UHeader>
</template>
