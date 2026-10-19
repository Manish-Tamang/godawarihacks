import {defineField, defineType} from 'sanity'
import {ClipboardIcon} from '@sanity/icons'
import {DEFAULT_RULES} from '../../lib/default-rules'

export const rulesPageType = defineType({
  name: 'rulesPage',
  title: 'Rules Page',
  type: 'document',
  icon: ClipboardIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      initialValue: 'Rules',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Short intro shown under the title',
      type: 'text',
      rows: 2,
      group: 'content',
      initialValue:
        'Everything you need to know to compete fairly at Godawari Hacks.',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Rules',
      type: 'blogContent',
      group: 'content',
      initialValue: DEFAULT_RULES,
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'Rules'}),
  },
})
