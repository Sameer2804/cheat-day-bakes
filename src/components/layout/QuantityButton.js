import Plus from "@/components/icons/Plus"
import Minus from "@/components/icons/Minus"

export default function QuantityButton({ quantity, setQuantity }) {
    const decreaseQuantity = () => {
        setQuantity(quantity !== 1 ? quantity - 1 : quantity);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="border border-black p-2 flex items-center justify-between">
            <div className='cursor-pointer' onClick={decreaseQuantity}><Minus /></div>
            <div className='select-none'>{quantity}</div>
            <div className='cursor-pointer' onClick={increaseQuantity}><Plus /></div>
        </div>
    );
}
