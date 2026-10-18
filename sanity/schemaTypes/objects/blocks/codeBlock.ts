import {defineField, defineType} from 'sanity'
import {CodeBlockIcon} from '@sanity/icons'

export const CODE_LANGUAGES = [
  {title: 'Plain text', value: 'text'},
  {title: 'Bash', value: 'bash'},
  {title: 'JSON', value: 'json'},
  {title: 'JavaScript', value: 'javascript'},
  {title: 'TypeScript', value: 'typescript'},
  {title: 'JSX / TSX', value: 'tsx'},
  {title: 'HTML', value: 'html'},
  {title: 'CSS', value: 'css'},
  {title: 'Python', value: 'python'},
  {title: 'SQL', value: 'sql'},
] as const

export const codeBlockType = defineType({
  name: 'codeBlock',
  title: 'Code',
  type: 'object',
  icon: CodeBlockIcon,
  fields: [
    defineField({
      name: 'code',
      type: 'text',
      rows: 12,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      type: 'string',
      options: {list: [...CODE_LANGUAGES]},
      initialValue: 'text',
    }),
    defineField({
      name: 'filename',
      description: 'Shown above the snippet, e.g. app/page.tsx',
      type: 'string',
    }),
  ],
  preview: {
    select: {filename: 'filename', language: 'language', code: 'code'},
    prepare: ({filename, language, code}) => ({
      title: filename || (typeof language === 'string' ? language : 'Code'),
      subtitle:
        typeof code === 'string' ? code.split('\n')[0]?.slice(0, 60) : undefined,
    }),
  },
})
