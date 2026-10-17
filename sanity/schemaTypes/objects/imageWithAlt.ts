import {defineField} from 'sanity'

export function imageWithAlt(
  name: string,
  title?: string,
  placement?: {group?: string | string[]; fieldset?: string},
) {
  return defineField({
    name,
    title,
    type: 'image',
    group: placement?.group,
    fieldset: placement?.fieldset,
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
      }),
    ],
  })
}
