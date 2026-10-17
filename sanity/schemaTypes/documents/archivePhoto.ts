import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'
import {CURRENT_SEASON, SEASONS} from '../../lib/seasons'

export const archivePhotoType = defineType({
  name: 'archivePhoto',
  title: 'Archive Photo',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describes the photo for screen readers. Not shown on screen.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'caption',
      type: 'string',
      description:
        'Short label overlaid bottom-right, e.g. "’26 Winner". Keep it to a few words.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'season',
      type: 'string',
      options: {list: SEASONS.map((year) => ({title: year, value: year}))},
      initialValue: CURRENT_SEASON,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'originalFilename',
      title: 'Original Filename',
      type: 'string',
      readOnly: true,
      hidden: true,
      description: 'Set by the import script so re-runs do not duplicate.',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Season (newest first)',
      name: 'seasonDesc',
      by: [
        {field: 'season', direction: 'desc'},
        {field: 'order', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      caption: 'caption',
      alt: 'alt',
      season: 'season',
      order: 'order',
      media: 'image',
    },
    prepare({caption, alt, season, order, media}) {
      return {
        title: caption || alt || 'Untitled photo',
        subtitle: `${season ?? '—'} · #${order ?? '?'}`,
        media,
      }
    },
  },
})
