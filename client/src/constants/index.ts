export interface NavLink {
  label: string;
  route: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", route: "/" },
  { label: "Squad", route: "/players" },
  { label: "Fixtures", route: "/activities" },
  { label: "News", route: "/articles" },
  { label: "Gallery", route: "/gallery" },
  { label: "About", route: "/our-club" },
];

export const events = [
  {
    id: 1,
    date: "2025-06-05",
    time: "10:00 AM",
    title: "Open Training Session",
    location: "Training Ground A",
    category: "Training",
  },
  {
    id: 2,
    date: "2025-06-12",
    time: "03:00 PM",
    title: "Fan Meet & Greet",
    location: "Club House",
    category: "Fan Meet-up",
  },
  {
    id: 3,
    date: "2025-06-18",
    time: "09:00 AM",
    title: "Youth Academy Tryouts",
    location: "Youth Pitch 1",
    category: "Youth Academy",
  },
  {
    id: 4,
    date: "2025-06-25",
    time: "02:00 PM",
    title: "Charity Match vs. Local Legends",
    location: "Main Stadium",
    category: "Community Event",
  },
  {
    id: 5,
    date: "2025-07-02",
    time: "11:00 AM",
    title: "Autograph Session",
    location: "Club Store",
    category: "Fan Meet-up",
  },
];
