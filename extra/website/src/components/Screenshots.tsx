import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface Screenshot {
    imageLight: string;
    imageDark: string;
    title: string;
    description: string;
}

interface ScreenshotsProps {
    screenshots: Screenshot[];
}

export function Screenshots({ screenshots }: ScreenshotsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <Swiper
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                color="white"
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                className="w-full py-12">
                {screenshots.map((screenshot, index) => (
                    <SwiperSlide
                        key={index}
                        className="w-[280px] bg-paper-light dark:bg-paper-dark overflow-hidden"
                        style={{ borderRadius: 45 }}>
                        <div className="relative">
                            <img
                                src={screenshot.imageLight}
                                alt={screenshot.title}
                                className="w-full object-cover dark:hidden"
                            />
                            <img
                                src={screenshot.imageDark}
                                alt={screenshot.title}
                                className="w-full object-cover hidden dark:block"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8 text-white">
                                <h3 className="text-lg font-semibold mb-2">
                                    {screenshot.title}
                                </h3>
                                <p className="text-sm opacity-90">
                                    {screenshot.description}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.div>
    );
}
