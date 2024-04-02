import Calendar from "@/components/icons/Calendar"
import Cupcake from "@/components/icons/Cupcake"
import Hearts from "@/components/icons/Hearts"
import Cogwheel from "@/components/icons/Cogwheel"

export default function Promises(){
    return (
        <section className="bg-secondary h-full py-10 mb-32 px-8">
            <div className="font-ovo text-center text-4xl text-[#403E3E]">
                OUR PROMISES TO YOU
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 max-w-6xl mx-auto mt-12 items-center">
                <div className="">
                    <Calendar className="size-20 block mx-auto mt-2"/>
                    <h4 className="font-ovo text-center text-2xl mt-7">7 DAYS A<br />WEEK</h4>
                    <p className="text-center mt-5 font-extralight text-lg">Here for you when you<br/>need us&nbsp;(Mon - Sun)</p>
                </div>
                <div className="">
                    <Cupcake className="size-24 block mx-auto"/>
                    <h4 className="font-ovo text-center text-2xl mt-5">FRESHLY BAKED<br />HOME-MADE</h4>
                    <p className="text-center mt-5 font-extralight text-lg">Straight from our oven to<br />your table</p>
                </div>
                <div className="">
                    <Hearts className="size-24 block mx-auto"/>
                    <h4 className="font-ovo text-center text-2xl mt-5">MONTHLY<br />SPECIALS</h4>
                    <p className="text-center mt-5 font-extralight text-lg">Savor new flavors every<br />month!</p>
                </div>
                <div className="">
                    <Cogwheel className="size-24 block mx-auto"/>
                    <h4 className="font-ovo text-center text-2xl mt-5">CUSTOM ORDERS<br />AVAILABLE</h4>
                    <p className="text-center mt-5 font-extralight text-lg">Bring your sweet dreams<br />to life!</p>
                </div>
            </div>
        </section>
    );
}