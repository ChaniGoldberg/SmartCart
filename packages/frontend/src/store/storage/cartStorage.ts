import { useContext, useEffect } from "react";
import { cartContext } from '../redux/cartRedux';

const cartC = useContext(cartContext);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartC.cartItems));
  }, [cartC.cartItems]);