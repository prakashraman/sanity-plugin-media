import {Box, Text} from '@sanity/ui'
import type {Folder} from '../../modules/folders'
import {styled} from 'styled-components'

const FolderContainer = styled(Box)`
  padding: 8px 8px 8px 12px;
`

type Props = {
  folder: Folder
}

const Folder = ({folder}: Props) => {
  return (
    <FolderContainer>
      <Text muted size={1} textOverflow="ellipsis">
        {folder.name}
      </Text>
    </FolderContainer>
  )
}

export default Folder
