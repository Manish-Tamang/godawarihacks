import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const scheduleEventType = defineType({
  name: 'scheduleEvent',
  title: 'Schedule event',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'day',
      type: 'string',
      options: {
        list: [
          {title: 'Day 1', value: 'Day 1'},
          {title: 'Day 2', value: 'Day 2'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'time',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'richText',
    }),
    defineField({
      name: 'location',
      type: 'string',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'time',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? `${subtitle}` : '',
        media,
      }
    },
  },
})
