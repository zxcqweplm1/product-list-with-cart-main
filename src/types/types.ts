
export type Items = {
  name: string;
  price: number;
  image: { mobile: string; thumbnail: string;};
  category?: string;
};

export type CartEntry = Items & {
  quantity: number;
};