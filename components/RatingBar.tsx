
import React from 'react';

interface RatingBarProps {
    rating: number;
}

const RatingBar: React.FC<RatingBarProps> = ({ rating }) => {
    let barStyle: React.CSSProperties = {};
    let containerStyle: React.CSSProperties = {};
    const textValue = rating;

    // Stage 1: 0-100 -> Fills up with a blue gradient
    if (rating <= 100) {
        const percentage = Math.max(0, rating); // Ensure it's not negative
        barStyle = {
            width: `${percentage}%`,
            // Darkening blue gradient
            background: 'linear-gradient(to bottom, #3b82f6, #1e40af)', 
            transition: 'width 0.5s ease-out, background 0.5s ease-out',
        };
    } 
    // Stage 2: 101-200 -> Bar is full, transitions to gold
    else if (rating <= 200) {
        const goldProgress = (rating - 100) / 100; // From 0.0 to 1.0
        
        // Interpolate HSL lightness for a smooth transition from pale to rich gold
        const startLightness = 85 - (25 * goldProgress); // from 85% (pale) to 60%
        const endLightness = 75 - (25 * goldProgress);   // from 75% to 50% (rich)

        barStyle = {
            width: '100%',
            background: `linear-gradient(to bottom, hsl(48, 95%, ${startLightness}%), hsl(48, 95%, ${endLightness}%))`,
            transition: 'background 0.5s ease-in-out',
        };
    } 
    // Stage 3: 201+ -> Bar is gold, red glowing frame appears and intensifies
    else {
        barStyle = {
            width: '100%',
            // Full, rich gold
            background: 'linear-gradient(to bottom, hsl(48, 95%, 60%), hsl(48, 95%, 50%))',
        };

        const glowRating = rating - 200;
        const glowSteps = Math.floor(glowRating / 150);
        
        const blur = 5 + glowSteps * 3;
        const spread = 2 + glowSteps * 2;
        // Opacity starts low and increases, capped at 1
        const opacity = Math.min(0.4 + glowSteps * 0.15, 1);

        containerStyle = {
             boxShadow: `0 0 ${blur}px ${spread}px rgba(255, 20, 20, ${opacity})`,
             transition: 'box-shadow 0.5s ease-in-out',
        };
    }

    return (
        <div 
            className="w-full bg-gray-300 dark:bg-gray-700 rounded-sm h-5 border-b border-gray-400 dark:border-gray-900 relative"
            style={containerStyle}
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
    );
};

export default RatingBar;