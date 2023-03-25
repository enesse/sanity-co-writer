import {RequestModel, Message} from '../interfaces/requestModel'
import {ResponseModel} from '../interfaces/responseModel'

export async function GetChatStream(
  messages: Message[],
  chuckReadCallback: (chunckMessage: string) => void
): Promise<void> {
  if (!messages) {
    return
  }

  const body: RequestModel = {
    frequency_penalty: 0.5,
    max_tokens: 1000,
    messages: messages,
    model: 'gpt-3.5-turbo',
    presence_penalty: 0,
    stream: true,
    temperature: 0.7,
    top_p: 1,
  }

  await fetch(`${process.env.SANITY_STUDIO_OPENAI_CHAT_COMPLETIONS_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SANITY_STUDIO_OPENAI_APIKEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(async (response) => {
    if (response) {
      const reader = response?.body?.getReader()
      if (reader)
        for await (const chunk of readChunks(reader)) {
          const responses = parseChuck(chunk)
          responses.forEach((r) => {
            const message = r.choices[0].delta.content
            if (message) {
              chuckReadCallback(message)
            }
          })
        }
    }
  })
}

export function readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read()
      while (!readResult.done) {
        yield readResult.value
        readResult = await reader.read()
      }
    },
  }
}

//Found this thread after writing my own implementation
//https://github.com/openai/openai-node/issues/18#issuecomment-1369996933
export function parseChuck(chunk: Uint8Array): ResponseModel[] {
  const rawChunckText = new TextDecoder().decode(chunk)
  if (rawChunckText.includes('data: [DONE]')) {
    return []
  }
  const responses: ResponseModel[] = []
  rawChunckText.split('\n').forEach((line) => {
    if (line) {
      const start = line.indexOf('{')
      const jsonText = line.substring(start)
      const response = JSON.parse(jsonText) as ResponseModel
      responses.push(response)
    }
  })

  return responses
}
