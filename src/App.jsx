// App.jsx — root shell
// Welcome screen (default) → sidebar nav → routes to Book, Track, Admin
// Admin is gated by Supabase Auth (per-staff email/password login).

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Home, Calendar, Search, Lock, Shield } from "lucide-react";
import { supabase } from "./supabase";
import { useShopData } from "./useShopData";
import { formatMoney } from "./currency";
import BookingFlow from "./BookingFlow";
import TrackingView from "./TrackingView";
import AdminPanel from "./AdminPanel";

// ═══════════════════════════════════════════════════════════
// GLOBAL MOTION / ACCENT SYSTEM
// One injected stylesheet: orchestrated welcome reveal, gloss
// sweep (light gliding over fresh film — the PPF signature),
// services marquee, step transitions. Honors reduced motion.
// ═══════════════════════════════════════════════════════════

const ACCENT = "#e10600";

const StyleBlock = () => (
  <style>{`
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: none; }
    }
    @keyframes glossSweep {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    @keyframes marqueeScroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes livePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(225,6,0,0.55); }
      70%      { box-shadow: 0 0 0 7px rgba(225,6,0,0); }
    }
    @keyframes gridDrift {
      from { background-position: 0 0; }
      to   { background-position: 60px 60px; }
    }
    .anim-fadeup { animation: fadeUp .7s cubic-bezier(.2,.7,.2,1) both; }
    .d1 { animation-delay: .05s; } .d2 { animation-delay: .18s; }
    .d3 { animation-delay: .32s; } .d4 { animation-delay: .48s; }
    .d5 { animation-delay: .64s; } .d6 { animation-delay: .8s; }
    .gloss-title {
      background-image: linear-gradient(105deg,
        #ffffff 38%, #ffd7d5 46%, ${ACCENT} 50%, #ffd7d5 54%, #ffffff 62%);
      background-size: 220% auto;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: glossSweep 6s linear infinite;
    }
    .live-dot { animation: livePulse 2.2s ease-out infinite; }
    .grid-drift { animation: gridDrift 14s linear infinite; }
    .marquee-track {
      display: inline-flex;
      white-space: nowrap;
      animation: marqueeScroll 30s linear infinite;
    }
    .step-anim { animation: fadeUp .35s ease both; }
    @media (prefers-reduced-motion: reduce) {
      .anim-fadeup, .gloss-title, .live-dot, .grid-drift,
      .marquee-track, .step-anim { animation: none !important; }
      .gloss-title { color: #fff; background: none; }
    }
  `}</style>
);

// ═══════════════════════════════════════════════════════════
// WELCOME SCREEN
// ═══════════════════════════════════════════════════════════

