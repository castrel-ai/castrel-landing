import { computed } from 'vue'

export function useCommunityLinks() {
    const { locale } = useSiteLocale()

    return computed(() => {
        if (locale.value === 'zh') {
            return [
                {
                    icon: 'i-simple-icons-bilibili',
                    label: 'Bilibili',
                    to: 'https://space.bilibili.com/1638156150',
                    target: '_blank',
                },
                {
                    icon: 'i-lucide-message-square',
                    label: '飞书群',
                    to: 'https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=fc0oec2d-2290-4708-ab3e-95b4471832ab',
                    target: '_blank',
                },
            ]
        }

        return [
            {
                icon: 'i-simple-icons-x',
                label: 'X',
                to: 'https://x.com/castrel_ai',
                target: '_blank',
            },
            {
                icon: 'i-simple-icons-youtube',
                label: 'YouTube',
                to: 'https://www.youtube.com/@castrelai',
                target: '_blank',
            },
            {
                icon: 'i-simple-icons-discord',
                label: 'Discord',
                to: 'https://discord.gg/DynAHf3pgV',
                target: '_blank',
            },
        ]
    })
}
