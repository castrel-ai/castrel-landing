<script setup lang="ts">
    import { ref, onMounted } from 'vue'

    const rendered = ref('')

    const diagram = `
flowchart TD
    subgraph I ["Incident Investigation"]
        direction TB

        subgraph B ["Agent"]
            direction LR
            D["Hypothesis"]
            E["Verification"]
            F["Causal Analysis"]

            D -->E --> F --> D
        end

        subgraph X["Knowledge"]
            direction LR

            X1["User Feedback"]
            X2["Similar Incident"]
            X3["Related Mannuals / Runbooks"]
        end

        B <--> X

    end


    A["⚠️ Incident"] --> I
    I -->|"Confirm or Fallback"| C["🎯 Investigation Report"]
`

    onMounted(async () => {
        // 动态导入 mermaid 以实现懒加载
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral',
            flowchart: {
                curve: 'basis',
                padding: 20
            }
        })
        const { svg } = await mermaid.render('incident-investigation-mermaid', diagram)
        rendered.value = svg
    })
</script>

<template>
    <div
        class="incident-investigation-flow w-full h-full flex items-center justify-center overflow-hidden">
        <div v-html="rendered" class="mermaid-container" />
    </div>
</template>

<style scoped>
.incident-investigation-flow {
    width: 100%;
    height: 100%;
    max-height: 352px;
}

.mermaid-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mermaid-container :deep(svg) {
    max-width: 100%;
    max-height: 100%;
}
</style>
