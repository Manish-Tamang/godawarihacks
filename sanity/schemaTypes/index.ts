import {type SchemaTypeDefinition} from 'sanity'

// Objects — reusable, embedded inside documents.
import {seoType} from './objects/seo'
import {simpleRichTextType, richTextType} from './objects/richText'
import {registrationMemberType} from './objects/registrationMember'

// Objects — homepage sections.
import {statItemType} from './objects/home/statItem'
import {partnerType} from './objects/home/partner'
import {prizeCardType} from './objects/home/prizeCard'
import {aboutValueType} from './objects/home/aboutValue'
import {expectationItemType} from './objects/home/expectationItem'
import {commitmentSectionType} from './objects/home/commitmentSection'
import {prizePoolSectionType} from './objects/home/prizePoolSection'
import {aboutSectionType} from './objects/home/aboutSection'

// Singletons — exactly one document each.
import {siteSettingsType} from './singletons/siteSettings'
import {homePageType} from './singletons/homePage'

// Documents — many instances, editable in the Studio.
import {teamMemberType} from './documents/teamMember'
import {sponsorType} from './documents/sponsor'
import {scheduleEventType} from './documents/scheduleEvent'
import {venueType} from './documents/venue'
import {blogPostType} from './documents/blogPost'
import {photoGalleryType} from './documents/photoGallery'
import {teamRegistrationType} from './documents/teamRegistration'
import {archivePhotoType} from './documents/archivePhoto'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    // Objects
    seoType,
    simpleRichTextType,
    richTextType,
    registrationMemberType,

    // Homepage section objects
    statItemType,
    partnerType,
    prizeCardType,
    aboutValueType,
    expectationItemType,
    commitmentSectionType,
    prizePoolSectionType,
    aboutSectionType,

    // Singletons
    siteSettingsType,
    homePageType,

    // Documents
    teamMemberType,
    sponsorType,
    scheduleEventType,
    venueType,
    blogPostType,
    photoGalleryType,
    teamRegistrationType,
    archivePhotoType,
  ],
}
