import {lazy} from 'react'
import {DocumentInspector} from 'sanity'
import {SiProbot} from 'react-icons/si'

export const customInspector: DocumentInspector = {
  icon: SiProbot,
  name: 'sanity-co-writer',
  title: 'Co-writer',
  component: lazy(() => import('./inspector')),
  onClose({setParams}) {
    setParams((params) => ({...params, inspect: undefined}))
  },
  onOpen({setParams}) {
    setParams((params) => ({...params, inspect: 'sanity-co-writer'}))
  },
}
