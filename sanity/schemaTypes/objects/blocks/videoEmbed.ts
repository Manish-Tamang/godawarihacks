import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

/**
 * Only the embed URL is stored. Video never goes into a Sanity file asset:
 * those are served as raw downloads, with no transcoding or adaptive
 * streaming, and the bandwidth bill is brutal.
 */
export const videoEmbedType = defineType({
  name: 'videoEmbed',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube or Vimeo URL',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['http', 'https']})
          .custom((value) => {
            if (typeof value !== 'string') return true
            return /(youtube\.com|youtu\.be|vimeo\.com)/.test(value)
              ? true
              : 'Only YouTube and Vimeo links are supported'
          }),
    }),
    defineField({
      name: 'title',
      description: 'Used as the iframe title for screen readers',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'url'},
    prepare: ({title, subtitle}) => ({title: title || 'Video', subtitle}),
  },
})
