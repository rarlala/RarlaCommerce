export const TAKE = 9;
export const CATEGORY_MAP = ["Sneakers", "T-shirt", "Pants", "Cap", "Hoodie"];
export const ORDER_BY = [
  { label: "최신순", value: "latest" },
  { label: "높은 가격 순", value: "expensive" },
  { label: "낮은 가격 순", value: "cheep" },
];

export const getOrderBy = (orderBy?: string) => {
  return orderBy
    ? orderBy === "latest"
      ? { orderBy: { createdAt: "desc" } }
      : orderBy === "expensive"
      ? { orderBy: { price: "desc" } }
      : { orderBy: { price: "asc" } }
    : undefined;
};
