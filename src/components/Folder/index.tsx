import {Box, Text, Button} from '@sanity/ui'
import {styled} from 'styled-components'
import {useState} from 'react'
import type {FolderTreeItem} from '../../types'

const FolderContainer = styled(Box)`
  padding: 8px 8px 0px 12px;
`

const FolderChildrenContainer = styled(Box)`
  padding-left: 8px;
`

const ToggleButton = styled('span')`
  display: inline-block;
  font-size: 12px;
  margin-left: 8px;
`

type Props = {
  item: FolderTreeItem
}

const Folder = ({item}: Props) => {
  // State to track whether the children are visible
  const [isOpen, setIsOpen] = useState(false)

  // Toggle the visibility of children
  const toggleChildrenVisibility = () => {
    setIsOpen(prevState => !prevState)
  }

  return (
    <FolderContainer>
      <Box display="flex">
        <Text muted size={1} textOverflow="ellipsis" style={{paddingBottom: '8px'}}>
          {item.name.current}
          {item.children.length > 0 && (
            <ToggleButton onClick={toggleChildrenVisibility}>{isOpen ? '[-]' : '[+]'}</ToggleButton>
          )}
        </Text>
        {/* Only show the button if there are children */}
      </Box>

      {/* Render children if the state isOpen is true */}
      {isOpen && item.children.length > 0 && (
        <FolderChildrenContainer>
          {item.children.map(child => (
            <Folder key={child._id} item={child} />
          ))}
        </FolderChildrenContainer>
      )}
    </FolderContainer>
  )
}

export default Folder
