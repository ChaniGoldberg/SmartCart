import { useContext, useEffect } from "react";
import { cartContext } from '../redux/cartRedux';

const cart = useContext(cartContext);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart.cartItems));
  }, [cart.cartItems]);