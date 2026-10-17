import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

export const sponsorType = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
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
      name: 'url',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'tier',
      type: 'string',
      options: {
        list: [
          {title: 'Platinum', value: 'platinum'},
          {title: 'Title', value: 'title'},
          {title: 'Gold', value: 'gold'},
          {title: 'Silver', value: 'silver'},
          {title: 'Bronze', value: 'bronze'},
          {title: 'Community', value: 'community'},
        ],
        layout: 'radio',
      },
      initialValue: 'community',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'tier',
      media: 'logo',
    },
  },
})
