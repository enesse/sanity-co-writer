export interface Message {
  role: string
  content: string
}

export interface RequestModel {
  messages: Message[]
  temperature: number
  max_tokens: number
  top_p: number
  frequency_penalty: number
  presence_penalty: number
  model: string
  stream: boolean
}
