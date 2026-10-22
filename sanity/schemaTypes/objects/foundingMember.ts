import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

/**
 * A founding team member shown on the About page. Unlike `teamMember` (the
 * current season's team on the homepage), only the name is required.
 */
export const foundingMemberType = defineType({
  name: 'foundingMember',
  title: 'Founding Member',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      description: 'Optional',
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
      subtitle: 'role',
      media: 'image',
    },
  },
})
