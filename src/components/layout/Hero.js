import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return(
        <section className="bg-white lg:mt-16 mt-8 mx-5">
            <div className="grid dark:bg-secondary px-10 lg:px-20 rounded-3xl max-w-screen-xl py-16 mx-auto lg:gap-8 xl:gap-6 lg:grid-cols-12">
                <div className="lg:mr-auto place-self-center lg:col-span-7">
                    <h1 className="max-w-2xl mb-4 text-4xl font-bold tracking-tight leading-none lg:text-5xl xl:text-6xl">Indulge in Freshly Baked Temptations</h1>
                    <p className="max-w-2xl mb-6 font-light lg:mb-8 sm:text-lg lg:text-xl">From first glance to last bite, our freshly baked temptations promise a sweet journey of indulgence and delight!</p>
                    <a href="#" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-dark">
                        View All Categories
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"></path></svg>
                    </a>
                </div>
                <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                    <Image className="rounded-xl" src={"/EidCupcakes.jpg"} width={600} height={600} alt={"cupcakes"} />
                </div>                
            </div>
        </section>
    );
}