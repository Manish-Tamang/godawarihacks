import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({scheme: ['https', 'http']}),
    }),
    defineField({
      name: 'logo',
      title: 'Site Logo',
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
      name: 'ogImage',
      title: 'Default OG Image',
      description: 'Default social sharing image (1200x630)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
  ],
})
