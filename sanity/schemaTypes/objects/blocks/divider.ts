import {defineField, defineType} from 'sanity'
import {RemoveIcon} from '@sanity/icons'

export const dividerType = defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  icon: RemoveIcon,
  fields: [
    defineField({
      name: 'variant',
      type: 'string',
      options: {
        list: [
          {title: 'Line', value: 'line'},
          {title: 'Dots', value: 'dots'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'line',
    }),
  ],
  preview: {
    select: {variant: 'variant'},
    prepare: ({variant}) => ({
      title: 'Divider',
      subtitle: typeof variant === 'string' ? variant : 'line',
    }),
  },
})
