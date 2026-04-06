export interface Ticket {
  id: number;
  subject: string;
  sender_email: string;
  sender_name: string | null;
  body: string;
  summary: string | null;
  priority: "high" | "medium" | "low";
  category: string | null;
  status: "new" | "in_progress" | "on_hold" | "closed";
  created_at: string;
  updated_at: string;
}

export interface TicketResponse {
  id: number;
  ticket_id: number;
  ai_suggestion: string | null;
  final_response: string | null;
  responded_at: string;
}
