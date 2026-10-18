import {defineField, defineType} from 'sanity'
import {BlockquoteIcon} from '@sanity/icons'

export const pullQuoteType = defineType({
  name: 'pullQuote',
  title: 'Pull Quote',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'quote',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'attribution',
      description: 'Who said it',
      type: 'string',
    }),
    defineField({
      name: 'role',
      description: 'Their title or affiliation',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'quote', subtitle: 'attribution'},
  },
})
