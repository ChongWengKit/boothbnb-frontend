
import TopBar from "./components/TopBar";
import Link from "next/link";
import Image from "next/image";
import EventMap from "../../components/event-detail/EventMap";
import EventCard from "../(main)/(public)/components/EventCard";
import { validateResponse } from "@/app/contexts/auth";
import type { Event } from "@/app/(main)/(vendor)/hooks/useBookmarks";

async function getLatestEvents() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/event?page=1&limit=10`, {
            cache: 'no-store'
        });
        const json = await res.json();
        return json.data || [];
    } catch (e) {
        return [];
    }
}

async function Landing() {
    const events = await getLatestEvents();

    const images = [
        "https://res.cloudinary.com/di3qccrxy/image/upload/v1777507179/a-n-v-e-s-h-DcXj70OgoPw-unsplash_1_u1o6gs.jpg",
        "https://res.cloudinary.com/di3qccrxy/image/upload/v1777507179/josh-liu-Tjio9DgtIls-unsplash_cj6b9j.jpg",
        "https://res.cloudinary.com/di3qccrxy/image/upload/v1777507577/jezael-melgoza-HYQvV8wWX18-unsplash_1_kulxn3.jpg",
        "https://res.cloudinary.com/di3qccrxy/image/upload/v1777507183/tai-jyun-chang-S8qw5hyFoo8-unsplash_vjj8jo.jpg",
        "https://res.cloudinary.com/di3qccrxy/image/upload/v1777507184/claudio-schwarz-Irxq25Os9_k-unsplash_ucwxbl.jpg",
        "https://res.cloudinary.com/di3qccrxy/image/upload/v1777507188/kayle-kaupanger-J8ksCswaBYo-unsplash_hqftof.jpg",
        
    ];

    return (
        <>
            <TopBar />

            <div className="flex min-h-screen flex-col overflow-x-hidden font-sans text-foreground">
                <section className="relative w-full overflow-hidden" aria-labelledby="hero-heading">
                    <div className="grid grid-cols-1">
                        <div className="col-start-1 row-start-1 grid grid-cols-2 md:grid-cols-3 gap-4 px-8 pb-8">
                            {images.map((src, index) => (
                                <div key={index} className="relative h-full w-full aspect-[4/3] overflow-hidden rounded-3xl bg-card/10 shadow-lg backdrop-blur-sm">
                                    <Image src={src} alt={`Grid image ${index + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="col-start-1 row-start-1 relative z-20 flex flex-1 items-center pointer-events-none">
                            <div className="container mx-auto grid grid-cols-1 gap-12 px-8 lg:grid-cols-2 pointer-events-auto">
                                <div className="text-left">
                                    <h1 id="hero-heading" className="text-5xl font-semibold leading-tight text-white md:text-8xl">
                                        BoothBnB
                                    </h1>
                                    <p className="mt-8 max-w-2xl text-lg text-white md:text-xl">
                                        Unlock your own booth space in minutes. Host your event, exhibition, or food & beverage service with ease.
                                    </p>
                                    <div className="mt-8 flex gap-4">
                                        <Link href="/dashboard">
                                            <button className="cursor-pointer rounded-full bg-black/30 px-8 py-4 font-bold text-white backdrop-blur-sm transition-colors hover:bg-black/45">
                                                Find a Space
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-4 md:mx-8 flex flex-col md:flex-row gap-8 py-8 px-4 md:px-8 bg-secondary rounded-3xl md:h-[650px]" aria-labelledby="latest-heading">
                    <div className="w-full overflow-hidden rounded-2xl border border-border bg-background shadow-inner aspect-square md:h-full md:flex-1 md:aspect-auto">
                        <EventMap zoom={1} events={events} interactive={false} />
                    </div>

                    <div className="w-full md:flex-1 flex flex-col gap-6 h-full overflow-hidden ">
                        <h2 id="latest-heading" className="text-3xl font-bold text-foreground">Latest Booths</h2>
                        <div className="flex flex-row md:flex-col gap-4 overflow-x-auto pb-4 border border-border rounded-lg p-4">
                            {events.map((event: Event) => (
                                <article key={event.id} className="min-w-[280px]">
                                    <EventCard event={event} variant="horizontal" />
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-8 flex flex-col items-center py-20" aria-labelledby="suitable-heading">
                    <h2 id="suitable-heading" className="mb-10 text-3xl font-bold text-foreground">Suitable for</h2>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 px-8 w-full max-w-4xl justify-center">
                        {['Event', 'Exhibition', 'Food & Beverage'].map((item, index) => (
                            <article key={index} className="rounded-xl border-2 border-border bg-card p-6 text-center text-xl font-bold text-card-foreground shadow-lg transition-shadow hover:shadow-2xl md:p-8">
                                {item}
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mx-8 mb-4 flex flex-col items-center justify-center rounded-xl bg-primary px-8 py-20 text-center text-primary-foreground" aria-labelledby="cta-heading">
                    <h2 id="cta-heading" className="text-2xl font-bold text-primary-foreground md:text-4xl">Have a space? Start Earning Today.</h2>
                    <Link href="/getstarted">
                        <button className="mt-8 cursor-pointer rounded-full border-2 border-primary-foreground/60 bg-background px-8 py-4 font-bold text-foreground shadow-lg transition-colors hover:bg-background/90">
                            Get Started
                        </button>
                    </Link>
                    <p className="mt-4 text-md text-primary-foreground/90 md:text-xl">Join a community of successful vendors</p>
                </section>
            </div>
        </>
    );
}
export default Landing;