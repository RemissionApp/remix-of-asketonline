// Types for Universe Chat functionality
export interface UniverseChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'universe';
  created_at: string;
  session_id?: string;
  user_id?: string;
}

export interface UniverseChatSession {
  id: string;
  title: string;
  last_message: string;
  created_at: string;
  user_id?: string;
}
