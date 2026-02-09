import data from "../../data.json";
import addToCart from "../../assets/images/icon-add-to-cart.svg";
import decrementIcon from "../../assets/images/icon-decrement-quantity.svg";
import incrementIcon from "../../assets/images/icon-increment-quantity.svg";
import emptyCart from "../../assets/images/illustration-empty-cart.svg";
import carbonNeutral from "../../assets/images/icon-carbon-neutral.svg";
import greenTick from "../../assets/images/icon-order-confirmed.svg";
import xIcon from "../../assets/images/icon-remove-item.svg"
import { useEffect, useState } from "react";
import type { CartEntry, Items } from "../types/types";


const Cards = () => {
  const response = data;
  const [cart, setCart] = useState<CartEntry[]>([]);

  const updateQty =
    (delta: number) => (previousCart: CartEntry[], item: Items) => {
      const index = previousCart.findIndex(
        (cartItem) => cartItem.name === item.name,
      );

      if (index === -1) {
        return delta > 0
          ? [...previousCart, { ...item, quantity: delta }]
          : previousCart;
      }
      return previousCart
        .map((cartItem, i) =>
          i === index
            ? { ...cartItem, quantity: Math.max(0, cartItem.quantity + delta) }
            : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0);
    };

  const handleAddToCart = (item: Items) =>
    setCart((previousCart) => updateQty(1)(previousCart, item));

  const handleIncrement = (item: Items) =>
    setCart((previousCart) => updateQty(1)(previousCart, item));

  const handleDecrement = (item: Items) =>
    setCart((previousCart) => updateQty(-1)(previousCart, item));

  const getQty = (name: string) => {
    const foundItem = cart.find((cartItem) => cartItem.name === name);
    return foundItem ? foundItem.quantity : 0;
  };

  const removeFromCart = (name: string) => {
    setCart((previousCart) => previousCart.filter((cartItem) => 
      cartItem.name !== name));
  }

  return (
    <>
    <div className="lg:grid lg:grid-cols-[70%_30%] lg:gap-3 items-start">
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5">
      {response.map((item) => (
        <div key={item.name} className="flex flex-col">
          <div className="flex relative justify-center">
            <img
              className={`rounded-lg mt-5 ${getQty(item.name) > 0 ? "ring-2 ring-rose-700" : ""}`}
              src={item.image.mobile}
              alt={item.name}
            />
            {getQty(item.name) > 0 ? (
              <div className="flex absolute -bottom-5 bg-orange-700 p-3 border border-orange-700 rounded-4xl font-bold items-center">
                <button
                  className="p-2 py-3 mr-5 cursor-pointer border border-white rounded-full"
                  onClick={() => handleDecrement(item)}
                >
                  <img src={decrementIcon} alt="decrement" className="w-2" />
                </button>
                <div className="px-3 py-1 rounded-full text-sm text-white">
                  {getQty(item.name)}
                </div>
                <button
                  className="p-2 ml-5 cursor-pointer border border-white rounded-full"
                  onClick={() => handleIncrement(item)}
                >
                  <img src={incrementIcon} alt="decrement" className="w-2" />
                </button>
              </div>
            ) : (
              <div className="flex absolute -bottom-5 bg-white p-3 px-7 border border-orange-700 rounded-4xl font-bold items-center">
                <img
                  src={addToCart}
                  alt="add to cart"
                  className="w-6 h-full mr-2"
                />
                <button
                  className="px-3 py-1 rounded-full text-sm bg-transparent text-orange-700"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
          <div className="mt-7">
            <h1 className="font-base text-sm text-rose-400">{item.category}</h1>
            <p className="font-bold">{item.name}</p>
            <p className="font-semibold text-orange-700">
              ${item.price.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
    <div className="lg:flex lg:flex-1">
      <CartMenu cart={cart} onRemove={removeFromCart}/>
    </div>
    </div>
    </>
  );
};

export default Cards;

export const CartMenu = ({ cart, onRemove }: { 
  cart: CartEntry[]; 
  onRemove: (name:string) => void;}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const getCartTotal = (cart: CartEntry[]) =>
    cart.reduce(
      (sum, cartItem) => sum + cartItem.quantity * (cartItem.price ?? 0),
      0,
    );
  
  useEffect(() => {
  document.body.style.overflow = showConfirm ? "hidden" : "";
  return () => { document.body.style.overflow = ""; };
}, [showConfirm]);
  const hasItems = cart.length > 0;
  return (
    <div className="mt-7 bg-white p-5 rounded-lg mb-7">
      <h1 className="font-bold text-3xl text-rose-700">Your Cart</h1>

      {!hasItems ? (
        <>
          <img src={emptyCart} alt="empty cart icon" className="m-auto w-35" />
          <p className="text-center font-semibold my-5 text-rose-800">
            Your added items will appear here
          </p>
        </>
      ) : (
        <div>
          {cart.map((cartItem) => (
            <>
              <div
                key={cartItem.name}
                className="flex flex-row items-center justify-between"
              >
                <div>
                <p className="font-medium mt-3">{cartItem.name}</p>
                <div className="flex flex-row mt-2">
                  <p className="font-bold text-rose-600 mr-5">
                    {cartItem.quantity}x
                  </p>
                  <p className="font-base text-rose-400">@{cartItem.price?.toFixed(2)}</p>
                  <p className="font-medium text-rose-400 ml-5">
                    ${(cartItem.price * cartItem.quantity).toFixed(2)}
                  </p>
                  </div>
                </div>
                  <div>
                    <button className="border p-2 rounded-full text-rose-400"
                    onClick={() => onRemove(cartItem.name)}
                    >
                      <img className="" src={xIcon} alt="x icon"
                      />
                    </button>
                    </div>
              </div>
                <hr className="w-full border-t border-gray-200 my-3" />
            </>
          ))}
          <div className="flex flex-row justify-between mt-7">
            <h2 className="font-medium text-rose-500">Order Total</h2>
            <p className="font-extrabold text-2xl">${getCartTotal(cart).toFixed(2)}</p>
          </div>
          <div className="bg-rose-100 p-3 text-center mt-5 rounded flex justify-center">
            <img src={carbonNeutral} alt="carbon neutral" className="mr-3" />
            <p className="mr-5 text-rose-500">
              This is a <strong>carbon-neutral</strong> delivery
            </p>
          </div>
          <button
            className="rounded-4xl cursor-pointer bg-orange-700 text-white font-medium text-lg p-3 w-full mt-7"
            onClick={() => setShowConfirm(true)}
          >
            Confirm Order
          </button>
          {showConfirm && (
            <ConfirmOverlay cart={cart} onClose={() => setShowConfirm(false)} />
          )}
        </div>
      )}
    </div>
  );
};

export const ConfirmOverlay = ({
  cart,
  onClose,
}: {
  cart: CartEntry[];
  onClose: () => void;
}) => {
  const getCartTotal = (cart: CartEntry[]) =>
    cart.reduce(
      (sum, cartItem) => sum + cartItem.quantity * (cartItem.price ?? 0),
      0,
    );
  return (
    <div 
    className="fixed inset-0 bg-black/50 z-50"
    onClick={onClose}
    >
      <div className="absolute inset-0">
      <div 
      className="absolute lg:w-124 lg:inset-0 bg-white rounded-xl p-6 bottom-0 w-full m-auto z-10 overflow-y-auto max-h-[80vh]"
      onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 mt-3">
          <img src={greenTick} alt="green tick icon" />
          <h1 className="text-4xl font-extrabold w-50 lg:w-full mt-7">Order Confirmed</h1>
          <p className="mt-3 text-rose-400 font-medium">
            We hope you enjoy your food!
          </p>
        </div>
        <div className="mt-5 bg-rose-100 p-5 rounded">
        {cart.map((cartItem) => (
          <>
          <div className="flex items-center mt-2 justify-between">
            <div className="flex flex-row gap-4">
              <img
                src={cartItem.image.thumbnail}
                alt="food image"
                className="w-15 rounded"
              />
              <div className="">
                <p className="font-medium">{cartItem.name}</p>
                <div className="flex">
                  <p className="font-bold text-rose-600 mr-5">
                    {cartItem.quantity}x
                  </p>
                  <p className="font-base text-rose-400">@{cartItem.price}</p>
                </div>
              </div>
            </div>
            <p className="font-semibold text-lg">
              ${(cartItem.price * cartItem.quantity).toFixed(2)}
            </p>
          </div>
            <hr className="w-full border-t border-gray-200 my-3" />
            </>
        ))}
        <div className="flex flex-row justify-between mt-10">
          <h2 className="font-medium text-rose-500">Order Total</h2>
          <p className="font-extrabold text-2xl">${getCartTotal(cart).toFixed(2)}</p>
        </div>
        </div>
        <button 
        className="cursor-pointer w-full rounded-3xl bg-orange-600 text-white p-3 mt-8 font-bold"
        onClick={onClose}
        >
          Start New Order
          </button>
      </div>
      </div>
    </div>
  );
};
