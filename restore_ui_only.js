const fs = require('fs');
const path = require('path');

console.log("Starting UI-only restoration...");

// --- 1. Footer.jsx ---
let footerJsxPath = "D:\\restaurant\\frontend\\src\\components\\Footer.jsx";
if (fs.existsSync(footerJsxPath)) {
    let fjsx = fs.readFileSync(footerJsxPath, 'utf8');

    // Grid fix
    fjsx = fjsx.replace(
        /gridTemplateColumns:\s*'repeat\(4,\s*1fr\)',[\s]*columnGap:\s*'64px',[\s]*rowGap:\s*'40px',[\s]*paddingBottom:\s*'64px'/,
        "gridTemplateColumns: '1.3fr 1fr 1fr 1.2fr',\n                    columnGap: '32px',\n                    rowGap: '40px',\n                    paddingBottom: '32px'"
    );

    // handleSubscribe
    fjsx = fjsx.replace(
        /const handleSubscribe = \(e\) => \{[\s\S]*?const scrollToTop/m,
`const handleSubscribe = (e) => {
        e.preventDefault();
        if (email && subscribeStatus !== "loading") {
            setSubscribeStatus("loading");
            setTimeout(() => {
                setSubscribeStatus("success");
                setEmail("");
                setTimeout(() => {
                    setSubscribeStatus("");
                }, 5000);
            }, 1200);
        }
    };

    const scrollToTop`
    );

    // Input & Button & Toast removal
    fjsx = fjsx.replace(
        /<input[\s\S]*?id="footer-email-input"[\s\S]*?\/>[\s\S]*?\{subscribeStatus === "success"[\s\S]*?Thanks for subscribing![\s\S]*?<\/div>\s*\}[\s\S]*?<\/div>\s*<button[\s\S]*?type="submit"[\s\S]*?>\s*Subscribe\s*<\/button>/m,
`<input
                                        id="footer-email-input"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email address"
                                        className="footer-newsletter-input w-full h-14 px-6 text-white text-base placeholder:text-stone-500 focus:outline-none transition-all duration-300 bg-transparent"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={subscribeStatus === "loading"}
                                    className="footer-subscribe-btn h-14 px-10 bg-primary text-white font-bold border border-transparent rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(238,124,43,0.5)] flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-wider text-sm disabled:opacity-80 disabled:cursor-not-allowed"
                                >
                                    {subscribeStatus === "loading" ? (
                                        <>
                                            <span className="material-icons animate-spin text-lg">autorenew</span>
                                            <span>Subscribing...</span>
                                        </>
                                    ) : (
                                        <span>Subscribe</span>
                                    )}
                                </button>`
    );

    // Modal insertion
    fjsx = fjsx.replace(
        /<\/button>\s*<\/footer>/,
`</button>

            {/* Premium Success Modal */}
            {subscribeStatus === "success" && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm modal-backdrop-animate"
                    onClick={() => setSubscribeStatus("")}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-sm rounded-[24px] p-8 text-center modal-content-animate"
                        style={{
                            background: '#1A1412',
                            border: '1px solid rgba(238, 124, 43, 0.15)',
                            boxShadow: '0 0 80px rgba(238, 124, 43, 0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
                            fontFamily: '"Outfit", "Plus Jakarta Sans", "Inter", -apple-system, sans-serif'
                        }}
                    >
                        {/* Subtle green glow perfectly centered behind the icon */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-green-500/10 rounded-full blur-[40px] pointer-events-none"></div>

                        {/* Icon */}
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10" style={{ background: 'rgba(34, 197, 94, 0.08)' }}>
                            <span className="material-icons text-3xl" style={{ color: '#22c55e' }}>check_circle</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Subscription Successful</h2>

                        <p className="text-stone-400 text-[15px] mb-8 leading-relaxed max-w-[280px] mx-auto">
                            You're now subscribed to Lumière updates. Get exclusive offers, events, and special menus.
                        </p>

                        <span
                            onClick={() => setSubscribeStatus("")}
                            className="cursor-pointer text-lg font-bold mt-2 inline-block"
                            style={{ color: '#22c55e', transition: 'color 0.2s ease' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                            onMouseLeave={e => e.currentTarget.style.color = '#22c55e'}
                        >
                            Awesome!
                        </span>
                    </div>
                </div>
            )}
        </footer>`
    );
    fs.writeFileSync(footerJsxPath, fjsx, 'utf8');
    console.log("Restored Footer.jsx");
}


// --- 2. Footer.css ---
let footerCssPath = "D:\\restaurant\\frontend\\src\\components\\Footer.css";
if (fs.existsSync(footerCssPath)) {
    let fcss = fs.readFileSync(footerCssPath, 'utf8');
    fcss = fcss.replace(
        /color:\s*white;/,
        "color: white;\n    caret-color: white;"
    );
    fcss = fcss.replace(
        /\/\* Success Message Animation \*\/[\s\S]*?\.footer-subscribe-success\s*\{[\s\S]*?\}/,
`/* Modal Animation */
@keyframes modalScaleFade {
    0% { transform: scale(0.95); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes modalBackdropFade {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

.modal-backdrop-animate {
    animation: modalBackdropFade 0.3s ease-out forwards;
}

.modal-content-animate {
    animation: modalScaleFade 0.3s cubicbezier(0.16, 1, 0.3, 1) forwards;
}`
    );
    fs.writeFileSync(footerCssPath, fcss, 'utf8');
    console.log("Restored Footer.css");
}

// --- 3. Table.jsx ---
let tableJsxPath = "D:\\restaurant\\frontend\\src\\pages\\Table\\Table.jsx";
if (fs.existsSync(tableJsxPath)) {
    let tjsx = fs.readFileSync(tableJsxPath, 'utf8');
    tjsx = tjsx.replace(
        /<h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Book Your Table<\/h1>/,
        `<h1 className="text-5xl font-bold mb-4 tracking-tight -translate-y-[1px]">
                        <span className="text-white">Book Your </span>
                        <span className="text-primary">Table</span>
                    </h1>`
    );
    fs.writeFileSync(tableJsxPath, tjsx, 'utf8');
    console.log("Restored Table.jsx");
}

// --- 4. Home.jsx ---
let homeJsxPath = "D:\\restaurant\\frontend\\src\\pages\\Home\\Home.jsx";
if (fs.existsSync(homeJsxPath)) {
    let hjsx = fs.readFileSync(homeJsxPath, 'utf8');
    hjsx = hjsx.replace(
        /Crafting Memories Since 1984/g,
        'Crafting Memories Since <span className="text-primary">1984</span>'
    );
    fs.writeFileSync(homeJsxPath, hjsx, 'utf8');
    console.log("Restored Home.jsx");
}

console.log("SUCCESS - UI components restored to pre-currency state.");
