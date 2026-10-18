export interface IntrusiveThought {
  id: number;
  thought: string;
  category: '3am logic' | 'drama' | 'food nonsense' | 'overthinking' | 'teddy secrets';
  time: string;
  doodle: string;
  relatableBase: number;
}

export const INTRUSIVE_THOUGHTS: IntrusiveThought[] = [
  {
    id: 1,
    thought: "what if the moon is just the sun's night-shift replacement who didn't get trained properly and that's why it has different phases",
    category: "3am logic",
    time: "3:07 am",
    doodle: "🌙",
    relatableBase: 1420
  },
  {
    id: 2,
    thought: "i could solve all my problems right now, but unfortunately i have made the executive decision to lie down and stare at the ceiling.",
    category: "drama",
    time: "3:11 am",
    doodle: "🛌",
    relatableBase: 2890
  },
  {
    id: 3,
    thought: "why is it called a 'building' if it's already built. explain yourself, human architects.",
    category: "3am logic",
    time: "3:14 am",
    doodle: "🧱",
    relatableBase: 980
  },
  {
    id: 4,
    thought: "i don't hold grudges. i scrapbook them with glitter glue and archival-quality washi tape.",
    category: "drama",
    time: "3:19 am",
    doodle: "✂️",
    relatableBase: 1640
  },
  {
    id: 5,
    thought: "my last two brain cells are currently fighting over who gets to be completely unemployed for the rest of the week.",
    category: "overthinking",
    time: "3:22 am",
    doodle: "🧠",
    relatableBase: 3120
  },
  {
    id: 6,
    thought: "what if pigeons are just government employees on their 15-minute unpaid lunch break.",
    category: "3am logic",
    time: "3:25 am",
    doodle: "🐦",
    relatableBase: 840
  },
  {
    id: 7,
    thought: "i said i'd be productive today. ted from yesterday was clearly spreading malicious misinformation.",
    category: "drama",
    time: "3:28 am",
    doodle: "📝",
    relatableBase: 2450
  },
  {
    id: 8,
    thought: "imagine being a fish and discovering that humans invented soup. the sheer psychological horror.",
    category: "3am logic",
    time: "3:31 am",
    doodle: "🐟",
    relatableBase: 1780
  },
  {
    id: 9,
    thought: "i need a vacation from the consequences of my own completely avoidable decisions.",
    category: "drama",
    time: "3:34 am",
    doodle: "🏖️",
    relatableBase: 3560
  },
  {
    id: 10,
    thought: "i'm not overthinking. i'm simply producing a 4K director's cut with audio commentary for every conversation i had between 2018 and this morning.",
    category: "overthinking",
    time: "3:38 am",
    doodle: "🎬",
    relatableBase: 4120
  },
  {
    id: 11,
    thought: "what if my human is also pretending to be asleep so they don't have to deal with my emotional baggage.",
    category: "teddy secrets",
    time: "3:41 am",
    doodle: "🧸",
    relatableBase: 1390
  },
  {
    id: 12,
    thought: "i have the emotional stability of a butter biscuit dipped in hot milk for 4.2 seconds.",
    category: "food nonsense",
    time: "3:45 am",
    doodle: "🍪",
    relatableBase: 2980
  },
  {
    id: 13,
    thought: "i just spent 20 minutes rehearsing an argument that will never happen with a cloud that looked at me funny.",
    category: "overthinking",
    time: "3:48 am",
    doodle: "☁️",
    relatableBase: 2210
  },
  {
    id: 14,
    thought: "calories consumed while standing directly in front of the open fridge at 2 am do not count. it's in the geneva convention.",
    category: "food nonsense",
    time: "3:52 am",
    doodle: "🧀",
    relatableBase: 3840
  },
  {
    id: 15,
    thought: "if i was meant to be early to things, my legs would have been manufactured at least two inches longer.",
    category: "teddy secrets",
    time: "3:56 am",
    doodle: "⏱️",
    relatableBase: 1730
  },
  {
    id: 16,
    thought: "is it really 'procrastination' if i do 40 completely irrelevant chores to avoid doing the one single thing on my list?",
    category: "overthinking",
    time: "4:01 am",
    doodle: "🧹",
    relatableBase: 3290
  },
  {
    id: 17,
    thought: "what if mirrors don't show what we look like, but what the mirror thinks we deserve to look like today.",
    category: "3am logic",
    time: "4:04 am",
    doodle: "🪞",
    relatableBase: 1520
  },
  {
    id: 18,
    thought: "my therapist: 'and what do we do when we feel overwhelmed?' me: 'add 14 items to an online cart and then abandon the tab forever.'",
    category: "drama",
    time: "4:08 am",
    doodle: "🛒",
    relatableBase: 3740
  },
  {
    id: 19,
    thought: "if a tomato is a fruit, then ketchup is technically a fruit smoothie. do not contact me with counter-arguments.",
    category: "food nonsense",
    time: "4:11 am",
    doodle: "🍅",
    relatableBase: 1890
  },
  {
    id: 20,
    thought: "i am 80% fluff, 15% existential dread, and 5% strawberry cookie crumbs.",
    category: "teddy secrets",
    time: "4:15 am",
    doodle: "🍓",
    relatableBase: 2630
  },
  {
    id: 21,
    thought: "why do beds feel 10,000 times softer and more welcoming at 7:15 am on a monday than at 11 pm on a sunday?",
    category: "3am logic",
    time: "4:18 am",
    doodle: "⏰",
    relatableBase: 4420
  },
  {
    id: 22,
    thought: "someone complimented my bow three months ago and i am still emotionally surviving on that single molecule of validation.",
    category: "teddy secrets",
    time: "4:21 am",
    doodle: "🎀",
    relatableBase: 2180
  },
  {
    id: 23,
    thought: "i would go outside and touch grass, but what if the grass has unrealistic expectations of me.",
    category: "drama",
    time: "4:24 am",
    doodle: "🌱",
    relatableBase: 2790
  },
  {
    id: 24,
    thought: "every time someone says 'we need to talk', my soul immediately drafts seven different confessions for crimes i didn't commit.",
    category: "overthinking",
    time: "4:27 am",
    doodle: "🚨",
    relatableBase: 3990
  },
  {
    id: 25,
    thought: "what if sleep is just our free trial of being a rock, and waking up is the unwanted recurring subscription.",
    category: "3am logic",
    time: "4:30 am",
    doodle: "🪨",
    relatableBase: 1920
  },
  {
    id: 26,
    thought: "i accidentally made eye contact with a pigeon and now i feel legally obligated to invite it to my birthday party.",
    category: "overthinking",
    time: "4:33 am",
    doodle: "👀",
    relatableBase: 1470
  },
  {
    id: 27,
    thought: "my comfort zone isn't just a zone anymore, it's a gated community with armed teddy guards and electric fences.",
    category: "drama",
    time: "4:36 am",
    doodle: "🏰",
    relatableBase: 3150
  },
  {
    id: 28,
    thought: "technically speaking, if i never start the task, i can never technically fail at the task. follow me for more career advice.",
    category: "drama",
    time: "4:39 am",
    doodle: "📉",
    relatableBase: 3680
  },
  {
    id: 29,
    thought: "i told myself 'just one cookie'. the cookie was the size of my entire torso, but technically the grammar was spotless.",
    category: "food nonsense",
    time: "4:42 am",
    doodle: "🍪",
    relatableBase: 2840
  },
  {
    id: 30,
    thought: "what if dust bunnies under the bed are actually tiny rogue teddy bears plotting a coup d'état.",
    category: "teddy secrets",
    time: "4:45 am",
    doodle: "🐰",
    relatableBase: 1260
  },
  {
    id: 31,
    thought: "sending an email that says 'per my previous email' is legal violence and i respect it.",
    category: "overthinking",
    time: "4:48 am",
    doodle: "✉️",
    relatableBase: 3310
  },
  {
    id: 32,
    thought: "i am currently running on 3 hours of sleep, 2 drops of optimism, and pure unadulterated spite.",
    category: "drama",
    time: "4:51 am",
    doodle: "☕",
    relatableBase: 4210
  },
  {
    id: 33,
    thought: "why do clothes have sizes? why can't clothes just adapt to my changing lifestyle choices like a true friend?",
    category: "food nonsense",
    time: "4:54 am",
    doodle: "👕",
    relatableBase: 2570
  },
  {
    id: 34,
    thought: "i tried listening to my inner child today. my inner child demanded three donuts and a 4-hour nap. so far, stellar advice.",
    category: "food nonsense",
    time: "4:57 am",
    doodle: "🍩",
    relatableBase: 3410
  },
  {
    id: 35,
    thought: "i'm not ignoring you, i'm just buffering. please do not refresh the teddy.",
    category: "teddy secrets",
    time: "5:00 am",
    doodle: "⏳",
    relatableBase: 2890
  },
  {
    id: 36,
    thought: "what if dogs bark at the mail carrier because the mail carrier is bringing bills and dogs are trying to protect our credit score?",
    category: "3am logic",
    time: "5:03 am",
    doodle: "🐶",
    relatableBase: 2150
  },
  {
    id: 37,
    thought: "i have decided to be mysterious today. (i forgot what i walked into this room for).",
    category: "overthinking",
    time: "5:06 am",
    doodle: "🕵️",
    relatableBase: 3620
  },
  {
    id: 38,
    thought: "my bed is a time machine: i lie down for 5 minutes and suddenly 4 hours have passed and i have watched 19 videos on how spoons are forged.",
    category: "3am logic",
    time: "5:09 am",
    doodle: "🥄",
    relatableBase: 4550
  },
  {
    id: 39,
    thought: "i don't run. if you ever see me running, you should also run, because something terrifying is definitely chasing both of us.",
    category: "drama",
    time: "5:12 am",
    doodle: "🏃",
    relatableBase: 3100
  },
  {
    id: 40,
    thought: "what if trees are actually the dominant species and they've just been keeping humans around because they enjoy the carbon dioxide?",
    category: "3am logic",
    time: "5:15 am",
    doodle: "🌲",
    relatableBase: 1670
  },
  {
    id: 41,
    thought: "i am one minor inconvenience away from moving to the forest and legally changing my name to Moss.",
    category: "drama",
    time: "5:18 am",
    doodle: "🌿",
    relatableBase: 3820
  },
  {
    id: 42,
    thought: "the urge to apologize to an inanimate object after bumping into it proves i was raised with too much manners and too little depth perception.",
    category: "overthinking",
    time: "5:21 am",
    doodle: "🚪",
    relatableBase: 2940
  },
  {
    id: 43,
    thought: "i'm not late, everyone else just arrived with suspicious, unwholesome punctuality.",
    category: "drama",
    time: "5:24 am",
    doodle: "⌚",
    relatableBase: 2280
  },
  {
    id: 44,
    thought: "what if dinosaurs didn't go extinct, what if they just looked at the trajectory of society and respectfully opted out?",
    category: "3am logic",
    time: "5:27 am",
    doodle: "🦖",
    relatableBase: 2710
  },
  {
    id: 45,
    thought: "the hardest part of my day is deciding whether to take a morning nap or save my energy for an afternoon nap.",
    category: "teddy secrets",
    time: "5:30 am",
    doodle: "💤",
    relatableBase: 3340
  },
  {
    id: 46,
    thought: "i whispered 'i love you' to my snack before eating it. gratitude is important in culinary circles.",
    category: "food nonsense",
    time: "5:33 am",
    doodle: "🥐",
    relatableBase: 1980
  },
  {
    id: 47,
    thought: "my immune system fighting off a minor cold is like a SWAT team busting into a preschool. completely overreacting.",
    category: "drama",
    time: "5:36 am",
    doodle: "🤧",
    relatableBase: 3190
  },
  {
    id: 48,
    thought: "i have a very specific set of skills. none of them are useful in modern society, but if you need someone to test cloud softness, call me.",
    category: "teddy secrets",
    time: "5:39 am",
    doodle: "☁️",
    relatableBase: 2870
  },
  {
    id: 49,
    thought: "why do bad things happen to good people? for example, why did my blanket slide two inches to the left, leaving my paw exposed to the draft?",
    category: "drama",
    time: "5:42 am",
    doodle: "🥶",
    relatableBase: 4110
  },
  {
    id: 50,
    thought: "i put my phone on 'do not disturb' as if world leaders are constantly begging for my opinion on geopolitical crises.",
    category: "overthinking",
    time: "5:45 am",
    doodle: "🔕",
    relatableBase: 3650
  },
  {
    id: 51,
    thought: "what if cats purr because they have a tiny diesel engine inside them that runs exclusively on tuna?",
    category: "3am logic",
    time: "5:48 am",
    doodle: "🐱",
    relatableBase: 1830
  },
  {
    id: 52,
    thought: "i am an adult. i can eat ice cream for breakfast if i want. i will also cry in the shower about taxes later, but that's a separate calendar event.",
    category: "food nonsense",
    time: "5:51 am",
    doodle: "🍨",
    relatableBase: 3920
  },
  {
    id: 53,
    thought: "if you're ever feeling useless, just remember that someone is paid to install turn signals on BMWs.",
    category: "3am logic",
    time: "5:54 am",
    doodle: "🚗",
    relatableBase: 2490
  },
  {
    id: 54,
    thought: "i didn't choose the sleepy life. the sleepy life tucked me into bed, gave me a forehead kiss, and handed me a warm cookie.",
    category: "teddy secrets",
    time: "5:57 am",
    doodle: "😴",
    relatableBase: 3810
  },
  {
    id: 55,
    thought: "the voice inside my head isn't an inner critic. it's an exhausted stage manager who wants everyone to go home.",
    category: "overthinking",
    time: "6:00 am",
    doodle: "🎭",
    relatableBase: 4490
  }
];
