import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext();

export const CartProvider = ({
  children,
}) => {

  // LOAD INITIAL CART

  const [cartItems, setCartItems] =
    useState(() => {

      const storedCart =
        localStorage.getItem(
          "khudeeCart"
        );

      return storedCart
        ? JSON.parse(storedCart)
        : [];

    });

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // SAVE CART

  useEffect(() => {

    localStorage.setItem(
      "khudeeCart",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);

  // ADD TO CART

  const addToCart =
  (product) => {

    const existingItemIndex =
      cartItems.findIndex(

        (item) =>

          item._id ===
            product._id &&

          item.selectedSize ===
            product.selectedSize &&

          item.selectedVariant
            ?.color ===
          product.selectedVariant
            ?.color
      );

    if (
      existingItemIndex !== -1
    ) {

      const updatedCart =
        [...cartItems];

      updatedCart[
        existingItemIndex
      ].quantity += 1;

      setCartItems(
        updatedCart
      );

      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          updatedCart
        )
      );

      return;
    }

    const updatedCart = [

      ...cartItems,

      {
        ...product,
        quantity: 1,
      },

    ];

    setCartItems(
      updatedCart
    );

    localStorage.setItem(
      "cartItems",
      JSON.stringify(
        updatedCart
      )
    );
  };

  // REMOVE

  const removeFromCart = (index) => {

    setCartItems(
      cartItems.filter(
        (_, i) => i !== index
      )
    );
  };

  // INCREASE

  const increaseQty = (index) => {

    const updated = [...cartItems];

    updated[index].quantity += 1;

    setCartItems(updated);
  };

  // DECREASE

  const decreaseQty = (index) => {

    const updated = [...cartItems];

    if (
      updated[index].quantity > 1
    ) {

      updated[index].quantity -= 1;

      setCartItems(updated);

    }
  };

  const clearCart =
  () => {

    setCartItems([]);

    localStorage.removeItem(
      "cartItems"
    );
  };

return (

  <CartContext.Provider
    value={{

      cartItems,

      addToCart,

      removeFromCart,

      increaseQty,

      decreaseQty,

      clearCart,

      isCartOpen,

      setIsCartOpen,

    }}
  >

    {children}

  </CartContext.Provider>
);
};

export const useCart = () =>
  useContext(CartContext);