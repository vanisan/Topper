
import React from 'react';

// Keyframes for the shimmer animation (Stage 3)
const animationKeyframes = `
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
`;

const formatRating = (num: number): string => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'к';
    }
    return num.toString();
};


interface RatingBarProps {
    rating: number;
}

const RatingBar: React.FC<RatingBarProps> = ({ rating }) => {
    let barStyle: React.CSSProperties = {};
    const textValue = formatRating(rating);

    // Stage 1: 0-100 -> Fills up, transitioning from white/light blue to dark blue
    if (rating <= 100) {
        const progress = rating / 100;
        // Interpolate HSL values for a smooth color transition
        // Lightness: from 95% (almost white) down to 40% (deep blue)
        const lightness = 95 - 55 * progress;
        // Saturation: from 30% (pale) up to 90% (vibrant)
        const saturation = 30 + 60 * progress;
        
        barStyle = {
            width: `${rating}%`,
            background: `hsl(220, ${saturation}%, ${lightness}%)`, 
            transition: 'width 0.5s ease-out, background 0.5s ease-out',
        };
    } 
    // Stage 2: 101-200 -> Bar is full, transitions from pale to rich gold
    else if (rating <= 200) {
        const goldProgress = (rating - 100) / 100; // From 0.0 to 1.0
        
        // Interpolate HSL lightness for a smooth transition from pale to rich gold
        const startLightness = 90 - (30 * goldProgress); // from 90% (pale) to 60%
        const endLightness = 80 - (30 * goldProgress);   // from 80% to 50% (rich)

        barStyle = {
            width: '100%',
            background: `linear-gradient(to bottom, hsl(48, 95%, ${startLightness}%), hsl(48, 95%, ${endLightness}%))`,
            transition: 'background 0.5s ease-in-out',
        };
    } 
    // Stage 3: 201+ -> Bar is full gold and shimmers with red, animation speeds up with rating
    else {
        const speedSteps = Math.floor((rating - 201) / 50);
        const duration = Math.max(0.8, 4 - speedSteps * 0.6); // Starts at 4s, gets faster, caps at 0.8s

        barStyle = {
            width: '100%',
            // A wide gradient that will be animated
            background: 'linear-gradient(110deg, #fde047, #fca5a5, #dc2626, #fca5a5, #fde047)',
            backgroundSize: '400% 100%',
            animation: `shimmer ${duration}s linear infinite`,
        };
    }

    return (
        <>
            <style>{animationKeyframes}</style>
            <div 
                className="w-full bg-gray-300 dark:bg-gray-700 rounded-sm h-5 border-b border-gray-400 dark:border-gray-900 relative"
            >
                <div
                    className="h-full rounded-sm flex items-center justify-end"
                    style={barStyle}
                >
                    {rating >= 10 && (
                         <span className="px-2 text-white text-xs font-bold [text-shadow:0_1px_1px_rgba(0,0,0,0.7)]">
                            {textValue}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
};

export default RatingBar;
