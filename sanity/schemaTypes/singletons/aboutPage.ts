import {defineArrayMember, defineField, defineType} from 'sanity'
import {InfoOutlineIcon} from '@sanity/icons'
import {imageWithAlt} from '../objects/imageWithAlt'

const hero = 'hero'
const content = 'content'
const banner = 'banner'
const team = 'team'
const press = 'press'

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    {name: hero, title: 'Hero', default: true},
    {name: content, title: 'Content'},
    {name: banner, title: 'Banner'},
    {name: team, title: 'Founding Team'},
    {name: press, title: 'Featured In'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ── Hero ───────────────────────────────────────────────
    defineField({
      name: 'title',
      type: 'string',
      group: hero,
      initialValue: 'About Godawari Hacks',
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      rows: 2,
      group: hero,
      initialValue:
        'A student organized hackathon that brings together passionate students to build, learn, and innovate together.',
    }),
    // Three-photo collage under the heading: one large on the left, two
    // stacked on the right. Empty slots fall back to photos in /public.
    imageWithAlt('heroImage', 'Hero Image (large, left)', {group: hero}),
    imageWithAlt('heroImageSecondary', 'Hero Image (top right)', {group: hero}),
    imageWithAlt('heroImageTertiary', 'Hero Image (bottom right)', {group: hero}),

    // ── Content ────────────────────────────────────────────
    defineField({
      name: 'missionTitle',
      title: 'Mission Title',
      type: 'string',
      group: content,
      initialValue: 'Our Mission',
    }),
    defineField({
      name: 'mission',
      type: 'richText',
      group: content,
    }),
    defineField({
      name: 'valuesTitle',
      title: 'Values Title',
      type: 'string',
      group: content,
      initialValue: 'What We Stand For',
    }),
    defineField({
      name: 'values',
      type: 'array',
      group: content,
      description: 'Falls back to the homepage About values when empty',
      of: [defineArrayMember({type: 'aboutValue'})],
    }),
    defineField({
      name: 'expectationsTitle',
      title: 'Expectations Title',
      type: 'string',
      group: content,
      initialValue: 'What to Expect',
    }),
    defineField({
      name: 'expectations',
      title: 'What to expect',
      type: 'array',
      group: content,
      description: 'Falls back to the homepage About expectations when empty',
      of: [defineArrayMember({type: 'expectationItem'})],
    }),

    // ── Banner ─────────────────────────────────────────────
    defineField({
      name: 'bannerTitle',
      title: 'Banner Title',
      type: 'string',
      group: banner,
      initialValue: 'Join Us for an Unforgettable Experience',
    }),
    defineField({
      name: 'bannerDescription',
      title: 'Banner Description',
      type: 'text',
      rows: 2,
      group: banner,
      initialValue:
        "Be part of a community that's passionate about technology, innovation, and making a difference.",
    }),
    imageWithAlt('bannerImage', 'Banner Image', {group: banner}),

    // ── Founding team ──────────────────────────────────────
    defineField({
      name: 'foundingTeamTitle',
      title: 'Founding Team Title',
      type: 'string',
      group: team,
      initialValue: 'Meet our founding team of Godawari Hacks',
    }),
    defineField({
      name: 'foundingTeamDescription',
      title: 'Founding Team Description',
      type: 'text',
      rows: 2,
      group: team,
      initialValue:
        'The students who brought Godawari Hacks to life through community, creativity, and collaboration.',
    }),
    defineField({
      name: 'foundingTeam',
      title: 'Founding Team',
      type: 'array',
      group: team,
      of: [defineArrayMember({type: 'foundingMember'})],
    }),

    // ── Featured in ────────────────────────────────────────
    defineField({
      name: 'featuredTitle',
      title: 'Featured In Title',
      type: 'string',
      group: press,
      initialValue: 'We are featured in',
    }),
    defineField({
      name: 'featuredIn',
      title: 'Press Mentions',
      type: 'array',
      group: press,
      description: 'News coverage of the hackathon. The section is hidden while this is empty',
      of: [defineArrayMember({type: 'pressMention'})],
    }),

    defineField({
      name: 'seo',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'About'}),
  },
})
