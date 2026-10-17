import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'
import {imageWithAlt} from '../objects/imageWithAlt'

export const partnerType = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    imageWithAlt('logo', 'Logo'),
    defineField({
      name: 'url',
      title: 'Website URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'name', media: 'logo'},
  },
})
