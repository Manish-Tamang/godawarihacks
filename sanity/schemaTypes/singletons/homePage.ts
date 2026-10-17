import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'
import {imageWithAlt} from '../objects/imageWithAlt'

const general = 'general'
const sections = 'sections'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: general, title: 'General'},
    {name: sections, title: 'Sections'},
    {name: 'seo', title: 'SEO'},
  ],
  fieldsets: [
    {
      name: 'hero',
      title: 'Hero',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'event',
      title: 'Event',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'stats',
      title: 'Stats',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Event title',
      type: 'string',
      group: [general, sections],
      fieldset: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      description: 'Short description shown below the title',
      type: 'simpleRichText',
      group: [general, sections],
      fieldset: 'hero',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'Secondary description below the tagline',
      type: 'simpleRichText',
      group: [general, sections],
      fieldset: 'hero',
    }),
    imageWithAlt('heroBackground', 'Hero background', {
      group: [general, sections],
      fieldset: 'hero',
    }),
    imageWithAlt('collegeLogo', 'College logo', {
      group: [general, sections],
      fieldset: 'hero',
    }),
    defineField({
      name: 'collegeName',
      title: 'College name',
      type: 'string',
      group: [general, sections],
      fieldset: 'hero',
    }),
    defineField({
      name: 'collegeUrl',
      title: 'College URL',
      type: 'url',
      group: [general, sections],
      fieldset: 'hero',
    }),
    defineField({
      name: 'registrationStatus',
      title: 'Registration status',
      type: 'string',
      group: [general, sections],
      fieldset: 'hero',
      options: {
        list: [
          {title: 'Open', value: 'open'},
          {title: 'Closed', value: 'closed'},
          {title: 'Coming soon', value: 'coming_soon'},
        ],
        layout: 'radio',
      },
      initialValue: 'closed',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'datetime',
      group: general,
      fieldset: 'event',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'datetime',
      group: general,
      fieldset: 'event',
      validation: (rule) =>
        rule.required().custom((endDate, context) => {
          const startDate = (context.document as {startDate?: string} | undefined)?.startDate
          if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return 'End date must be after start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: sections,
      fieldset: 'stats',
      of: [defineArrayMember({type: 'statItem'})],
    }),
    defineField({
      name: 'commitment',
      title: 'Commitment',
      type: 'commitmentSection',
      group: sections,
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'prizePool',
      title: 'Prize pool',
      type: 'prizePoolSection',
      group: sections,
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'aboutSection',
      group: sections,
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'photoGallery',
      title: 'Photo gallery',
      description: 'Title, description, and photos for the diaries section.',
      type: 'photoGallery',
      group: sections,
      options: {collapsible: true, collapsed: false},
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'array',
      group: sections,
      of: [defineArrayMember({type: 'scheduleEvent'})],
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'venue',
      group: sections,
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'array',
      group: sections,
      of: [defineArrayMember({type: 'teamMember'})],
    }),
    defineField({
      name: 'sponsors',
      title: 'Sponsors',
      type: 'array',
      group: sections,
      of: [defineArrayMember({type: 'sponsor'})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
})
