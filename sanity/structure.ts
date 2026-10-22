import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import type {ComponentType} from 'react'
import {
  CogIcon,
  ComposeIcon,
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  ImageIcon,
  ClipboardIcon,
  InfoOutlineIcon,
} from '@sanity/icons'
import {SEASONS} from './lib/seasons'

const SINGLETONS = ['siteSettings', 'homePage', 'rulesPage', 'aboutPage']
const HIDDEN_TYPES = ['blogPost', 'teamRegistration', 'archivePhoto']

const REGISTRATION_STATUS_VIEWS = [
  {id: 'pending', title: 'Pending'},
  {id: 'approved', title: 'Approved'},
  {id: 'rejected', title: 'Rejected'},
  {id: 'cancelled', title: 'Cancelled'},
]

const NEWEST_FIRST = [{field: 'registeredAt', direction: 'desc'} as const]

// One season's registrations, split by status.
function seasonRegistrations(S: StructureBuilder, season: string) {
  return S.list()
    .id(`season-${season}`)
    .title(`Season ${season}`)
    .items([
      S.listItem()
        .id('all')
        .title('All Teams')
        .icon(UsersIcon)
        .child(
          S.documentTypeList('teamRegistration')
            .title(`All Teams · ${season}`)
            .filter('_type == "teamRegistration" && season == $season')
            .params({season})
            .defaultOrdering(NEWEST_FIRST),
        ),

      S.divider(),

      ...REGISTRATION_STATUS_VIEWS.map(({id, title}) =>
        S.listItem()
          .id(id)
          .title(title)
          .child(
            S.documentTypeList('teamRegistration')
              .title(`${title} · ${season}`)
              .filter(
                '_type == "teamRegistration" && season == $season && status == $status',
              )
              .params({season, status: id})
              .defaultOrdering(NEWEST_FIRST),
          ),
      ),
    ])
}

function archiveBySeason(S: StructureBuilder) {
  return S.list()
    .id('archive')
    .title('Archive')
    .items(
      SEASONS.map((season) =>
        S.listItem()
          .id(`archive-${season}`)
          .title(`Season ${season}`)
          .icon(ImageIcon)
          .child(
            S.documentTypeList('archivePhoto')
              .title(`Photos · ${season}`)
              .filter('_type == "archivePhoto" && season == $season')
              .params({season})
              .defaultOrdering([{field: 'order', direction: 'asc'}]),
          ),
      ),
    )
}

function registrationsBySeason(S: StructureBuilder) {
  return S.list()
    .id('registrations')
    .title('Registrations')
    .items([
      ...SEASONS.map((season) =>
        S.listItem()
          .id(`season-${season}`)
          .title(`Season ${season}`)
          .icon(UsersIcon)
          .child(seasonRegistrations(S, season)),
      ),

      S.divider(),

      // Catches anything with a missing or retired season value.
      S.listItem()
        .id('unassigned')
        .title('Unassigned Season')
        .child(
          S.documentTypeList('teamRegistration')
            .title('Unassigned Season')
            .filter(
              '_type == "teamRegistration" && (!defined(season) || !(season in $seasons))',
            )
            .params({seasons: [...SEASONS]})
            .defaultOrdering(NEWEST_FIRST),
        ),
    ])
}

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

      singleton(S, 'aboutPage', 'About', InfoOutlineIcon),
      singleton(S, 'rulesPage', 'Rules', ClipboardIcon),

      S.divider(),

      S.documentTypeListItem('blogPost').title('Blog').icon(DocumentTextIcon),

      S.divider(),

      S.listItem()
        .title('Registrations')
        .icon(UsersIcon)
        .child(registrationsBySeason(S)),

      S.listItem().title('Archive').icon(ImageIcon).child(archiveBySeason(S)),

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
