import {defineArrayMember, defineField, defineType} from 'sanity'
import {InlineElementIcon} from '@sanity/icons'

export const buttonGroupType = defineType({
  name: 'buttonGroup',
  title: 'Buttons',
  type: 'object',
  icon: InlineElementIcon,
  fields: [
    defineField({
      name: 'buttons',
      type: 'array',
      of: [defineArrayMember({type: 'ctaButton'})],
      validation: (rule) => rule.required().min(1).max(3),
    }),
    defineField({
      name: 'align',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Centre', value: 'center'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'left',
    }),
  ],
  preview: {
    select: {first: 'buttons.0.label', count: 'buttons.length'},
    prepare: ({first, count}) => ({
      title: first || 'Buttons',
      subtitle:
        typeof count === 'number' && count > 1 ? `${count} buttons` : 'Button',
    }),
  },
})
