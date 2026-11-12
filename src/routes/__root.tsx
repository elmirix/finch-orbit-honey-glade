import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Shell } from "@/components/shell";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Click — подготовка к экзаменам" },
      {
        name: "description",
        content:
          "Click — отдельные программы подготовки к ОРТ, SAT и IELTS: теория, практика и пробный экзамен.",
      },
      { name: "theme-color", content: "#0A192F" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/clicklogo.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "apple-touch-icon", href: "/clicklogo.png" },
    ],
  }),
  component: () => (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Shell>
            <Outlet />
          </Shell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
