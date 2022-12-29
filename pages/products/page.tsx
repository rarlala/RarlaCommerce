import { categories, products } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Pagination, SegmentedControl, Select } from "@mantine/core";
import { CATEGORY_MAP, ORDER_BY, TAKE } from "constants/products";

export default function Products() {
  const [activePage, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<categories[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string>("-1");
  const [products, setProducts] = useState<products[]>([]);
  const [selectedOrderBy, setOrderBy] = useState<string | null>(
    ORDER_BY[0].value
  );

  useEffect(() => {
    fetch(`/api/get-categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.items));
  }, []);

  useEffect(() => {
    fetch(`/api/get-products-count?category=${selectedCategories}`)
      .then((res) => res.json())
      .then((data) => setTotal(Math.ceil(data.items / TAKE)));
  }, [selectedCategories]);

  useEffect(() => {
    const skip = TAKE * (activePage - 1);
    fetch(
      `/api/get-products?skip=${skip}&take=${TAKE}&category=${selectedCategories}&orderBy=${selectedOrderBy}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data.items));
  }, [activePage, selectedCategories, selectedOrderBy]);

  return (
    <div className="px-36 mt-36 mb-36">
      <div className="mb-4">
        <Select value={selectedOrderBy} onChange={setOrderBy} data={ORDER_BY} />
      </div>
      {categories && (
        <div className="mb-4">
          <SegmentedControl
            value={selectedCategories}
            onChange={setSelectedCategories}
            data={[
              { label: "All", value: "-1" },
              ...categories.map((category) => ({
                label: category.name,
                value: String(category.id),
              })),
            ]}
            color="dart"
          />
        </div>
      )}
      {products && (
        <div className="grid grid-cols-3 gap-5">
          {products.map((item) => (
            <div key={item.id} className="max-w-300">
              <Image
                className="rounded m-auto"
                src={item.image_url ?? ""}
                alt={item.name}
                width={300}
                height={200}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BwBgAE0gHNDYXhbQAAAABJRU5ErkJggg=="
              />
              <div className="flex">
                <span>{item.name}</span>
                <span className="ml-auto">
                  {item.price.toLocaleString("ko-KR")}원
                </span>
              </div>
              <span className="text-zinc-400">
                {CATEGORY_MAP[item.category_id - 1]}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="w-full flex mt-5">
        <Pagination
          className="m-auto"
          page={activePage}
          onChange={setPage}
          total={total}
        />
      </div>
    </div>
  );
}
