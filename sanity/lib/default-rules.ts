import type {RichTextValue} from './portable-text'

/**
 * The standard Godawari Hacks rulebook as Portable Text. Used as the initial
 * value of `rulesPage.body` in the Studio, and as the /rules fallback until a
 * rules page is published.
 */

let keyCounter = 0
const key = () => `rule${(keyCounter++).toString(36)}`

function block(text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  }
}

const h2 = (text: string) => block(text, 'h2')

function item(text: string, listItem: 'bullet' | 'number' = 'bullet') {
  return {...block(text), listItem, level: 1}
}

export const DEFAULT_RULES: RichTextValue = [
  block(
    'These rules keep Godawari Hacks fair, safe and fun for everyone. By registering, every participant agrees to follow them. The organizing team may update these rules before the event; the latest version on this page applies.',
  ),

  h2('Eligibility'),
  item('Participants must be currently enrolled high school (+2 or equivalent) students.'),
  item('Each participant must carry a valid student ID and present it at check-in.'),
  item('A participant may be a member of only one team.'),

  h2('Teams'),
  item('Teams can have 1 to 4 members.'),
  item('Team members cannot be changed after registration is approved, except with permission from the organizers.'),
  item('Every team must have at least one member present at the venue throughout the hackathon.'),

  h2('Building Your Project'),
  item('All project work must be started after the hackathon officially begins. Planning and brainstorming beforehand is allowed.'),
  item('Open-source libraries, frameworks, public APIs and AI tools are allowed, but must be credited in your submission.'),
  item('Reusing your own or someone else’s previously built project is not allowed.'),
  item('Projects must follow the theme or problem statements announced at the opening ceremony.'),
  item('Projects must not contain harmful, offensive or illegal content.'),

  h2('Submission'),
  item('Submit your project before the deadline announced by the organizers. Late submissions will not be judged.'),
  item('Each submission must include a link to the source code repository and a short description of the project.'),
  item('Teams must present a working demo to the judges during the judging round.'),

  h2('Judging'),
  block('Projects are judged on the following criteria:'),
  item('Innovation and creativity', 'number'),
  item('Technical complexity and execution', 'number'),
  item('Design and user experience', 'number'),
  item('Impact and relevance to the theme', 'number'),
  item('Presentation and demo', 'number'),
  block('The judges’ decisions are final.'),

  h2('Code of Conduct'),
  item('Treat every participant, mentor, judge, volunteer and organizer with respect.'),
  item('Harassment, discrimination or bullying of any kind will not be tolerated.'),
  item('Take care of the venue and its equipment. Any damage is the responsibility of the team that caused it.'),
  item('Follow all instructions given by the organizers and venue staff.'),

  h2('Disqualification'),
  block(
    'The organizers may disqualify any participant or team that breaks these rules, plagiarizes work, or behaves in a way that harms others or the event. Disqualified teams are not eligible for prizes.',
  ),

  h2('Questions'),
  block(
    'If anything here is unclear, reach out to the organizing team through the contact page before or during the event.',
  ),
]
