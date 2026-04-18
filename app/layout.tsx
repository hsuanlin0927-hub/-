export const metadata = {
  title: "Travel Planner",
  description: "MVP 測試版",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#0B0F14",
        }}
      >
        {children}
      </body>
    </html>
  );
}