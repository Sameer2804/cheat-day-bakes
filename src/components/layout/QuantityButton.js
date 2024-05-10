import Plus from "@/components/icons/Plus"
import Minus from "@/components/icons/Minus"

export default function QuantityButton({ quantity, setQuantity, isBig }) {
    const decreaseQuantity = () => {
        setQuantity(quantity !== 1 ? quantity - 1 : quantity);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className={`border border-black px-2 flex items-center justify-between ${isBig ? 'py-2' : 'py-1.5'}`}>
            <div className='cursor-pointer' onClick={decreaseQuantity}><Minus className={`${isBig ? 'size-5' : 'size-4'}`}/></div>
            <div className='select-none'>{quantity}</div>
            <div className='cursor-pointer' onClick={increaseQuantity}><Plus className={`${isBig ? 'size-5' : 'size-4'}`}/></div>
        </div>
    );
}
