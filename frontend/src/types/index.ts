export interface User { id: number; email: string; created_at?: string }
export interface Todo { id: number; title: string; completed: boolean; created_at: string; user_id: number }
export interface TokenResponse { access_token: string; token_type: string }
