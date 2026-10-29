import bossImage from '../../assets/Collection010.webp';
import bigBlockImage from '../../assets/Collection040.webp';
import recordsImage from '../../assets/Collection030.webp';
import roadImage from '../../assets/Collection090.webp';

export type JournalSection = { heading: string; paragraphs: string[] };
export type JournalStory = {
  slug: string;
  number: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  readTime: string;
  body: JournalSection[];
};

export const journalContentNote = 'Sample editorial content. These original essays illustrate the journal design; they are not verified vehicle histories, technical reports, or owner testimonials. Inventory images are used for illustration.';

function story(input: Omit<JournalStory, 'readTime'>): JournalStory {
  const words = [input.title, input.excerpt, ...input.body.flatMap(section => [section.heading, ...section.paragraphs])].join(' ').trim().split(/\s+/).length;
  return { ...input, readTime: `${Math.max(1, Math.ceil(words / 200))} MIN READ` };
}

export const journalStories: JournalStory[] = [
  story({
    slug: 'the-boss-beyond-the-badge',
    number: '01',
    category: 'MUSTANG / ORIGINS',
    title: 'The Boss, beyond the badge',
    excerpt: 'A name can start the conversation. The shape, the details, and the individual machine make it worth continuing.',
    image: bossImage,
    imageAlt: 'White Mustang Boss 429 from the garage inventory',
    body: [
      { heading: 'Start with the silhouette', paragraphs: [
        'Before the specification sheet, there is the first look. A long hood, a purposeful stance, a line that makes you stop walking. In this sample editorial, the Boss is a starting point for thinking about the pull of a car rather than a claim about a particular vehicle’s history.',
        'Spend a moment with the image before reading the badge. Notice which proportions hold your attention and which details you want to inspect more closely. That instinct is the beginning of a conversation, not the end of an assessment.',
      ] },
      { heading: 'The badge is an invitation', paragraphs: [
        'A familiar model name carries expectations. It can also tempt us to fill in gaps with a story we already know. An individual car deserves more careful attention: its identification, its stated configuration, and the records available for review.',
        'Treat the label as a reason to ask better questions. Which details are documented? Which are descriptions from the seller? What remains to be established? The answers matter more than the confidence of the headline.',
      ] },
      { heading: 'Leave room for the machine', paragraphs: [
        'There is room for both enthusiasm and patience. Enjoy the design, read the inventory entry, and ask for the evidence behind the particulars that matter to you. A good story becomes more interesting when its boundaries are clear.',
        'The photograph here comes from the garage inventory. It is an illustration for this essay, not evidence of originality, condition, production rarity, or competition history.',
      ] },
    ],
  }),
  story({
    slug: 'big-block-bigger-story',
    number: '02',
    category: 'UNDER THE HOOD',
    title: 'Big block, bigger story',
    excerpt: 'Beyond the shorthand: reading an engine description without letting the headline do all the talking.',
    image: bigBlockImage,
    imageAlt: 'Plymouth Hemi Cuda from the garage inventory',
    body: [
      { heading: 'A phrase is not a specification', paragraphs: [
        'Some phrases are almost a soundtrack. Big block. Manual gearbox. Open road. They suggest a feeling before they explain a machine. This sample feature looks at the language of an inventory listing without assigning unverified performance or mechanical qualities to a car.',
        'A headline can be evocative and still leave important questions unanswered. The useful next step is to move from the broad phrase to the exact configuration stated for the individual vehicle.',
      ] },
      { heading: 'Read the complete line', paragraphs: [
        'Look at the engine description alongside the transmission, the model year, and any records offered. Keep the listing’s wording separate from your assumptions. If a figure or component matters to your decision, ask how it was identified or measured.',
        'An attractive photograph does not settle those questions. Neither does a familiar badge. Written details, supporting records, and an appropriate inspection are separate parts of understanding what is actually being offered.',
      ] },
      { heading: 'Keep the feeling, ask the question', paragraphs: [
        'The appeal of a machine need not disappear under scrutiny. Curiosity can deepen it. Ask the garage to explain the configuration in plain language and identify any information that is still unavailable.',
        'This is an illustrative essay, not an engine guide. No output figures, component originality, or driving characteristics are established by this article or its accompanying inventory image.',
      ] },
    ],
  }),
  story({
    slug: 'reading-a-cars-provenance',
    number: '03',
    category: 'COLLECTOR NOTES',
    title: 'How to read a car’s provenance',
    excerpt: 'A collector’s conversation begins with the records, the gaps, and the questions worth asking.',
    image: recordsImage,
    imageAlt: 'Modern Mustang Shelby GT500 from the garage inventory',
    body: [
      { heading: 'Separate the story from the record', paragraphs: [
        'A compelling description can make a car feel familiar before you have seen it. Provenance asks for a different kind of attention: what is known about this individual machine, what supports that account, and what has not yet been established.',
        'This sample editorial is a conversation framework, not an authentication service. It does not verify the background of any vehicle shown in the garage.',
      ] },
      { heading: 'Build a timeline, leave the gaps visible', paragraphs: [
        'Ask which ownership, service, or restoration records can be reviewed. Read dates and descriptions in context. Where a period is undocumented, keep that gap visible rather than filling it with an appealing explanation.',
        'Photographs and paperwork can raise useful questions as well as answer them. Ask how an item relates to the car being offered, and distinguish a general model reference from a vehicle-specific record.',
      ] },
      { heading: 'Make uncertainty part of the conversation', paragraphs: [
        'Clear questions help everyone. What is supplied with the vehicle? Which claims are supported by records? What would require specialist assessment? A straightforward account of the unknowns is more useful than a polished account that hides them.',
        'The accompanying image is drawn from inventory for illustration. It does not imply a documented ownership chain, verified mileage, originality, or an inspection result.',
      ] },
    ],
  }),
  story({
    slug: 'the-case-for-taking-the-long-way',
    number: '04',
    category: 'ROAD CULTURE',
    title: 'The case for taking the long way',
    excerpt: 'An imagined Sunday drive, a quiet stretch of road, and a reminder to make room for the journey.',
    image: roadImage,
    imageAlt: 'Classic Mustang Shelby GT500 from the garage inventory',
    body: [
      { heading: 'An unhurried beginning', paragraphs: [
        'Imagine a morning with no destination to announce. The route is ordinary, the coffee is still warm, and the best part of the plan is the space left in it. This is a fictional scene about the enjoyment of a journey, not an account of a customer’s drive.',
        'The car in the photograph supplies the visual mood. The road, the weather, and the driver in this essay are imagined; no ownership experience or mechanical behavior is being attributed to that vehicle.',
      ] },
      { heading: 'Notice the overlooked', paragraphs: [
        'A slower itinerary leaves room for small discoveries: a familiar street from another direction, a place to stop, a conversation that lasts longer than expected. The appeal is not a stopwatch or an impressive distance.',
        'There is pleasure in paying attention. The shape of a dashboard, the way light crosses a parked car, the pause before heading home. A motoring story can live in those details without becoming a performance claim.',
      ] },
      { heading: 'Bring a story back', paragraphs: [
        'The imagined drive ends where it began, but with something to remember. That is the invitation behind this journal: make space for the people and places around the machines, not only the machines themselves.',
        'When you are ready to explore an actual car, return to its individual inventory file. Read the supplied details and ask the garage about condition, records, and suitability rather than treating an editorial scene as a vehicle assessment.',
      ] },
    ],
  }),
];
