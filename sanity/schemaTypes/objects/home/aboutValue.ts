import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

export const aboutValueType = defineType({
  name: 'aboutValue',
  title: 'Value',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'richText',
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
