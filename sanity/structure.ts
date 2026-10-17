import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import type {ComponentType} from 'react'
import {
  CogIcon,
  ComposeIcon,
  HomeIcon,
  DocumentTextIcon,
} from '@sanity/icons'

const SINGLETONS = ['siteSettings', 'homePage']
const HIDDEN_TYPES = ['blogPost']

// Helper: a singleton document locked to a fixed ID (userland pattern — the
// first-class document.singletons registry needs sanity 6.17.0+).
function singleton(
  S: StructureBuilder,
  typeName: string,
  title: string,
  icon?: ComponentType,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.document().schemaType(typeName).documentId(typeName).title(title),
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home')
        .icon(HomeIcon)
        .child(
          S.list()
            .id('home')
            .title('Home')
            .items([singleton(S, 'homePage', 'Homepage', ComposeIcon)]),
        ),

      S.divider(),

      S.documentTypeListItem('blogPost').title('Blog').icon(DocumentTextIcon),

      S.divider(),

      // ── Global ─────────────────────────────────────────────
      singleton(S, 'siteSettings', 'Site Settings', CogIcon),

      // Any other document types not explicitly placed above.
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !SINGLETONS.includes(listItem.getId() as string) &&
          !HIDDEN_TYPES.includes(listItem.getId() as string),
      ),
    ])
