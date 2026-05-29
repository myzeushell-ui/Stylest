// Контракт «мозга» приложения. Реализацию (mock / Anthropic / другой вендор)
// можно подменить, не трогая роуты и фронт.

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIChatRequest {
  /** Системная инструкция + контекст пользователя (профиль, Style DNA). */
  system: string;
  messages: AIChatMessage[];
}

export interface AIChatResponse {
  content: string;
  provider: string;
}

export interface AIProvider {
  readonly name: string;
  chat(req: AIChatRequest): Promise<AIChatResponse>;
}
