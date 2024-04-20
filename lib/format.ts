export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN" 
    }).format(price);
};
