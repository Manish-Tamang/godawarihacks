import {defineArrayMember, defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

export const prizePoolSectionType = defineType({
  name: 'prizePoolSection',
  title: 'Prize pool',
  type: 'object',
  icon: StarIcon,
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
      name: 'prizes',
      title: 'Prize cards',
      type: 'array',
      of: [defineArrayMember({type: 'prizeCard'})],
    }),
  ],
})