const WelcomeScreen = ({ settings, packages, onBook, onTrack }) => {
  // Services ticker built from the shop's own menu (stays accurate per shop)
  const marqueeItems = [
    ...(packages || []).map((p) => `${p.brand} ${p.name}`),
    "Live Job Tracking",
    "Online Booking",
    settings?.city ? `${settings.city}` : null,
  ].filter(Boolean);
  const ticker = marqueeItems.length ? [...marqueeItems, ...marqueeItems] : [];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Drifting background grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none grid-drift"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pb-16">
        {/* Eyebrow */}
        <div className="anim-fadeup d1 flex items-center gap-2.5 text-[10px] font-mono text-gray-500 tracking-[0.4em] uppercase mb-8 border border-white/10 px-3 py-1.5">
          <span
            className="live-dot inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: ACCENT }}
          />
          STUDIO OPEN{settings?.city ? ` · ${settings.city}` : ""}
        </div>

        {/* Title with gloss sweep */}
        <h1 className="anim-fadeup d2 gloss-title font-black tracking-tighter text-[clamp(3.5rem,12vw,9rem)] leading-[0.85] text-center mb-3">
          {(settings?.shop_name || "Detailr").toUpperCase()}
        </h1>

        <p className="anim-fadeup d3 text-gray-500 text-xs md:text-sm font-mono tracking-[0.3em] uppercase mb-16 text-center">
          {settings?.tagline || "Paint Protection Film"}
        </p>

        {/* Big CTA */}
        <button
          onClick={onBook}
          className="anim-fadeup d4 group relative bg-white text-black px-12 md:px-16 py-6 md:py-7 text-base md:text-lg font-bold tracking-[0.25em] uppercase hover:bg-gray-200 transition-all flex items-center gap-6"
        >
          <span>Book Now</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          {/* Corner ticks — flash to accent on hover */}
          <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-white transition-colors group-hover:border-[#e10600]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-white transition-colors group-hover:border-[#e10600]" />
          <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-white transition-colors group-hover:border-[#e10600]" />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-white transition-colors group-hover:border-[#e10600]" />
        </button>

        {/* Secondary action */}
        <button
          onClick={onTrack}
          className="anim-fadeup d5 mt-10 text-gray-500 hover:text-white text-xs uppercase tracking-widest border-b border-transparent hover:border-white/40 pb-1 transition-colors flex items-center gap-2"
        >
          <Search size={12} /> Track an existing booking
        </button>
      </div>

      {/* Services marquee */}
      {ticker.length > 0 && (
        <div className="anim-fadeup d6 absolute bottom-0 inset-x-0 border-t border-white/10 py-3 overflow-hidden bg-black/60 backdrop-blur-sm">
          <div className="marquee-track">
            {ticker.map((item, i) => (
              <span
                key={i}
                className="text-[10px] font-mono text-gray-600 tracking-[0.3em] uppercase px-6 flex items-center gap-6"
              >
                {item}
                <span style={{ color: ACCENT }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════

const Sidebar = ({ open, onClose, view, onNavigate, shopName }) => {
  const items = [
    ["home",  "Home",            <Home size={16} />],
    ["book",  "Book Now",        <Calendar size={16} />],
    ["track", "Track My Car",    <Search size={16} />],
    ["admin", "Studio Admin",    <Shield size={16} />],
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-black border-r border-white/10 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="font-black tracking-tighter text-white text-sm">
            {(shopName || "DETAILR").toUpperCase()}
            <span className="text-gray-600 font-normal text-xs tracking-normal ml-1">Menu</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* key remount on open replays the stagger */}
        <nav className="p-3" key={String(open)}>
          {items.map(([key, label, icon], i) => (
            <button
              key={key}
              style={open ? { animationDelay: `${80 + i * 55}ms` } : undefined}
              onClick={() => { onNavigate(key); onClose(); }}
              className={`${open ? "anim-fadeup" : ""} w-full text-left px-4 py-3.5 text-sm uppercase tracking-wider flex items-center gap-3 border-l-2 transition-all ${
                view === key
                  ? "border-white text-white bg-white/5"
                  : "border-transparent text-gray-500 hover:text-white hover:border-white/30 hover:bg-white/[0.03]"
              }`}
            >
              <span className="opacity-70">{icon}</span>
              {label}
              {key === "admin" && <Lock size={11} className="ml-auto opacity-50" />}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 text-[10px] font-mono text-gray-700 tracking-widest">
          DETAILR · v1.0
        </div>
      </aside>
    </>
  );
};

// ═══════════════════════════════════════════════════════════
// ADMIN LOGIN (Supabase Auth)
// ═══════════════════════════════════════════════════════════

const AdminLogin = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !pw) return;
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
    setBusy(false);
    if (error) {
      setError(error.message || "Sign-in failed");
    }
    // On success, the App's auth listener flips to the admin view automatically.
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center px-6">
      <div className="anim-fadeup w-full max-w-md border border-white/10 bg-black p-8 relative">
        <span className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-white" />
        <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-white" />
        <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-white" />

        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 tracking-widest mb-2">
          <Lock size={11} /> STAFF LOGIN
        </div>
        <h2 className="text-2xl text-white font-light mb-1">Studio Admin</h2>
        <p className="text-gray-500 text-sm mb-8">Sign in with your staff account</p>

        <label className="text-[10px] uppercase text-gray-500 tracking-wider font-mono">Email</label>
        <input
          type="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="you@studio.com"
          className="w-full bg-black border-b border-white/20 focus:border-white text-white py-3 text-base focus:outline-none transition-colors mb-5"
        />

        <label className="text-[10px] uppercase text-gray-500 tracking-wider font-mono">Password</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="••••••••"
          className={`w-full bg-black border-b text-white py-3 text-base focus:outline-none transition-colors font-mono tracking-widest ${
            error ? "border-red-500" : "border-white/20 focus:border-white"
          }`}
        />
        {error && (
          <p className="text-red-500 text-xs mt-2 font-mono uppercase tracking-wider">✕ {error}</p>
        )}

        <div className="flex gap-2 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 text-sm uppercase tracking-wider border border-white/20 text-white hover:border-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="flex-1 px-6 py-3 text-sm uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-all font-bold disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  const shop = useShopData();

  const [view, setView] = useState("home"); // home | book | track | admin
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [adminPrompt, setAdminPrompt] = useState(false);

  // Track the Supabase auth session (per-staff login)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess) {
        // Signed in → close the login modal and open admin
        setAdminPrompt(false);
        setView("admin");
      } else {
        // Signed out or session expired → leave admin
        setView((v) => (v === "admin" ? "home" : v));
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Navigation handler — admin requires an authenticated session
  const navigate = (key) => {
    if (key === "admin") {
      if (session) {
        setView("admin");
      } else {
        setAdminPrompt(true);
      }
      return;
    }
    setView(key);
  };

  const lockAdmin = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setView("home");
  };

  // Booking submit — write to bookings table
  const submitBooking = async (form) => {
    const pkg = shop.packages.find((p) => p.id === form.packageId);
    const mult = shop.settings?.size_multipliers?.[form.vehicle.size] || 1;
    const addonsTotal = form.addons.reduce(
      (acc, id) => acc + (shop.addons.find((a) => a.id === id)?.price || 0),
      0
    );
    const total = Math.round((pkg?.base_price || 0) * mult + addonsTotal);

    // Default to first non-final stage as initial status
    const firstStage =
      shop.stages.find((s) => !s.is_final)?.name || shop.stages[0]?.name || "Decontamination";

    const { error } = await supabase.from("bookings").insert({
      customer_name:  form.customer.name,
      customer_phone: form.customer.phone,
      vehicle_make:   form.vehicle.make,
      vehicle_model:  form.vehicle.model,
      vehicle_year:   form.vehicle.year,
      vehicle_reg:    form.vehicle.reg,
      vehicle_size:   form.vehicle.size,
      package_id:     form.packageId,
      panels:         form.panels,
      addons:         form.addons,
      booking_date:   form.date,
      status:         firstStage,
      credits:        pkg?.credits || { wash: 0, towel: 0, shampoo: 0 },
      total_price:    total,
    });

    if (error) {
      alert("Booking failed: " + error.message);
      return;
    }

    alert(
      `Booking confirmed for ${form.vehicle.reg}!\n\n` +
        `Total: ${formatMoney(total, shop.settings?.currency)}\n\n` +
        `Track your car using your registration number.`
    );
    setView("home");
  };

  // Loading state
  if (shop.loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <StyleBlock />
        <div className="flex items-center gap-2.5 text-[10px] font-mono text-gray-500 tracking-widest uppercase">
          <span className="live-dot inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#e10600" }} />
          Connecting to studio…
        </div>
      </div>
    );
  }

  // Error state (DB not migrated yet, or down)
  if (shop.error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-lg border border-red-900/50 bg-red-950/20 p-6">
          <div className="text-[10px] font-mono text-red-500 tracking-widest uppercase mb-2">
            ✕ DATABASE ERROR
          </div>
          <p className="text-white text-sm mb-2">Couldn't load studio data.</p>
          <p className="text-gray-500 text-xs font-mono break-all">{String(shop.error.message || shop.error)}</p>
          <p className="text-gray-500 text-xs mt-3">
            Have you run <span className="text-white font-mono">01_schema_extend.sql</span> in the Supabase SQL Editor?
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <StyleBlock />
      {/* Floating hamburger (shown on all views) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-5 left-5 z-30 p-2.5 bg-black/80 backdrop-blur border border-white/10 hover:border-white/40 text-white transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Home indicator (top right, except on home) */}
      {view !== "home" && (
        <button
          onClick={() => setView("home")}
          className="fixed top-5 right-5 z-30 px-3 py-2 bg-black/80 backdrop-blur border border-white/10 hover:border-white/40 text-white text-[10px] font-mono uppercase tracking-widest transition-colors"
        >
          {(shop.settings?.shop_name || "Detailr").toUpperCase()}
        </button>
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        view={view}
        onNavigate={navigate}
        shopName={shop.settings?.shop_name}
      />

      {adminPrompt && !session && (
        <AdminLogin onCancel={() => setAdminPrompt(false)} />
      )}

      {/* Views */}
      {view === "home" && (
        <WelcomeScreen
          settings={shop.settings}
          packages={shop.packages}
          onBook={() => setView("book")}
          onTrack={() => setView("track")}
        />
      )}
      {view === "book" && (
        <BookingFlow
          shop={shop}
          onSubmit={submitBooking}
        />
      )}
      {view === "track" && (
        <TrackingView
          bookings={shop.bookings}
          packages={shop.packages}
          stages={shop.stages}
        />
      )}
      {view === "admin" && session && (
        <AdminPanel
          shop={shop}
          onLock={lockAdmin}
        />
      )}
    </div>
  );
}
