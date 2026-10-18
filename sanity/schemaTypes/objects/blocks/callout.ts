import {defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons'

export const CALLOUT_TONES = [
  {title: 'Info', value: 'info'},
  {title: 'Tip', value: 'tip'},
  {title: 'Warning', value: 'warning'},
  {title: 'Success', value: 'success'},
] as const

export const calloutType = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'tone',
      type: 'string',
      options: {list: [...CALLOUT_TONES], layout: 'radio', direction: 'horizontal'},
      initialValue: 'info',
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      type: 'richText',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', tone: 'tone'},
    prepare: ({title, tone}) => ({
      title: title || 'Callout',
      subtitle: typeof tone === 'string' ? tone : 'info',
    }),
  },
})
