import {defineField, defineType} from 'sanity'
import {ChartUpwardIcon} from '@sanity/icons'

export const statItemType = defineType({
  name: 'statItem',
  title: 'Stat',
  type: 'object',
  icon: ChartUpwardIcon,
  fields: [
    defineField({
      name: 'number',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'number', subtitle: 'label'},
  },
})
