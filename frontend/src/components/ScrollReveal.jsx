import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Per-item delay: custom = column index (0, 1, 2) ── */
export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            delay: i * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

/**
 * ScrollSection — container with ONE observer.
 * No staggerChildren here — timing is handled individually by custom={i} on each child.
 */
export const ScrollSection = ({ children, className = "", as = "div" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "0px" });

    const Component = motion[as] ?? motion.div;

    return (
        <Component
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{ hidden: {}, visible: {} }}
            className={className}
        >
            {children}
        </Component>
    );
};

/**
 * ScrollReveal — child item. Use custom={columnIndex} (0, 1, 2) for left-to-right stagger.
 * custom=0 → appears immediately
 * custom=1 → appears 0.2s later
 * custom=2 → appears 0.4s later
 */
const ScrollReveal = ({ children, custom = 0, className = "", style = {} }) => {
    return (
        <motion.div
            custom={custom}
            variants={fadeUp}
            style={{ willChange: "opacity, transform", ...style }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
