"use client";
import { useState, useEffect } from "react";
import { rooms, money } from "../stay-data";
import { ArrowLeft, ArrowUpRight, RefreshCw, Download } from "lucide-react";
type Inquiry = {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  room: string;
  start: string;
  end: string;
  guests: number;
  message: string;
  estimate: number;
  status: string;
  createdAt: number;
};
export default function Inbox() {
  const [rows, setRows] = useState<Inquiry[]>([]),
    [message, setMessage] = useState("Loading inquiries…"),
    [busy, setBusy] = useState(false);
  async function refresh() {
    setBusy(true);
    try {
      const r = await fetch("/api/reservations");
      if (!r.ok) throw Error("Unable to load your inquiries.");
      setRows((await r.json()) as Inquiry[]);
      setMessage("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to load inquiries.");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void refresh();
  }, []);
  async function update(id: string, status: string) {
    try {
      const r = await fetch("/api/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!r.ok) throw Error();
      setRows(rows.map((row) => (row.id === id ? { ...row, status } : row)));
      setMessage("Inquiry status saved.");
    } catch {
      setMessage("Unable to update the inquiry. Please try again.");
    }
  }
  function exportRows() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "laya-reservation-inquiries.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="inbox">
      <a className="text-link" href="/">
        <ArrowLeft size={16} /> Back to Laya
      </a>
      <h1>
        A little room
        <br />
        for <em>new arrivals.</em>
      </h1>
      <p>
        Host inbox · {rows.length} reservation inquiries · Privately hosted for
        the site owner.
      </p>
      <div className="inbox-actions">
        <button className="button forest" disabled={busy} onClick={refresh}>
          <RefreshCw size={15} /> Refresh inquiries
        </button>
        <button className="text-link" onClick={exportRows}>
          <Download size={15} /> Export JSON
        </button>
        <a className="text-link" href="/">
          View website <ArrowUpRight size={16} />
        </a>
      </div>
      {message && <p role="status">{message}</p>}
      {!busy && !rows.length && !message && (
        <p>
          Your next getaway inquiry will appear here. No reservations are
          confirmed automatically.
        </p>
      )}
      {rows.map((r) => (
        <article className="inbox-card" key={r.id}>
          <div className="inbox-row">
            <div>
              <span className="eyebrow">{r.reference}</span>
              <h3>{r.name}</h3>
            </div>
            <select
              aria-label={"Status for " + r.reference}
              value={r.status}
              onChange={(e) => update(r.id, e.target.value)}
            >
              {["New", "Contacted", "Closed"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="inbox-meta">
            <a href={"mailto:" + r.email}>{r.email}</a>
            <span>{r.phone}</span>
            <span>
              {new Date(r.createdAt).toLocaleString("en-PH", {
                timeZone: "Asia/Manila",
              })}
            </span>
          </div>
          <p>
            <strong>{rooms.find((x) => x.id === r.room)?.name}</strong> ·{" "}
            {r.start} → {r.end} · {r.guests} guests
          </p>
          <p>
            Sample estimate: {money(r.estimate)} · Inquiry only, no confirmed
            booking
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {r.message || "No special requests."}
          </p>
        </article>
      ))}
    </main>
  );
}
