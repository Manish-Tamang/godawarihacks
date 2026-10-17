import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'
import {CURRENT_SEASON, SEASONS} from '../../../lib/seasons'

export const REGISTRATION_STATUSES = [
  {title: 'Pending', value: 'pending'},
  {title: 'Approved', value: 'approved'},
  {title: 'Rejected', value: 'rejected'},
  {title: 'Cancelled', value: 'cancelled'},
] as const


export const teamRegistrationType = defineType({
  name: 'teamRegistration',
  title: 'Team Registration',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'teamName',
      title: 'Team Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'string',
      options: {list: SEASONS.map((year) => ({title: year, value: year}))},
      initialValue: CURRENT_SEASON,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {list: [...REGISTRATION_STATUSES], layout: 'radio'},
      initialValue: 'pending',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'registeredAt',
      title: 'Registered At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'members',
      type: 'array',
      of: [defineArrayMember({type: 'registrationMember'})],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'paymentScreenshot',
      title: 'Payment Screenshot',
      type: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'paymentVerified',
      title: 'Payment Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
      rows: 3,
      description: 'Internal only — never shown to registrants.',
    }),
    defineField({
      name: 'legacySupabaseId',
      title: 'Legacy Supabase ID',
      type: 'string',
      readOnly: true,
      hidden: true,
      description: 'Set by the migration script so re-runs do not duplicate.',
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'registeredAtDesc',
      by: [{field: 'registeredAt', direction: 'desc'}],
    },
    {
      title: 'Season (newest first)',
      name: 'seasonDesc',
      by: [
        {field: 'season', direction: 'desc'},
        {field: 'registeredAt', direction: 'desc'},
      ],
    },
    {
      title: 'Team Name',
      name: 'teamNameAsc',
      by: [{field: 'teamName', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'teamName',
      season: 'season',
      status: 'status',
      memberCount: 'members.length',
      media: 'paymentScreenshot',
    },
    prepare({title, season, status, memberCount, media}) {
      const size = memberCount ?? 0
      return {
        title: `[${season ?? '—'}] ${title}`,
        subtitle: `${status ?? 'pending'} · ${size} member${size === 1 ? '' : 's'}`,
        media,
      }
    },
  },
})
