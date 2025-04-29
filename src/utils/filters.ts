export enum DateFilter {
  lastWeek = "last week",
  lastMonth = "last month",
  lastQuarter = "last quarter",
  forever = "forever",
}

export function toDateSearch(filter: DateFilter | undefined) {
  switch (filter) {
    case DateFilter.lastWeek:
      return "date:now_sub_1w-now";
    case DateFilter.lastMonth:
      return "date:now_sub_4w-now";
    case DateFilter.lastQuarter:
      return "date:now_sub_13w-now";
    default:
      return undefined;
  }
}

export function toTagSearch(tagIds: string[]) {
  const filterField = tagIds.length === 1 ? "tag" : "tag_or";

  return tagIds.map((filter) => `${filterField}:${filter}`).join(" ");
}
