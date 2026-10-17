import {defineArrayMember, defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons'

export const aboutSectionType = defineType({
  name: 'aboutSection',
  title: 'About',
  type: 'object',
  icon: InfoOutlineIcon,
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
      name: 'values',
      type: 'array',
      of: [defineArrayMember({type: 'aboutValue'})],
    }),
    defineField({
      name: 'expectations',
      title: 'What to expect',
      type: 'array',
      of: [defineArrayMember({type: 'expectationItem'})],
    }),
  ],
})
