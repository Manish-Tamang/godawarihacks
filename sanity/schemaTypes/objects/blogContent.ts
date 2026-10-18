import {defineArrayMember, defineField, defineType} from 'sanity'
import {HighlightIcon, StrikethroughIcon, UnderlineIcon} from '@sanity/icons'

/**
 * The body of a blog post: Portable Text plus the embeddable blocks defined in
 * ./blocks. Richer than `richText`, which stays deliberately small because it
 * is reused for short homepage copy.
 *
 * Every member type here needs a renderer in
 * app/components/PortableTextContent.tsx — an unhandled `_type` renders as
 * nothing.
 */
export const blogContentType = defineType({
  name: 'blogContent',
  title: 'Blog Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Number', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Code', value: 'code'},
          {title: 'Underline', value: 'underline', icon: UnderlineIcon},
          {
            title: 'Strikethrough',
            value: 'strike-through',
            icon: StrikethroughIcon,
          },
          {title: 'Highlight', value: 'highlight', icon: HighlightIcon},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'URL',
                description: 'External URL, or a path on this site (/register)',
                validation: (rule) =>
                  rule.required().uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                    allowRelative: true,
                  }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in a new tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),

    defineArrayMember({
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (rule) =>
            rule.required().warning('Alt text is important for SEO'),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
      ],
    }),

    defineArrayMember({type: 'buttonGroup'}),
    defineArrayMember({type: 'callout'}),
    defineArrayMember({type: 'contentTable'}),
    defineArrayMember({type: 'codeBlock'}),
    defineArrayMember({type: 'videoEmbed'}),
    defineArrayMember({type: 'pullQuote'}),
    defineArrayMember({type: 'divider'}),
  ],
})
