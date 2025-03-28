import {Box, Text} from '@sanity/ui'
import {styled} from 'styled-components'

const FolderContainer = styled(Box)`
  padding: 8px 8px 8px 12px;
`

type Props = {
  _id: string
  name: string
}

const Folder = ({name}: Props) => {
  return (
    <FolderContainer>
      <Text muted size={1} textOverflow="ellipsis">
        {name}
      </Text>
    </FolderContainer>
  )
}

export default Folder
