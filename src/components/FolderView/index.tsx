import {Box, Flex, Text} from '@sanity/ui'

import useTypedSelector from '../../hooks/useTypedSelector'
import {selectAssetsPickedLength} from '../../modules/assets'

import TagViewHeader from '../TagViewHeader'
import {selectFolders} from '../../modules/folders'
import Folder from '../Folder'
import {buildTree} from './utils'

const FolderView = () => {
  const numPickedAssets = useTypedSelector(selectAssetsPickedLength)
  const folders = useTypedSelector(selectFolders)
  const fetching = useTypedSelector(state => state.tags.fetching)
  const fetchCount = useTypedSelector(state => state.tags.fetchCount)
  const fetchComplete = fetchCount !== -1
  const hasFolders = !fetching && folders?.length > 0
  const hasPicked = !!(numPickedAssets > 0)

  const tree = buildTree(folders)

  return (
    <Flex direction="column">
      <TagViewHeader light={hasPicked} title={hasPicked ? 'Folders (in selection)' : 'Folders'} />

      {fetchComplete && !hasFolders && (
        <Box padding={3}>
          <Text muted size={1}>
            <em>No folders</em>
          </Text>
        </Box>
      )}

      {hasFolders && tree.map(folder => <Folder key={folder._id} item={folder} />)}
    </Flex>
  )
}

export default FolderView
