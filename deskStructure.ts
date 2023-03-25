import {StructureBuilder} from 'sanity/desk'
import openCoWriter from './components/coWriter/coWriter'
import {SiProbot} from 'react-icons/si'

export const defaultDocumentNodeResolver = (S: StructureBuilder) =>
  S.document().views([
    S.view.form(),
    S.view.component(openCoWriter).title('Co-writer').icon(SiProbot),
  ])
