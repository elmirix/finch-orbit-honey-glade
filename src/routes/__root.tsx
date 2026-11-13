import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Shell } from "@/components/shell";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { MobileNav } from "@/components/MobileNav";
import appCss from "../styles.css?url";

// ВАЖНО: Переменная должна называться именно Route
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Click — подготовка к экзаменам" },
      { name: "theme-color", content: "#0A192F" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/clicklogo.png" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: () => (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased text-white overflow-x-hidden bg-[#050B14]">
        {/* Анимированный фон */}
        <AnimatedBackground />

        {/* Контент поверх фона */}
        <div className="relative z-10 flex min-h-screen flex-col pb-20 md:pb-0">
          <PreviewHostBridge />
          <AuthProvider>
            <Shell>
              <Outlet />
            </Shell>
            <MobileNav />
          </AuthProvider>
        </div>

        <Scripts />
      </body>
    </html>
  ),
});
