import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

/**
 * A news article that covered Godawari Hacks, listed under "Featured in" on
 * the About page.
 */
export const pressMentionType = defineType({
  name: 'pressMention',
  title: 'Press Mention',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'outlet',
      type: 'string',
      description: 'Publication name, e.g. TechPana',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      description: 'Article headline, in its original language',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'date',
    }),
    defineField({
      name: 'image',
      type: 'image',
      description: 'Article cover image',
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
      title: 'title',
      subtitle: 'outlet',
      media: 'image',
    },
  },
})
