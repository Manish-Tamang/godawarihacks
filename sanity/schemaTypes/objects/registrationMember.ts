import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const DOCUMENT_TYPE_OPTIONS = [
  {title: 'National ID', value: 'id'},
  {title: 'Citizenship', value: 'citizenship'},
  {title: 'Birth Certificate', value: 'birthcertificate'},
] as const

export const registrationMemberType = defineType({
  name: 'registrationMember',
  title: 'Member',
  type: 'object',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'documentType',
      title: 'Document Type',
      type: 'string',
      options: {list: [...DOCUMENT_TYPE_OPTIONS]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'document',
      title: 'Identity Document',
      type: 'file',
      description:
        'Anyone with this file URL can download it, even though the dataset is private. Do not share it outside the organising team.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'fullName', subtitle: 'email'},
  },
})
