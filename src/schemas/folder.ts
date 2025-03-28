import {FOLDER_DOCUMENT_NAME} from '../constants'
import TagIcon from '../components/TagIcon'

export default {
  title: 'Media Folder',
  icon: TagIcon,
  name: FOLDER_DOCUMENT_NAME,
  type: 'document',
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'slug'
    },
    {
      title: 'Parent Folder',
      name: 'parent',
      type: 'reference',
      to: [{type: FOLDER_DOCUMENT_NAME}],
      description: 'Select a parent folder if this is a subfolder.'
    }
  ],
  preview: {
    select: {
      name: 'name'
    },
    prepare(selection: any) {
      const {name} = selection
      return {
        media: TagIcon,
        title: name?.current
      }
    }
  }
}
