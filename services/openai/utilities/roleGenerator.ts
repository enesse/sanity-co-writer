import {BlockDecoratorProps, SanityDocument} from 'sanity'
import {
  ChatGPT_RoleInstructions,
  ChatGPT_RoleInstructions_HasBody,
  ChatGPT_RoleInstructions_HasTitle,
} from '../../../components/coWriter/literalConstants'
import {Message} from '../interfaces/requestModel'

export function generateSystemRole(props: SanityDocument | null | undefined): Message {
  const title: string = (props && (props['title'] as string)) || ''
  const body: BlockDecoratorProps | undefined | null =
    props && (props['body'] as BlockDecoratorProps | undefined)

  var instructions = ChatGPT_RoleInstructions
  if (title) {
    instructions = instructions.concat('', `${ChatGPT_RoleInstructions_HasTitle}: ${title}`)
  }
  if (body) {
    instructions = instructions.concat(
      '',
      `${ChatGPT_RoleInstructions_HasBody}: ${toPlainText(body)}`
    )
  }
  return {
    role: 'system',
    content: instructions,
  }

  function toPlainText(blocks: BlockDecoratorProps) {
    if (!Array.isArray(blocks)) return [blocks]

    const blockString = blocks
      .map((block) => {
        if (block._type !== 'block' || !block.children) {
          return ''
        }

        return block.children.map((child: {text: any}) => child.text).join('')
      })
      .join('\n\n')

    return blockString
  }
}
