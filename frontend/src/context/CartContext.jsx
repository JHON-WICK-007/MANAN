import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.items.find((i) => i._id === action.payload._id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i._id === action.payload._id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case "REMOVE_ITEM":
            return { ...state, items: state.items.filter((i) => i._id !== action.payload) };
        case "UPDATE_QUANTITY":
            return {
                ...state,
                items: state.items.map((i) =>
                    i._id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
                ),
            };
        case "CLEAR_CART":
            return { ...state, items: [], promoCode: "", promoType: "", promoValue: 0, discountLabel: "" };
        case "SET_DISCOUNT":
            return { ...state, promoCode: action.payload.code, promoType: action.payload.type, promoValue: action.payload.value, discountLabel: action.payload.label };
        case "CLEAR_DISCOUNT":
            return { ...state, promoCode: "", promoType: "", promoValue: 0, discountLabel: "" };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [], promoCode: "", promoType: "", promoValue: 0, discountLabel: "" });

    const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
    const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
    const updateQuantity = (id, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    const clearCart = () => dispatch({ type: "CLEAR_CART" });

    const applyDiscount = (code, type, value, label) => dispatch({ type: "SET_DISCOUNT", payload: { code, type, value, label } });
    const removeDiscount = () => dispatch({ type: "CLEAR_DISCOUNT" });

    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = subtotal * 0.05;
    
    let activeDiscount = 0;
    if (state.promoType === "percent") {
        activeDiscount = subtotal * (state.promoValue / 100);
    } else if (state.promoType === "flat") {
        activeDiscount = Math.min(state.promoValue, subtotal);
    }
    
    const total = subtotal + tax - activeDiscount;

    return (
        <CartContext.Provider value={{ 
            items: state.items, addItem, removeItem, updateQuantity, clearCart, 
            itemCount, subtotal, tax, total, 
            activeDiscount, discountLabel: state.discountLabel, promoCode: state.promoCode,
            applyDiscount, removeDiscount 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};