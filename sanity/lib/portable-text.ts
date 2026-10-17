export type RichTextValue = Array<{
  _type: string
  _key?: string
  [key: string]: unknown
}>

export function toPlainText(
  blocks: RichTextValue | null | undefined,
): string {
  if (!blocks) return ''
  return blocks
    .filter((b) => b._type === 'block')
    .map((b) => {
      const children = b.children as Array<{text?: string}> | undefined
      return children?.map((c) => c.text ?? '').join('') ?? ''
    })
    .join('\n')
}
