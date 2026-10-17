import {defineArrayMember, defineField, defineType} from 'sanity'
import {HeartIcon} from '@sanity/icons'

export const commitmentSectionType = defineType({
  name: 'commitmentSection',
  title: 'Commitment',
  type: 'object',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'richText',
    }),
    defineField({
      name: 'partners',
      type: 'array',
      of: [defineArrayMember({type: 'partner'})],
    }),
  ],
})
