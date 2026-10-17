import {defineQuery} from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_id == "siteSettings"][0]{
    title,
    description,
    siteUrl,
    logo{
      asset->{_id, url, metadata{lqip, dimensions}},
      alt
    },
    ogImage{
      asset->{_id, url}
    },
    seo
  }`,
)

export const HOME_PAGE_QUERY = defineQuery(
  `*[_id == "homePage"][0]{
    title,
    tagline,
    subtitle,
    heroBackground{
      asset->{_id, url, metadata{lqip, dimensions}},
      alt
    },
    collegeName,
    collegeLogo{
      asset->{_id, url, metadata{lqip}},
      alt
    },
    collegeUrl,
    startDate,
    endDate,
    registrationStatus,
    stats[]{_key, number, label},
    commitment{
      title,
      description,
      partners[]{
        _key,
        name,
        logo{asset->{_id, url}, alt},
        url
      }
    },
    prizePool{
      title,
      description,
      prizes[]{
        _key,
        title,
        amount,
        description,
        icon{asset->{_id, url}},
        gradientFrom,
        gradientTo
      }
    },
    about{
      title,
      description,
      values[]{_key, title, description},
      expectations[]{_key, text}
    },
    "photoGallery": select(
      count(photoGallery.photos) > 0 => photoGallery{
        title,
        description,
        photos[]{
          _key,
          asset->{_id, url, metadata{lqip, dimensions}},
          hotspot,
          crop,
          alt,
          caption
        }
      },
      *[_id == "photoGallery"][0]{
        title,
        description,
        photos[]{
          _key,
          asset->{_id, url, metadata{lqip, dimensions}},
          hotspot,
          crop,
          alt,
          caption
        }
      }
    ),
    "schedule": select(
      count(schedule) > 0 => schedule[]{
        "_id": _key,
        title,
        day,
        time,
        description,
        location,
        image{asset->{_id, url, metadata{lqip, dimensions}}, alt}
      },
      *[_type == "scheduleEvent"] | order(order asc){
        _id,
        title,
        day,
        time,
        description,
        location,
        image{asset->{_id, url, metadata{lqip, dimensions}}, alt}
      }
    ),
    "venue": select(
      defined(venue.name) => venue{
        name,
        address,
        city,
        dates,
        plusCode,
        landmark,
        mapUrl,
        image{asset->{_id, url, metadata{lqip, dimensions}}, alt}
      },
      *[_type == "venue"][0]{
        _id,
        name,
        address,
        city,
        dates,
        plusCode,
        landmark,
        mapUrl,
        image{asset->{_id, url, metadata{lqip, dimensions}}, alt}
      }
    ),
    "team": select(
      count(team) > 0 => team[]{
        "_id": _key,
        name,
        role,
        faculty,
        image{asset->{_id, url, metadata{lqip, dimensions}}, alt},
        linkedin,
        github,
        instagram
      },
      *[_type == "teamMember"] | order(order asc){
        _id,
        name,
        role,
        faculty,
        image{asset->{_id, url, metadata{lqip, dimensions}}, alt},
        linkedin,
        github,
        instagram
      }
    ),
    "sponsors": select(
      count(sponsors) > 0 => sponsors[]{
        "_id": _key,
        name,
        logo{asset->{_id, url, metadata{lqip}}, alt},
        url,
        tier
      },
      *[_type == "sponsor"] | order(order asc){
        _id,
        name,
        logo{asset->{_id, url, metadata{lqip}}, alt},
        url,
        tier
      }
    ),
    seo
  }`,
)

export const TEAM_MEMBERS_QUERY = defineQuery(
  `*[_type == "teamMember"] | order(order asc){
    _id,
    name,
    role,
    faculty,
    image{
      asset->{_id, url, metadata{lqip, dimensions}},
      alt
    },
    linkedin,
    github,
    instagram
  }`,
)

export const SPONSORS_QUERY = defineQuery(
  `*[_type == "sponsor"] | order(order asc){
    _id,
    name,
    logo{
      asset->{_id, url, metadata{lqip}},
      alt
    },
    url,
    tier
  }`,
)

export const SCHEDULE_EVENTS_QUERY = defineQuery(
  `*[_type == "scheduleEvent"] | order(order asc){
    _id,
    title,
    day,
    time,
    description,
    location,
    image{
      asset->{_id, url, metadata{lqip, dimensions}},
      alt
    }
  }`,
)

export const VENUE_QUERY = defineQuery(
  `*[_type == "venue"][0]{
    _id,
    name,
    address,
    city,
    dates,
    plusCode,
    landmark,
    mapUrl,
    image{
      asset->{_id, url, metadata{lqip, dimensions}},
      alt
    }
  }`,
)

export const PHOTO_GALLERY_QUERY = defineQuery(
  `*[_id == "photoGallery"][0]{
    title,
    photos[]{
      _key,
      asset->{_id, url, metadata{lqip, dimensions}},
      alt,
      caption
    }
  }`,
)

export const BLOG_POSTS_QUERY = defineQuery(
  `*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage{
      asset->{_id, url, metadata{lqip, dimensions}},
      alt
    },
    author->{name, image{asset->{_id, url}}},
    publishedAt,
    tags
  }`,
)

export const BLOG_POST_QUERY = defineQuery(
  `*[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage{
      asset->{_id, url, metadata{lqip, dimensions}},
      alt
    },
    body,
    author->{name, image{asset->{_id, url}}, role},
    publishedAt,
    tags,
    seo
  }`,
)

export const BLOG_SLUGS_QUERY = defineQuery(
  `*[_type == "blogPost" && defined(slug.current)]{"slug": slug.current}`,
)

export const SITEMAP_QUERY = defineQuery(
  `*[_type in ["blogPost"] && defined(slug.current)]{
    "href": select(
      _type == "blogPost" => "/blog/" + slug.current
    ),
    _updatedAt
  }`,
)
