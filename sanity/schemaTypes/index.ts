import {type SchemaTypeDefinition} from 'sanity'
import {seoType} from './seoType'
import {simpleRichTextType, richTextType} from './richTextType'
import {siteSettingsType} from './siteSettingsType'
import {homePageType} from './homePageType'
import {statItemType} from './home/statItem'
import {partnerType} from './home/partner'
import {prizeCardType} from './home/prizeCard'
import {aboutValueType} from './home/aboutValue'
import {expectationItemType} from './home/expectationItem'
import {commitmentSectionType} from './home/commitmentSection'
import {prizePoolSectionType} from './home/prizePoolSection'
import {aboutSectionType} from './home/aboutSection'
import {teamMemberType} from './teamMemberType'
import {sponsorType} from './sponsorType'
import {scheduleEventType} from './scheduleEventType'
import {venueType} from './venueType'
import {blogPostType} from './blogPostType'
import {photoGalleryType} from './photoGalleryType'
import {registrationMemberType} from './registration/2026/registrationMemberType'
import {teamRegistrationType} from './registration/2026/teamRegistrationType'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    seoType,
    simpleRichTextType,
    richTextType,
    statItemType,
    partnerType,
    prizeCardType,
    aboutValueType,
    expectationItemType,
    commitmentSectionType,
    prizePoolSectionType,
    aboutSectionType,
    siteSettingsType,
    homePageType,
    teamMemberType,
    sponsorType,
    scheduleEventType,
    venueType,
    blogPostType,
    photoGalleryType,
    registrationMemberType,
    teamRegistrationType,
  ],
}
