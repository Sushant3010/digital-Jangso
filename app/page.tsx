"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { myItems as initialItems, LibraryItem } from './data';
import LoginGate from './LoginGate'; // Import your new file

// --- DATABASE CONFIG ---
const SUPABASE_URL = 'https://xtdonsoyceshoqphvipt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ncal4Gq8D7e2jgQQNFHvGw_0ji8deji';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const categoryLogos: Record<string, string> = {
    "To Cook": "https://api.deepai.org/job-view-file/42992a44-6ba7-45e8-91a3-8bf7560d44e9/outputs/output.jpg",
    "To Watch": "https://api.deepai.org/job-view-file/22b21d47-2b04-4901-bd57-31b3511f8f7e/outputs/output.jpg",
    "To Visit": "https://api.deepai.org/job-view-file/c92a74f2-b43a-42d5-a3eb-3d5291248c27/outputs/output.jpg",
    "To Read": "https://api.deepai.org/job-view-file/8a0a9916-26a7-4806-99db-bef2cdcbb839/outputs/output.jpg",
    "To Listen": "https://api.deepai.org/job-view-file/e2a2edc7-1909-48b6-924a-cf236c20ca9d/outputs/output.jpg",
    "Default": "PASTE_A_GENERAL_LOGO_LINK_HERE"
};

