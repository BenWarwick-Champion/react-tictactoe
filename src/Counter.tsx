import React, { useState } from 'react';
import { setConstantValue } from 'typescript';

export const Counter = () => {
    const [clicks, setClicks] = useState(0);

    return (
        <div className="counter">
            <p>Clicks: {clicks}</p>
            <button onClick={() => setClicks(clicks + 1)}>Increment</button>
            <button onClick={() => setClicks(clicks - 1)}>Decrement</button>
        </div>
    )
}