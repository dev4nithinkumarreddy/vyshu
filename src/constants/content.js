// Content and configuration for Vyshu's Birthday Celebration

export const FRIEND_NAME = "Vyshu";
export const PET_NAME = "Gundu";
export const SIGN_OFF = "From your annoying friend";

export const PHOTOS = [
  {
    id: 1,
    url: `${import.meta.env.BASE_URL}vyshu/vyshu-1.jpg`,
    title: "Walk Among the Trees",
    subtitle: "Spring vibes & fallen blossoms",
    tag: "Aesthetic",
    aspect: "9/16",
    rotation: -2,
  },
  {
    id: 2,
    url: `${import.meta.env.BASE_URL}vyshu/vyshu-2.jpg`,
    title: "Golden Hour Grace",
    subtitle: "Sunlight filtering through the palms",
    tag: "Serene",
    aspect: "9/16",
    rotation: 2,
  },
  {
    id: 3,
    url: `${import.meta.env.BASE_URL}vyshu/vyshu-3.jpg`,
    title: "Blossom & Light",
    subtitle: "Radiant smile by the flower beds",
    tag: "Radiant",
    aspect: "3/4",
    rotation: -1.5,
  },
  {
    id: 4,
    url: `${import.meta.env.BASE_URL}vyshu/vyshu-4.jpg`,
    title: "The Classic Pose",
    subtitle: "Unfiltered cheerful energy",
    tag: "Gundu Signature",
    aspect: "9/16",
    rotation: 2.5,
  },
  {
    id: 5,
    url: `${import.meta.env.BASE_URL}vyshu/vyshu-5.png`,
    title: "Misty Mountain Air",
    subtitle: "Chilly foggy morning & warm smiles",
    tag: "Wanderlust",
    aspect: "3/4",
    rotation: -2,
  },
];

export const FRIENDSHIP_SNAPSHOTS = [
  {
    id: 6,
    url: `${import.meta.env.BASE_URL}vyshu/vyshu-6.png`,
    title: "The Core Memory",
    subtitle: "Thumbs up, big smiles, and real friendship vibes 🤙",
    badge: "VIP Friendship Snapshot",
    aspect: "16/9",
    tag: "Squad Selfie",
  },
  {
    id: 7,
    url: `${import.meta.env.BASE_URL}vyshu/vyshu-7.jpg`,
    title: "Sunny Days & Bright Smiles",
    subtitle: "Casual walks, green outdoors, and effortless laughs 🌿",
    badge: "VIP Friendship Snapshot",
    aspect: "16/10",
    tag: "Park Days",
  },
  {
    id: 8,
    url: `${import.meta.env.BASE_URL}vyshu/vyshu-8.png`,
    title: "Adiyogi Expedition",
    subtitle: "Trip to Adiyogi with the squad — unforgettable memories ⛰️",
    badge: "VIP Friendship Snapshot",
    aspect: "9/16",
    tag: "Adiyogi Trip",
  },
];

export const GROUP_PHOTO = FRIENDSHIP_SNAPSHOTS[0];

export const FRIENDSHIP_HIGHLIGHTS = [
  {
    title: "The 'Gundu' Exclusivity Clause 📜",
    description: "Calling her 'Gundu' is strictly trademarked and reserved for authorized personnel (me). Anyone else attempting this does so at their own risk!",
    stat: "100%",
    statLabel: "Exclusive License",
  },
  {
    title: "Patience Level of a Saint 😇",
    description: "Successfully tolerating my constant random thoughts, silly banter, and annoying jokes for another entire year without filing a complaint.",
    stat: "Level 999",
    statLabel: "Endurance Rating",
  },
];

export const BIRTHDAY_WISH = {
  title: "Happy Birthday, Vyshu! 🎉",
  greeting: "To the one and only Gundu,",
  paragraphs: [
    "Wishing you an extraordinary birthday filled with all the laughter, joy, peace, and sweet memories you truly deserve!",
    "Thank you for being such a wonderful, loyal, and supportive friend. Having someone who laughs at my worst jokes and stays grounded through everything is rare and special.",
    "May this upcoming year open doors to exciting adventures, boundless success in everything you strive for, and countless reasons to smile.",
    "Stay the bright, kind, and wonderfully cheerful person you are — and don't forget, no matter how old you get, you will always be Gundu to me! 😉"
  ],
  closing: "Have an unforgettable celebration!",
  signOff: SIGN_OFF,
};
