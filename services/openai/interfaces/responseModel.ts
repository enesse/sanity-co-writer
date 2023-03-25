export interface ResponseModel {
  id: string
  object: string
  created: number
  model: string
  choices: Choice[]
}

export interface Choice {
  delta: Delta
  index: number
  finish_reason: any
}

export interface Delta {
  content: string
  role: string
}
