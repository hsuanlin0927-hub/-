"use client";

import { useEffect, useState } from "react";

type Expense = {
  id: string;
  properties: any;
};

export default function HistoryPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tripId, setTripId] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const id = window.prompt("請輸入 Trip ID");
    if (id) {
      setTripId(id);
      loadData(id);
    }
  }, []);

  async function loadData(id: string) {
    const res = await fetch(`/api/expenses?tripId=${id}`);
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  }

  async function addExpense() {
    if (!title || !amount || !tripId) return;

    await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        amount: Number(amount),
        category: "飲食",
        date: new Date().toISOString(),
        tripId,
      }),
    });

    setTitle("");
    setAmount("");
    loadData(tripId);
  }

  const total = expenses.reduce((sum, e) => {
    return sum + (e.properties?.金額?.number || 0);
  }, 0);

  return (
    <div
      style={{
        padding: 16,
        color: "white",
        minHeight: "100vh",
        background: "#0B0F14",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>消費記錄</h1>

      <div
        style={{
          background: "#121821",
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ color: "#A8B3C7", marginBottom: 8 }}>總金額</div>
        <div style={{ fontSize: 32, fontWeight: 700 }}>¥ {total}</div>
        <div style={{ color: "#6F7C91", marginTop: 8 }}>共 {expenses.length} 筆</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="項目"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #263042",
            background: "#1A2230",
            color: "white",
          }}
        />
        <input
          placeholder="金額"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: 90,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #263042",
            background: "#1A2230",
            color: "white",
          }}
        />
        <button
          onClick={addExpense}
          style={{
            padding: "0 16px",
            borderRadius: 12,
            border: "none",
            background: "#5B8CFF",
            color: "white",
            fontSize: 20,
          }}
        >
          +
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {expenses.map((e) => {
          const p = e.properties;
          const item = p?.項目?.title?.[0]?.plain_text || "未命名";
          const money = p?.金額?.number || 0;
          const date = p?.日期?.date?.start || "";

          return (
            <div
              key={e.id}
              style={{
                background: "#121821",
                padding: 16,
                borderRadius: 16,
                border: "1px solid #263042",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 600 }}>{item}</div>
                <div style={{ fontWeight: 700 }}>¥ {money}</div>
              </div>
              <div style={{ color: "#6F7C91", fontSize: 13 }}>{date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}