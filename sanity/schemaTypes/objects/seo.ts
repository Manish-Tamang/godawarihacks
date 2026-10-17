import {defineField, defineType} from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      description: 'Overrides the page title for search engines',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning('Keep under 160 characters for best SEO'),
    }),
    defineField({
      name: 'image',
      description: 'Image for social sharing (1200x630 recommended)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      description: 'Hide this page from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
