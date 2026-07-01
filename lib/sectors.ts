export type Sector = {
  key: "security" | "hospitals" | "restaurants" | "cleaning" | "petroleum" | "construction" | "factories";
  count: string;
};

// These map to the sector groupings supplied in the client's own portfolio sheet.
export const sectors: Sector[] = [
  { key: "security", count: "40+" },
  { key: "hospitals", count: "8+" },
  { key: "restaurants", count: "15+" },
  { key: "cleaning", count: "14+" },
  { key: "petroleum", count: "6+" },
  { key: "construction", count: "20+" },
  { key: "factories", count: "7+" }
];
