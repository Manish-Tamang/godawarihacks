import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons'

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'city',
      type: 'string',
    }),
    defineField({
      name: 'dates',
      description: 'Display text for dates (e.g. "18th - 19th January 2026")',
      type: 'string',
    }),
    defineField({
      name: 'plusCode',
      title: 'Plus Code / Address Code',
      type: 'string',
    }),
    defineField({
      name: 'landmark',
      type: 'string',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps URL',
      type: 'url',
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
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'image',
    },
  },
})
