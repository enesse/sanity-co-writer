import {Avatar, Box, Stack, Flex, Spinner, Button, TextArea, Card, Text, useToast} from '@sanity/ui'
import {BlockDecoratorProps} from 'sanity'
import {BsSend} from 'react-icons/bs'
import {useState, useEffect, KeyboardEvent} from 'react'
import {ReactMarkdown} from 'react-markdown/lib/react-markdown'
import {Message} from '../../services/openai/interfaces/requestModel'
import {GetChatStream} from '../../services/openai/services/chatGptService'
import {generateSystemRole} from '../../services/openai/utilities/roleGenerator'
import {useCurrentUser} from 'sanity'
import coWriterAvatar from '../../assets/images/co-writer-icon.png'
import * as literal from './literalConstants'

export default function openCoWriter(props: any) {
  const systemRoleMessage: Message = generateSystemRole(props)
  const user = useCurrentUser()
  const [userInput, setUserInput] = useState<string>('')
  const [chatOutput, setChatOutput] = useState<string>('')
  const [chatLogs, setChatLog] = useState<Message[]>([systemRoleMessage])
  const [isBusy, setIsBusy] = useState<boolean>(false)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const toast = useToast()

  useEffect(() => {
    if (!isStreaming && chatOutput) {
      addStreamMessage()
      setChatOutput('')
    }
  }, [isStreaming])

  async function sendChat(requestMessage: string): Promise<void> {
    if (!requestMessage || isBusy) {
      return
    }

    setIsBusy(true)
    setUserInput('')

    const userMessage: Message = {role: 'user', content: requestMessage}
    const userUpdatedLogs = [...chatLogs, userMessage]
    setChatLog(userUpdatedLogs)

    toast.push({
      title: 'Thinking..',
      status: 'info',
      duration: 1500,
    })

    setIsStreaming(true)
    await GetChatStream(userUpdatedLogs, updateChatStreamOutput)
    setIsStreaming(false)
    setIsBusy(false)
  }

  return (
    <Stack>
      <Card padding={1} radius={3} shadow={2} margin={2} tone="default">
        {renderChat()}
        {renderUserInput()}
      </Card>
    </Stack>
  )

  function renderChat() {
    return (
      <Flex align="flex-end" padding={3}>
        <Stack>
          {renderGreeting(props)}
          {renderPredefinedQuestions(props)}
          {chatLogs
            .filter((log) => log.role !== 'system')
            .map((log, index) => {
              return renderChatMessage(log, index)
            })}
          {renderTemporaryStreamChat()}
        </Stack>
      </Flex>
    )
  }

  function renderGreeting(props: any): any {
    return (
      <Flex gap={2} align="flex-start" padding={3}>
        <Avatar alt="The profile picture of a helpful co-writer" src={coWriterAvatar} size={1} />
        <Card padding={3} radius={5} marginBottom={3} tone="primary">
          <Text align="left" size={[2, 2, 1]}>
            <ReactMarkdown>{generateGreeting()}</ReactMarkdown>
          </Text>
        </Card>
      </Flex>
    )

    function generateGreeting() {
      const title: string = props.document.displayed.title
      const body: BlockDecoratorProps = props.document.displayed.body

      var greeting = literal.ChatGreeting_Intro.replace('{NAME}', parseUserFirstName())
      if (title) {
        greeting = greeting.concat(' ', `${literal.ChatGreeting_HasTitle} **${title}**`)
      }
      if (body) {
        greeting = greeting.concat(' ', literal.ChatGreeting_HasBody)
      }
      return greeting
    }
  }

  function parseUserFirstName(): string {
    return user?.name.split(' ')[0] as string
  }

  function renderPredefinedQuestions(props: any): any {
    const questions: string[] = generatePredefinedQuestions()

    return (
      <Flex gap={2} align="flex-start" padding={3}>
        <Avatar alt="The profile picture of a helpful co-writer" src={coWriterAvatar} size={1} />
        <Stack>
          <Card padding={3} radius={5} marginBottom={3} tone="primary">
            <Text align="left" size={[2, 2, 1]}>
              <ReactMarkdown>{literal.PredefinedQuestions_Intro}</ReactMarkdown>
            </Text>
          </Card>
          <Flex>
            {questions.map((question, index) => {
              return (
                <Card key={`predefined-questions-${index}`} padding={1} radius={5} marginBottom={1}>
                  <Button
                    tone="primary"
                    mode="ghost"
                    onClick={() => sendChat(question)}
                    radius={5}
                    readOnly={isBusy}
                  >
                    <Text size={1}>{question}</Text>
                  </Button>
                </Card>
              )
            })}
          </Flex>
        </Stack>
      </Flex>
    )

    function generatePredefinedQuestions() {
      const questions: string[] = []
      const title = props.document.displayed.title
      const body = props.document.displayed.body

      if (title) {
        questions.push(...literal.PredefinedQuestions_Title)
      } else {
        questions.push(...literal.PredefinedQuestions_NoTitle)
      }
      if (body) {
        questions.push(...literal.PredefinedQuestions_Body)
      } else {
        questions.push(...literal.PredefinedQuestions_NoBody)
      }

      questions.push(...literal.PredefinedQuestions_Default)
      return questions
    }
  }

  function renderTemporaryStreamChat(): any {
    return isStreaming ? (
      <Flex gap={2} align="center" padding={3}>
        <Avatar alt="The profile picture of a helpful co-writer" src={coWriterAvatar} size={1} />
        <Card padding={3} radius={5} marginBottom={3} shadow={0} tone={'primary'}>
          <Text size={[2, 2, 1]}>
            <ReactMarkdown>{chatOutput}</ReactMarkdown>
          </Text>
        </Card>
      </Flex>
    ) : (
      <span></span>
    )
  }

  function renderChatMessage(message: Message, index: number): any {
    return message.role === 'assistant' ? renderAssistantMessage() : renderUserMessage()

    function renderAssistantMessage(): any {
      return (
        <Flex key={`chat-flex-${index}`} gap={2} align="center" padding={3}>
          <Avatar
            key={`chat-avatar-${index}`}
            alt="The profile picture of a helpful co-writer"
            src={coWriterAvatar}
            color="blue"
            size={1}
          />
          <Card
            key={`chat-card-${index}`}
            padding={3}
            radius={5}
            marginBottom={3}
            shadow={0}
            tone="primary"
          >
            <Text key={`chat-text-${index}`} size={[2, 2, 1]}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </Text>
          </Card>
        </Flex>
      )
    }

    function renderUserMessage(): any {
      return (
        <Flex key={`chat-flex-${index}`} gap={2} align="center" padding={3}>
          <Avatar
            key={`chat-avatar-${index}`}
            alt={`${user?.name} profile picture`}
            src={user?.profileImage}
            size={1}
          />
          <Card
            key={`chat-card-${index}`}
            padding={3}
            radius={5}
            marginBottom={3}
            shadow={1}
            tone="default"
          >
            <Text key={`chat-text-${index}`} size={[2, 2, 1]}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </Text>
          </Card>
        </Flex>
      )
    }
  }

  function renderUserInput() {
    return (
      <Flex gap={2} align="flex-end" padding={3}>
        <Box flex={'auto'}>
          <TextArea
            onChange={(event) => setUserInput(event.currentTarget.value)}
            onKeyDown={(e) => handleUserInputKeyDown(e)}
            value={userInput}
            readOnly={isBusy}
            padding={3}
            radius={3}
          />
        </Box>
        <Box flex={1}>
          {isBusy ? (
            <Spinner muted />
          ) : (
            <Button
              icon={BsSend}
              tone="primary"
              mode="ghost"
              onClick={() => sendChat(userInput)}
              aria-label="Submit question"
              radius={5}
            />
          )}
        </Box>
      </Flex>
    )

    function handleUserInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
      if (e.key === 'Enter') {
        sendChat(userInput)
      }
    }
  }

  function updateChatStreamOutput(message: string) {
    setChatOutput((pre) => pre.concat(message))
  }

  function addStreamMessage() {
    const assistantMessage: Message = {role: 'assistant', content: chatOutput}
    const assistantUpdatedLogs = [...chatLogs, assistantMessage]
    setChatLog(assistantUpdatedLogs)
  }
}
