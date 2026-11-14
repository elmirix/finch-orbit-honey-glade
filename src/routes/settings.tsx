import { createFileRoute, Link } from '@tanstack/react-router'
import { Page } from "@/components/ui"

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <Page className="pt-10 md:pt-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-mist mb-6">Настройки</h1>
        <div className="card p-6">
          <p className="text-slate">Здесь вы сможете настроить уведомления, тему и язык.</p>
          <Link to="/profile" className="text-teal mt-4 inline-block hover:underline">← Вернуться в профиль</Link>
        </div>
      </div>
    </Page>
  )
}