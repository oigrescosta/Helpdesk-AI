import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Ticket } from "../types";

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tickets/${id}`)
      .then((res) => res.json())
      .then(setTicket)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">A carregar...</p>;
  if (!ticket) return <p className="text-red-500">Ticket não encontrado.</p>;

  return (
    <div>
      <Link to="/" className="text-blue-600 hover:underline text-sm">
        &larr; Voltar ao dashboard
      </Link>

      <div className="bg-white shadow rounded-lg mt-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{ticket.subject}</h2>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
          <div>
            <span className="font-medium">De:</span>{" "}
            {ticket.sender_name} &lt;{ticket.sender_email}&gt;
          </div>
          <div>
            <span className="font-medium">Prioridade:</span> {ticket.priority}
          </div>
          <div>
            <span className="font-medium">Categoria:</span>{" "}
            {ticket.category || "N/A"}
          </div>
          <div>
            <span className="font-medium">Criado:</span>{" "}
            {new Date(ticket.created_at).toLocaleString("pt-PT")}
          </div>
        </div>

        {ticket.summary && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-1">
              Resumo AI
            </h3>
            <p className="text-sm text-blue-700">{ticket.summary}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Mensagem original
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-sm text-gray-800">
            {ticket.body}
          </div>
        </div>
      </div>
    </div>
  );
}
