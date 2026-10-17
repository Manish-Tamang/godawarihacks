import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

export const prizeCardType = defineType({
  name: 'prizeCard',
  title: 'Prize',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'amount',
      type: 'string',
      description: 'Prize amount, for example "रु. 60,000 Worth"',
    }),
    defineField({
      name: 'description',
      type: 'string',
      description: 'Short label when there is no amount',
    }),
    defineField({
      name: 'icon',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'gradientFrom',
      title: 'Gradient from',
      type: 'string',
    }),
    defineField({
      name: 'gradientTo',
      title: 'Gradient to',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'amount', media: 'icon'},
  },
})
