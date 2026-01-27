<script setup lang="ts">
    // Label 颜色配置，参考 CastrelLabel 组件
    const labelStyles = {
        service: 'bg-purple-50 text-purple-700 border-purple-200',
        infra: 'bg-sky-50 text-sky-700 border-sky-200',
    }

    // 模拟的对话消息
    interface MessagePart {
        type: 'text' | 'label'
        content: string
        labelType?: 'service' | 'infra'
    }

    interface Message {
        role: 'user' | 'assistant'
        parts: MessagePart[]
    }

    // 定义多组对话
    const conversations: Message[][] = [
        [
            {
                role: 'user',
                parts: [
                    { type: 'text', content: 'Why is ' },
                    { type: 'label', content: 'order-service', labelType: 'service' },
                    { type: 'text', content: ' responding slowly?' }
                ]
            },
            {
                role: 'assistant',
                parts: [
                    { type: 'text', content: 'Analyzing order-service... Found high latency on ' },
                    { type: 'label', content: 'pod-order-7d8f9', labelType: 'infra' },
                    { type: 'text', content: '. CPU usage at 95%, recommend scaling up.' }
                ]
            }
        ],
        [
            {
                role: 'user',
                parts: [
                    { type: 'text', content: 'What caused the spike in ' },
                    { type: 'label', content: 'payment-gateway', labelType: 'service' },
                    { type: 'text', content: ' errors?' }
                ]
            },
            {
                role: 'assistant',
                parts: [
                    { type: 'text', content: 'Root cause: Redis timeout. Cluster ' },
                    { type: 'label', content: 'cache-redis-prod', labelType: 'infra' },
                    { type: 'text', content: ' had network partition at 3:42 AM.' }
                ]
            }
        ],
        [
            {
                role: 'user',
                parts: [
                    { type: 'text', content: 'Analyze deployment impact on ' },
                    { type: 'label', content: 'api-gateway', labelType: 'service' },
                ]
            },
            {
                role: 'assistant',
                parts: [
                    { type: 'text', content: 'Deployment verified. Error rate stable on ' },
                    { type: 'label', content: 'k8s-node-03', labelType: 'infra' },
                    { type: 'text', content: '. All metrics within normal range.' }
                ]
            }
        ],
        [
            {
                role: 'user',
                parts: [
                    { type: 'text', content: 'Check health status of ' },
                    { type: 'label', content: 'user-auth', labelType: 'service' },
                ]
            },
            {
                role: 'assistant',
                parts: [
                    { type: 'text', content: 'Service healthy. Running on ' },
                    { type: 'label', content: 'node-prod-02', labelType: 'infra' },
                    { type: 'text', content: ' with 99.9% uptime last 24h.' }
                ]
            }
        ]
    ]

    const currentConversationIndex = ref(0)
    const visibleMessages = ref<Message[]>([])
    const isTyping = ref(false)
    const typingText = ref('')
    const currentTypingIndex = ref(0)

    let animationTimer: ReturnType<typeof setTimeout> | null = null

    // 获取消息的纯文本内容（用于打字效果）
    const getMessageText = (message: Message): string => {
        return message.parts.map(p => p.content).join('')
    }

    // 动画流程
    const runAnimation = async () => {
        const conversation = conversations[currentConversationIndex.value]

        // 显示用户消息
        visibleMessages.value = [conversation[0]]

        // 等待后开始 AI 回复打字效果
        await sleep(800)

        isTyping.value = true
        typingText.value = ''
        currentTypingIndex.value = 0

        const assistantText = getMessageText(conversation[1])

        // 打字效果
        const typeNextChar = () => {
            if (currentTypingIndex.value < assistantText.length) {
                typingText.value = assistantText.slice(0, currentTypingIndex.value + 1)
                currentTypingIndex.value++
                animationTimer = setTimeout(typeNextChar, 30)
            } else {
                // 打字完成，显示完整消息（带标签）
                isTyping.value = false
                visibleMessages.value = [conversation[0], conversation[1]]

                // 等待后切换到下一组对话
                animationTimer = setTimeout(() => {
                    currentConversationIndex.value = (currentConversationIndex.value + 1) % conversations.length
                    visibleMessages.value = []
                    animationTimer = setTimeout(runAnimation, 500)
                }, 3000)
            }
        }

        typeNextChar()
    }

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    onMounted(() => {
        runAnimation()
    })

    onUnmounted(() => {
        if (animationTimer) clearTimeout(animationTimer)
    })
</script>

<template>
    <div class="relative w-full max-w-xl">
        <!-- Gradient glow background -->
        <div
            class="absolute -inset-1 bg-gradient-to-r from-emerald-400/30 via-green-300/20 to-teal-400/30 rounded-2xl blur-xl" />

        <!-- Chat container -->
        <div
            class="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <!-- Chat header -->
            <div
                class="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span
                    class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Castrel
                    AI</span>
            </div>

            <!-- Messages area -->
            <div class="p-4 min-h-[180px] space-y-4">
                <!-- User message -->
                <template v-for="(message, idx) in visibleMessages" :key="idx">
                    <div v-if="message.role === 'user'" class="flex justify-end">
                        <div
                            class="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm bg-emerald-500 text-white text-sm">
                            <template v-for="(part, pIdx) in message.parts" :key="pIdx">
                                <span v-if="part.type === 'text'">{{ part.content
                                    }}</span>
                                <span v-else-if="part.type === 'label'"
                                    :class="['inline-flex items-center align-middle mx-0.5 px-1.5 py-px rounded text-[10px] font-bold uppercase border translate-y-[-1px]', part.labelType === 'service' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-sky-100 text-sky-800 border-sky-300']">
                                    @{{ part.content }}
                                </span>
                            </template>
                        </div>
                    </div>

                    <!-- Assistant message (full with labels) -->
                    <div v-else-if="message.role === 'assistant' && !isTyping"
                        class="flex justify-start">
                        <div
                            class="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm">
                            <template v-for="(part, pIdx) in message.parts" :key="pIdx">
                                <span v-if="part.type === 'text'">{{ part.content
                                    }}</span>
                                <span v-else-if="part.type === 'label'"
                                    :class="['inline-flex items-center align-middle mx-0.5 px-1.5 py-px rounded text-[10px] font-bold uppercase border translate-y-[-1px]', part.labelType === 'service' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700' : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700']">
                                    {{ part.content }}
                                </span>
                            </template>
                        </div>
                    </div>
                </template>

                <!-- Typing indicator -->
                <div v-if="isTyping" class="flex justify-start">
                    <div
                        class="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm">
                        {{ typingText }}<span class="animate-pulse">|</span>
                    </div>
                </div>

                <!-- Empty state placeholder -->
                <div v-if="visibleMessages.length === 0 && !isTyping"
                    class="flex items-center justify-center h-[140px]">
                    <div class="flex gap-1">
                        <div class="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce"
                            style="animation-delay: 0ms" />
                        <div class="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce"
                            style="animation-delay: 150ms" />
                        <div class="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600 animate-bounce"
                            style="animation-delay: 300ms" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
