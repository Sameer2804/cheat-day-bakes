import { cartProductPrice } from "@/components/AppContext"

export default function OrderReceipt({cartProducts, selectedDate, total, hasTimeBeenSelected}) {

    const formatDate = (date, hasTimeBeenSelected) => {

        let formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    
        if (hasTimeBeenSelected) {
            formattedDate += ' - ' + date.toLocaleTimeString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
        } else {
            formattedDate += ' - NO TIME';
        }

        if (formattedDate.includes('0:00')) {
            formattedDate = formattedDate.replace('0:00', '12:00');
        }
    
        return formattedDate;
    };

    return(
        <>
            <div className="font-ovo text-[2.65rem] mb-6">Your Order</div>
            <div>
                <div className="flex justify-between text-xs mt-10 lg:mt-5 pb-1 font-light tracking-widest border-b border-thinGray mb-5">
                    <div>PRODUCT</div>
                    <div className="ml-auto">SUBTOTAL</div>
                </div>
                <div className="border-b border-thinGray mb-3">
                {cartProducts.length > 0 && cartProducts.map(product => (
                    <div className="flex justify-between">
                        <div className="mb-4 tracking-wider">
                            <div className="font-medium mb-1">
                                {`${product.quantity}x ${product.name}`}
                            </div>
                            {product.toppings?.length > 0 && (
                                <div className="text-sm max-w-60 tracking-wider text-gray-500 mb-0.5">
                                    <span className="font-medium">Toppings:</span> {product.toppings.map((topping, index) => (
                                        <span key={topping.id}>
                                            {`${topping.name}`}
                                            {topping.price > 0 && ` (£${topping.price.toFixed(2)})`}
                                            {index !== product.toppings.length - 1 && ", "}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {product.size && (
                                <div className="text-sm max-w-72 tracking-wider text-gray-500 mb-0.5">
                                    <span className="font-medium">Size:</span> {product.size.name}
                                </div>
                            )}
                            {product.giftBoxOption && (
                                <div className="text-sm text-gray-500 tracking-wider mb-0.5">
                                    <span className="font-medium">Gift box:</span> {product.giftBox ? `Yes (£${(1.50).toFixed(2)} x ${product.quantity})` : 'No'}
                                </div>
                            )}
                        </div>
                        <div>
                            £{cartProductPrice(product).toFixed(2)}
                        </div>
                    </div>
                ))}
                </div>
                <div className="flex justify-between border-b border-thinGray pb-3 mb-3">
                    <div className="font-semibold">TOTAL:</div>
                    <div>£{total}</div>
                </div>
                <div className="uppercase font-semibold border-b border-thinGray pb-3 mb-3">Collection for {selectedDate ? formatDate(selectedDate, hasTimeBeenSelected).replace(',', ' -') : ''}</div>
            </div>
        </>
    )
}