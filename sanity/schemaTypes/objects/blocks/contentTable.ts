import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'

/**
 * One row of a `contentTable`. Cells are plain strings — the renderer lays
 * them out in document order, so every row should hold the same number.
 */
export const tableRowType = defineType({
  name: 'tableRow',
  title: 'Row',
  type: 'object',
  fields: [
    defineField({
      name: 'cells',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {cells: 'cells'},
    prepare: ({cells}) => ({
      title: Array.isArray(cells) ? cells.join(' · ') : 'Empty row',
    }),
  },
})

export const contentTableType = defineType({
  name: 'contentTable',
  title: 'Table',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'rows',
      type: 'array',
      of: [defineArrayMember({type: 'tableRow'})],
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .custom((rows) => {
            if (!Array.isArray(rows) || rows.length === 0) return true
            const widths = new Set(
              rows.map((row) =>
                Array.isArray((row as {cells?: unknown[]}).cells)
                  ? (row as {cells: unknown[]}).cells.length
                  : 0,
              ),
            )
            return widths.size > 1
              ? 'Every row needs the same number of cells'
              : true
          }),
    }),
    defineField({
      name: 'hasHeaderRow',
      title: 'First row is a header',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {caption: 'caption', rows: 'rows'},
    prepare: ({caption, rows}) => ({
      title: caption || 'Table',
      subtitle: Array.isArray(rows) ? `${rows.length} rows` : undefined,
    }),
  },
})
