import { motion } from "framer-motion";

const pageVariants = {
    initial: {
        opacity: 0,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: "easeInOut",
        },
    },
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