export default function Home() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [filter, setFilter] = useState('All');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEvening, setIsEvening] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [hearts, setHearts] = useState<{ id: number, x: number, y: number, r: number }[]>([]);

    const [newItem, setNewItem] = useState({
        title: '',
        category: 'To Watch' as LibraryItem['category'],
        link: '',
        imageUrl: '',
        note: ''
    });

    // Handle initial lock state and Evening Mode
    useEffect(() => {
        const unlocked = sessionStorage.getItem('jangso_unlocked') === 'true';
        setIsUnlocked(unlocked);

        const hour = new Date().getHours();
        if (hour >= 19 || hour <= 7) setIsEvening(true);

        if (unlocked) fetchItems();
    }, []);

    const fetchItems = async () => {
        const { data } = await supabase
            .from('library_items')
            .select('*')
            .order('created_at', { ascending: false });

        const dbItems = data ? data.map(i => ({ ...i, imageUrl: i.image_url })) : [];

        // MERGE: Put DB items first, followed by your hardcoded initialItems
        setItems([...dbItems, ...initialItems]);
    };

    const handleUnlock = () => {
        setIsUnlocked(true);
        sessionStorage.setItem('jangso_unlocked', 'true');
        fetchItems();
    };

    const triggerHearts = () => {
        const newHearts = Array.from({ length: 15 }).map((_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 2 - 1,
            y: Math.random() * -2,
            r: Math.random() * 90 - 45
        }));
        setHearts(newHearts);
        setTimeout(() => setHearts([]), 1000);
    };

    const addItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data } = await supabase.from('library_items').insert([{
            title: newItem.title,
            category: newItem.category,
            link: newItem.link,
            image_url: newItem.imageUrl,
            note: newItem.note
        }]).select();

        if (data) {
            const addedItem = { ...data[0], imageUrl: data[0].image_url };
            // Update state by keeping the previous items (which includes initialItems)
            setItems(prevItems => [addedItem, ...prevItems]);

            triggerHearts();
            setTimeout(() => setIsFormOpen(false), 400);
            setNewItem({ title: '', category: 'To Watch', link: '', imageUrl: '', note: '' });
        }
    };

    const deleteItem = async (e: React.MouseEvent, id: number) => {
        e.preventDefault(); e.stopPropagation();
        const { error } = await supabase.from('library_items').delete().eq('id', id);
        if (!error) setItems(items.filter(item => item.id !== id));
    };

    // --- RENDER LOGIC ---
    if (!isUnlocked) {
        return <LoginGate onUnlock={handleUnlock} />;
    }

    const categories = ['All', 'To Cook', 'To Watch', 'To Visit', 'To Read', 'To Listen'];
    const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

    return (
        <main className={`min-h-screen p-6 md:p-12 lg:p-24 film-grain transition-colors duration-1000 ${isEvening ? 'bg-[#2b2118] text-[#f4eee0]' : 'bg-[#f4eee0] text-[#2b2118]'}`}>

            {/* Hearts Particles */}
            {hearts.map(heart => (
                <span key={heart.id} className="heart-particle" style={{ left: '50%', top: '50%', '--x': heart.x, '--y': heart.y, '--r': `${heart.r}deg` } as any}>♥</span>
            ))}

            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-end border-b border-current pb-8 mb-12">
                    <div className="cursor-pointer select-none" onClick={() => {
                        setClickCount(prev => prev + 1);
                        if (clickCount + 1 === 3) { setShowSecret(true); setClickCount(0); }
                    }}>
                        <h1 className="text-6xl font-serif italic tracking-tighter">Nayan's Jangso</h1>
                        <p className="text-[10px] uppercase tracking-widest opacity-50 mt-2">Personal Collection • Vol. 01</p>
                    </div>
                    <button onClick={() => setIsFormOpen(!isFormOpen)} className="border border-current px-8 py-3 rounded-full text-[10px] uppercase font-bold hover:bg-current hover:text-white transition-all">
                        {isFormOpen ? 'Close Form' : 'New Entry +'}
                    </button>
                </header>

                {isFormOpen && (
                    <section className={`mb-16 p-8 md:p-12 border border-current rounded-xl animate-in slide-in-from-top duration-500 ${isEvening ? 'bg-[#3d3126]' : 'bg-[#fffcf2]'}`}>
                        <form onSubmit={addItem} className="grid gap-8">
                            <input placeholder="Title..." className="w-full bg-transparent border-b border-current py-2 outline-none font-serif text-xl italic" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} required />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <select className="bg-transparent border-b border-current py-2 outline-none" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value as any })}>
                                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                                </select>
                                <input placeholder="Link URL" className="bg-transparent border-b border-current py-2 outline-none" value={newItem.link} onChange={e => setNewItem({ ...newItem, link: e.target.value })} />
                            </div>
                            <input placeholder="Image URL" className="w-full bg-transparent border-b border-current py-2 outline-none" value={newItem.imageUrl} onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })} />
                            <textarea placeholder="Note..." className="w-full bg-transparent border-b border-current py-2 h-24 outline-none italic resize-none" value={newItem.note} onChange={e => setNewItem({ ...newItem, note: e.target.value })} />
                            <button type="submit" className={`py-5 font-bold uppercase tracking-[0.2em] text-[10px] transition-all ${isEvening ? 'bg-[#f4eee0] text-[#2b2118]' : 'bg-[#2b2118] text-[#f4eee0]'}`}>
                                Archive Entry
                            </button>
                        </form>
                    </section>
                )}

                <nav className="flex gap-8 mb-16 overflow-x-auto pb-4 no-scrollbar border-b border-current/5">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setFilter(cat)} className={`text-[10px] font-bold tracking-widest uppercase pb-1 border-b-2 transition-all ${filter === cat ? 'border-current' : 'border-transparent opacity-40'}`}>
                            {cat}
                        </button>
                    ))}
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="group relative">
                            <a href={item.link} target="_blank">
                                <div className={`relative aspect-[3/4] border-[12px] shadow-xl mb-6 overflow-hidden transition-all duration-700 ${isEvening ? 'border-[#3d3126]' : 'border-white'}`}>
                                    <img
                                        // 1. Uses her provided image URL
                                        // 2. Fallback: Uses the specific logo for the category you defined above
                                        // 3. Final Fallback: Uses a default logo if the category isn't found
                                        src={item.imageUrl || categoryLogos[item.category] || categoryLogos["Default"]}
                                        className="w-full h-full object-cover sepia-[15%] group-hover:sepia-0 transition-transform duration-1000 group-hover:scale-105"
                                        alt={item.title}
                                        onError={(e) => {
                                            // If the link is broken, it replaces it with the category logo
                                            const target = e.target as HTMLImageElement;
                                            target.src = categoryLogos[item.category] || categoryLogos["Default"];
                                        }}
                                    />
                                    <button onClick={(e) => deleteItem(e, item.id)} className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-10">✕</button>
                                </div>
                                <h3 className="text-2xl font-serif italic mb-2 leading-tight">{item.title}</h3>
                                <p className="text-sm italic opacity-60">"{item.note}"</p>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {showSecret && (
                <div className="fixed inset-0 z-[10000] bg-[#f4eee0] text-[#2b2118] flex flex-col items-center justify-center p-10 animate-in fade-in duration-1000">
                    <button onClick={() => setShowSecret(false)} className="absolute top-10 right-10 font-serif italic text-xl">Close [x]</button>
                    <p className="font-serif text-3xl italic opacity-80 text-center max-w-md">"I built this space because I never want to forget the things that make you smile."</p>
                </div>
            )}
        </main>
    );
}