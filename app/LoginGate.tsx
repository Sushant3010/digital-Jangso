"use client";
import { useState } from 'react';

export default function LoginGate({ onUnlock }: { onUnlock: () => void }) {
    const [passcode, setPasscode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // This handles "January2024", "january2024", etc.
        if (passcode.toLowerCase() === "january2024") {
            sessionStorage.setItem('jangso_unlocked', 'true');
            // Call the unlock function immediately
            onUnlock();
        } else {
            alert("That's not the secret key, love.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f4eee0] flex items-center justify-center p-6 film-grain">
            <div className="max-w-md w-full text-center">
                <div className="border-2 border-[#2b2118] p-12 bg-[#fffcf2] shadow-2xl relative transform rotate-1">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#2b2118] text-[#f4eee0] px-6 py-1 text-[10px] uppercase tracking-[0.3em] font-bold">
                        Private Correspondence
                    </div>
                    <h2 className="font-serif italic text-3xl mb-8">To the Curator</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="password"
                            placeholder="The Secret Phrase..."
                            className="w-full bg-transparent border-b border-[#2b2118] p-2 outline-none text-center italic"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            required
                        />
                        <button className="w-full bg-[#2b2118] text-[#f4eee0] py-4 uppercase text-[10px] font-bold tracking-[0.4em]">
                            Open the Archive
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}