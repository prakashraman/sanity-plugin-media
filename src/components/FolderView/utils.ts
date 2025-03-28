import type {Folder, FolderTreeItem} from '../../types'

// Function to transform the flat list into a nested tree structure
export const buildTree = (folders: Folder[]): FolderTreeItem[] => {
  const folderMap: Record<string, FolderTreeItem> = {}

  // First, we create a map of folders by their _id
  folders.forEach(folder => {
    folderMap[folder._id] = {...folder, children: []}
  })

  const tree: FolderTreeItem[] = []

  // Now, we build the tree structure
  folders.forEach(folder => {
    if (folder.parent && folder.parent._id) {
      folderMap[folder.parent._id]?.children.push(folderMap[folder._id])
    } else {
      tree.push(folderMap[folder._id])
    }
  })

  return tree
}
