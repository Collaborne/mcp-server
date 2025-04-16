export enum DateFilter {
  lastWeek = "last week",
  lastMonth = "last month",
  lastQuarter = "last quarter",
  forever = "forever",
}
export enum TypeFilter {
  pain_point = "Pain Point",
  enhancement_request = "Product Enhancement Request",
  issue = "Product Issue",
  compliment = "General Compliment",
  positive_feedback = "Positive Product Feedback",
  competitor_strength = "Competitor Strength",
  competitor_weakness = "Competitor Weakness",
}
export enum ChartOption {
  account_name = "account name",
  account_industry = "account industry",
  account_segment = "account segment",
  account_region = "account region",
  account_employee_size = "account employee size",
  account_account_type = "account account type",
  account_status = "account status",
}

export function getTypeKey(filterValue: TypeFilter): string | undefined {
  const key = Object.keys(TypeFilter).find(
    (key) => TypeFilter[key as keyof typeof TypeFilter] === filterValue
  );

  if (!key) {
    return undefined;
  }

  return key.replace("_", "-");
}

export function getChartKey(filterValue: ChartOption): string | undefined {
  return Object.keys(ChartOption).find(
    (key) => ChartOption[key as keyof typeof ChartOption] === filterValue
  );
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

export function toTypeSearch(types: TypeFilter[] = []) {
  const filters = types.map((filter) => `${getTypeKey(filter)}`);

  const filterField = filters.length === 1 ? "tag" : "tag_or";

  return filters.map((filter) => `${filterField}:${filter}`).join(" ");
}
