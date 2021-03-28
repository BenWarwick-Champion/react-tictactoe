import React, { useState, useEffect } from 'react';

export const TickingClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return function cleanup() {
            clearInterval(timer);
        }
    });

    return (
        <div>
            The time is: {time.toLocaleTimeString()}
        </div>
    );

}
