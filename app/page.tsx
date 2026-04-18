export default function HomePage() {
  return (
    <main
      style={{
        color: "white",
        padding: 24,
        minHeight: "100vh",
        background: "#0B0F14",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Travel Planner</h1>
      <p style={{ color: "#A8B3C7", marginBottom: 20 }}>
        試用版已建立
      </p>

      <a
        href="/history"
        style={{
          color: "#67a3ff",
          fontSize: 16,
          textDecoration: "none",
        }}
      >
        前往消費記錄頁
      </a>
    </main>
  );
}