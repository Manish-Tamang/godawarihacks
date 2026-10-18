import {defineField, defineType} from 'sanity'
import {ArrowRightIcon} from '@sanity/icons'

export const BUTTON_VARIANTS = [
  {title: 'Primary (filled)', value: 'primary'},
  {title: 'Secondary (tinted)', value: 'secondary'},
  {title: 'Outline', value: 'outline'},
  {title: 'Link (text only)', value: 'link'},
] as const

/**
 * A single button. Used inside `buttonGroup`, never placed in rich text on its
 * own, so that one or several buttons always share the same alignment.
 */
export const ctaButtonType = defineType({
  name: 'ctaButton',
  title: 'Button',
  type: 'object',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      description:
        'A full URL (https://…), a path on this site (/register) or mailto:/tel:',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string') return true
          if (/^(https?:\/\/|mailto:|tel:|\/|#)/.test(value)) return true
          return 'Must start with https://, mailto:, tel:, / or #'
        }),
    }),
    defineField({
      name: 'variant',
      type: 'string',
      options: {list: [...BUTTON_VARIANTS], layout: 'radio'},
      initialValue: 'primary',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
