import {defineField, defineType, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const photoGalleryType = defineType({
  name: 'photoGallery',
  title: 'Photo Gallery',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Heading above the photos.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Paragraph under the heading.',
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (rule) =>
                rule.required().warning('Alt text improves accessibility and SEO'),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
          ],
        }),
      ],
    }),
  ],
})
