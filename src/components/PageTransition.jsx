'use client';

import {usePathname} from 'next/navigation';
import {
    AnimatePresence,
    motion,
    useReducedMotion
} from 'framer-motion';

/**
 * PageTransition – fast, mobile-first “page flip”
 * -----------------------------------------------
 *  • ~0.55 s Y-axis rotation with subtle depth
 *  • One DOM layer  → low GPU cost
 *  • Respects prefers-reduced-motion
 *  • Responsive all the way down to 320 px
 */
export default function PageTransition({children}) {
    const path = usePathname();
    const noMotion = useReducedMotion();

    if (noMotion) return <>{children}</>;

    /* design tokens */
    const sheetStyle = {
        position: 'relative',
        minHeight: '100%',
        background: 'inherit',
        borderRadius: '4px',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        /* lift + soft edge */
        boxShadow: '0 2px 10px rgba(0,0,0,.28)'
    };

    const edgeShadow = {
        position: 'absolute',
        inset: '0 0 0 auto',
        width: '5px',
        background: 'linear-gradient(270deg, rgba(0,0,0,.16), transparent)',
        pointerEvents: 'none'
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={path}
                initial={{rotateY: -65, opacity: 0, transformOrigin: 'left center'}}
                animate={{rotateY: 0, opacity: 1}}
                exit={{rotateY: 65, opacity: 0, transformOrigin: 'right center'}}
                transition={{duration: .55, ease: [.25, 1, .3, 1]}}
                style={{
                    perspective: '1400px',
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={sheetStyle}>
                    <div style={edgeShadow}/>
                    {children}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
