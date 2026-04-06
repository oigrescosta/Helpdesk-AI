import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Ticket } from "../types";

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  new: "Novo",
  in_progress: "Em Progresso",
  on_hold: "Em Espera",
  closed: "Fechado",
};

const mockTickets: Ticket[] = [
  {
    id: 1,
    subject: "Erro ao fazer login na plataforma",
    sender_email: "joao.silva@empresa.pt",
    sender_name: "João Silva",
    body: "Bom dia, não consigo aceder à minha conta desde ontem. Aparece uma mensagem de erro 500.",
    summary: "Utilizador reporta erro 500 ao tentar fazer login desde ontem.",
    priority: "high",
    category: "Autenticação",
    status: "new",
    created_at: "2026-04-07T09:15:00Z",
    updated_at: "2026-04-07T09:15:00Z",
  },
  {
    id: 2,
    subject: "Como exportar relatório mensal?",
    sender_email: "ana.costa@cliente.com",
    sender_name: "Ana Costa",
    body: "Olá, preciso de exportar o relatório de março em PDF. Onde encontro essa opção?",
    summary: "Cliente procura funcionalidade de exportação de relatórios em PDF.",
    priority: "low",
    category: "Dúvida",
    status: "in_progress",
    created_at: "2026-04-06T14:30:00Z",
    updated_at: "2026-04-07T08:00:00Z",
  },
  {
    id: 3,
    subject: "Fatura em duplicado — cobrança errada",
    sender_email: "pedro.mendes@loja.pt",
    sender_name: "Pedro Mendes",
    body: "Fui cobrado duas vezes pela mesma fatura (INV-2026-0451). Peço a correção urgente.",
    summary: "Cliente reporta cobrança duplicada na fatura INV-2026-0451.",
    priority: "high",
    category: "Faturação",
    status: "new",
    created_at: "2026-04-07T10:45:00Z",
    updated_at: "2026-04-07T10:45:00Z",
  },
  {
    id: 4,
    subject: "Pedido de integração com API externa",
    sender_email: "maria.fernandes@tech.pt",
    sender_name: "Maria Fernandes",
    body: "Gostaríamos de integrar o vosso sistema com a nossa API de inventário. Podem enviar a documentação?",
    summary: "Pedido de documentação para integração com API de inventário externa.",
    priority: "medium",
    category: "Integração",
    status: "on_hold",
    created_at: "2026-04-05T16:20:00Z",
    updated_at: "2026-04-06T11:00:00Z",
  },
  {
    id: 5,
    subject: "Página de checkout não carrega",
    sender_email: "carlos.ramos@email.pt",
    sender_name: "Carlos Ramos",
    body: "A página de checkout fica em branco no Chrome. No Firefox funciona normalmente.",
    summary: "Bug no checkout — página em branco no Chrome, funciona no Firefox.",
    priority: "high",
    category: "Bug",
    status: "in_progress",
    created_at: "2026-04-06T09:00:00Z",
    updated_at: "2026-04-07T07:30:00Z",
  },
  {
    id: 6,
    subject: "Obrigado pelo excelente suporte!",
    sender_email: "sofia.lopes@gmail.com",
    sender_name: "Sofia Lopes",
    body: "Queria agradecer a rápida resolução do meu problema anterior. Continuem o bom trabalho!",
    summary: "Feedback positivo de cliente sobre resolução rápida de problema anterior.",
    priority: "low",
    category: "Feedback",
    status: "closed",
    created_at: "2026-04-04T12:00:00Z",
    updated_at: "2026-04-04T12:30:00Z",
  },
];

export function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => {
        if (!res.ok) throw new Error("API indisponível");
        return res.json();
      })
      .then((data) => setTickets(data.length > 0 ? data : mockTickets))
      .catch(() => setTickets(mockTickets))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tickets</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Assunto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Remetente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Prioridade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  A carregar tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Nenhum ticket encontrado.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {ticket.subject}
                    </Link>
                    {ticket.summary && (
                      <p className="text-sm text-gray-500 mt-1">
                        {ticket.summary}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {ticket.sender_name || ticket.sender_email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority] || ""}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {statusLabels[ticket.status] || ticket.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(ticket.created_at).toLocaleDateString("pt-PT")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
