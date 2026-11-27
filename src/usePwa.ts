import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePwa() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null)
  const [online, setOnline] = useState(navigator.onLine)
  const [installed, setInstalled] = useState(window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  const [installing, setInstalling] = useState(false)
  const [error, setError] = useState('')
  const sw = useRegisterSW({ onRegisterError: () => setError('Chưa lưu được bản ngoại tuyến. Bạn vẫn có thể dùng khi có mạng.') })
  useEffect(() => {
    const beforeInstall = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent) }
    const afterInstall = () => { setInstalled(true); setPrompt(null) }
    const onlineChange = () => setOnline(navigator.onLine)
    window.addEventListener('beforeinstallprompt', beforeInstall)
    window.addEventListener('appinstalled', afterInstall)
    window.addEventListener('online', onlineChange)
    window.addEventListener('offline', onlineChange)
    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstall)
      window.removeEventListener('appinstalled', afterInstall)
      window.removeEventListener('online', onlineChange)
      window.removeEventListener('offline', onlineChange)
    }
  }, [])
  async function install() {
    if (!prompt) return
    setInstalling(true)
    try {
      await prompt.prompt()
      const result = await prompt.userChoice
      if (result.outcome === 'accepted') setInstalled(true)
      setPrompt(null)
    } catch { setError('Chưa thể cài ứng dụng. Hãy thử từ menu trình duyệt.'); setPrompt(null) }
    finally { setInstalling(false) }
  }
  return { ...sw, prompt, installed, installing, install, online, error }
}
