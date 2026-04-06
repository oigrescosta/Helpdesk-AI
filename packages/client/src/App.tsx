import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { TicketDetail } from "./pages/TicketDetail";

export default function App() {
  const [health, setHealth] = useState<{
    status: string;
    timestamp: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        {health && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow text-sm">
            API online — {new Date(health.timestamp).toLocaleTimeString("pt-PT")}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow text-sm">
            API offline — {error}
          </div>
        )}
      </div>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Route>
      </Routes>
    </>
  );
}
