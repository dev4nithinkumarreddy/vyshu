import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Star, 
  X, 
  Gift, 
  Camera, 
  Smile, 
  PartyPopper, 
  Disc, 
  Award, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Compass,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { 
  FRIEND_NAME, 
  PET_NAME, 
  SIGN_OFF, 
  PHOTOS, 
  GROUP_PHOTO, 
  FRIENDSHIP_SNAPSHOTS,
  FRIENDSHIP_HIGHLIGHTS, 
  BIRTHDAY_WISH 
} from './constants/content';

// =========================================================================
// 3D TILT CARD COMPONENT
// Spring-physics interactive card that tilts in 3D based on mouse/touch
// =========================================================================
const TiltCard3D = ({ photo, onSelect }) => {
  const cardRef = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={() => onSelect(photo)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="relative perspective-1000 cursor-pointer group rounded-3xl p-3 bg-white/70 backdrop-blur-md border border-white/80 shadow-3d-soft hover:shadow-3d-elevated transition-shadow duration-500"
    >
      {/* 3D Depth Card Inner Container */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-stone-900"
        style={{ aspectRatio: photo.aspect, transformStyle: 'preserve-3d' }}
      >
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          loading="lazy"
        />

        {/* Dynamic 3D Glare Highlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300 mix-blend-overlay"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%)`
            ),
          }}
        />

        {/* Ambient Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

        {/* Floating 3D Badge on Top */}
        <div 
          className="absolute top-4 left-4 z-20"
          style={{ transform: 'translateZ(25px)' }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 text-emerald-800 backdrop-blur-md shadow-sm border border-white/40">
            <Sparkles size={12} className="text-amber-500" />
            {photo.tag}
          </span>
        </div>

        {/* Floating 3D Caption Bottom */}
        <div 
          className="absolute bottom-4 left-4 right-4 z-20 text-white"
          style={{ transform: 'translateZ(30px)' }}
        >
          <h4 className="text-lg font-bold drop-shadow-md text-white/95">
            {photo.title}
          </h4>
          <p className="text-xs text-stone-200/90 font-light drop-shadow-sm mt-0.5">
            {photo.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// =========================================================================
// INTERACTIVE SPARKLE TRAIL
// =========================================================================
const SparkleTrail = () => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    let timeout;
    const handleMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX === undefined || clientY === undefined) return;

      const newSparkle = { id: Date.now() + Math.random(), x: clientX, y: clientY };
      setTrail((prev) => [...prev.slice(-12), newSparkle]);

      setTimeout(() => {
        setTrail((prev) => prev.filter((p) => p.id !== newSparkle.id));
      }, 700);
    };

    const throttled = (e) => {
      if (timeout) return;
      timeout = setTimeout(() => {
        handleMove(e);
        timeout = null;
      }, 40);
    };

    window.addEventListener('pointermove', throttled);
    return () => window.removeEventListener('pointermove', throttled);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      <AnimatePresence>
        {trail.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 1.3, rotate: 90 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute w-3 h-3 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
            style={{ left: sparkle.x - 6, top: sparkle.y - 6 }}
          >
            <Star size={12} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// =========================================================================
// CINEMATIC OPENING SCREEN
// =========================================================================
const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    // Stage 1: Fireworks blast
    const fireworkTimer = setTimeout(() => {
      const origin = { x: 0.5, y: 0.35 };
      confetti({
        particleCount: 120,
        spread: 360,
        startVelocity: 45,
        origin,
        colors: ['#34d399', '#f59e0b', '#fbbf24', '#60a5fa', '#ffffff'],
        ticks: 130,
        gravity: 0.8,
        scalar: 1.1,
        zIndex: 300,
      });

      confetti({
        particleCount: 80,
        spread: 360,
        startVelocity: 65,
        origin,
        colors: ['#fef08a', '#ffffff', '#10b981'],
        ticks: 150,
        gravity: 1.0,
        scalar: 0.7,
        zIndex: 300,
      });
    }, 900);

    // Stage 2: Finish and fade
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(fireworkTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: 'easeInOut' } }}
    >
      {/* Background Starry Mesh */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:32px_32px]" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center px-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-dashed border-amber-400/80 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
        >
          <Sparkles size={28} />
        </motion.div>

        <h2 className="text-3xl md:text-5xl font-cursive font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-200 to-emerald-200">
          Celebrating Vyshu ✨
        </h2>
        <p className="text-sm md:text-base text-stone-300 tracking-[0.25em] uppercase font-light mt-3">
          Preparing Something Special...
        </p>
      </motion.div>
    </motion.div>
  );
};

// =========================================================================
// HERO SECTION WITH 3D DEPTH
// =========================================================================
const Hero3D = ({ onScrollToWish, onScrollToGallery }) => {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 0.35], [0, 40]);

  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] flex flex-col items-center justify-center pt-8 pb-10 sm:py-16 px-4 overflow-hidden bg-gradient-to-b from-botanical-100/60 via-warm-cream to-white">
      {/* Subtle Botanical Ambient Glows */}
      <div className="absolute top-12 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-16 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <motion.div
        style={{ y: yParallax }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, type: 'spring', bounce: 0.3 }}
        className="relative z-10 w-full max-w-4xl mx-auto text-center py-8 sm:py-14 px-4 sm:px-8 md:px-14 rounded-3xl sm:rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white/90 shadow-3d-soft"
      >
        {/* Floating VIP Nickname Pill */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-sm mb-4 sm:mb-6"
        >
          <Award size={14} className="text-amber-500 sm:w-4 sm:h-4" />
          <span className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase">
            Official Birthday Edition: <span className="text-emerald-700 font-bold underline decoration-amber-400 decoration-2">{PET_NAME}</span>
          </span>
          <Sparkles size={14} className="text-amber-500 sm:w-4 sm:h-4" />
        </motion.div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-cursive font-bold text-slate-800 leading-[1.1] sm:leading-tight drop-shadow-sm">
          Happy Birthday, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 animate-gradient-x">
            {FRIEND_NAME}!
          </span>
        </h1>

        <p className="mt-3 sm:mt-6 text-sm sm:text-xl md:text-2xl text-slate-600 font-sans font-light max-w-2xl mx-auto leading-relaxed px-2">
          To my favorite bignose gundu, laugh-sharing, awesome friend — today is all about celebrating you! 🌿✨
        </p>

        {/* Quick Action Buttons */}
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
          <motion.button
            onClick={onScrollToGallery}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-slate-900 text-white font-medium shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Camera size={16} className="text-amber-400 sm:w-[18px] sm:h-[18px]" />
            Explore 3D Snapshots
          </motion.button>

          <motion.button
            onClick={onScrollToWish}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-emerald-600 text-white font-medium shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Gift size={16} className="text-amber-300 sm:w-[18px] sm:h-[18px]" />
            Open Birthday Wish 🎁
          </motion.button>
        </div>
      </motion.div>

      {/* Decorative Floating 3D Elements */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute top-20 right-16 hidden lg:block opacity-60 text-emerald-600"
      >
        <Compass size={56} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 14, 0], rotate: [5, -5, 5] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        className="absolute bottom-24 left-16 hidden lg:block opacity-60 text-amber-500"
      >
        <PartyPopper size={52} />
      </motion.div>
    </section>
  );
};

// =========================================================================
// 3D SPATIAL PHOTO SHOWCASE (REPLACES OLD TIMELINE)
// =========================================================================
const SpatialGallery3D = ({ onSelectPhoto }) => {
  return (
    <section id="gallery-section" className="py-10 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto relative">
      <div className="text-center mb-8 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] sm:text-xs uppercase tracking-widest font-semibold mb-3 sm:mb-4"
        >
          <Camera size={13} />
          Interactive 3D Perspective
        </motion.div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-cursive font-bold text-slate-800 drop-shadow-sm">
          Snapshots & Serenity ✨
        </h2>
        <p className="text-slate-500 font-sans text-xs sm:text-base mt-2 max-w-lg mx-auto px-2">
          Hover or touch the cards to experience real-time 3D tilt. Tap any memory to expand into full view.
        </p>
      </div>

      {/* 3D Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {PHOTOS.map((photo) => (
          <TiltCard3D key={photo.id} photo={photo} onSelect={onSelectPhoto} />
        ))}
      </div>
    </section>
  );
};

// =========================================================================
// FRIENDSHIP BENTO & GUNDU CHRONICLES (FEAT. GROUP SELFIE)
// =========================================================================
const FriendshipBento = ({ onSelectPhoto }) => {
  const [activeSnapshotIdx, setActiveSnapshotIdx] = useState(0);
  const currentSnapshot = FRIENDSHIP_SNAPSHOTS[activeSnapshotIdx];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveSnapshotIdx((prev) => (prev === 0 ? FRIENDSHIP_SNAPSHOTS.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveSnapshotIdx((prev) => (prev === FRIENDSHIP_SNAPSHOTS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-10 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto relative">
      <div className="text-center mb-8 sm:mb-14">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
          The Friendship Dossier
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-cursive font-bold text-slate-800 mt-3 sm:mt-4">
          The "{PET_NAME}" Chronicles 📖
        </h2>
        <p className="text-slate-500 text-xs sm:text-base mt-2 px-2">
          Documenting the true highlights of having you as an awesome friend.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
        {/* Large Featured Card: The Squad / VIP Friendship Snapshot Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-7 md:p-8 border border-white shadow-3d-soft hover:shadow-3d-elevated transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
                  <Sparkles size={13} className="text-amber-600" />
                  {currentSnapshot.badge}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {activeSnapshotIdx + 1} of {FRIENDSHIP_SNAPSHOTS.length}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Click photo to enlarge</span>
            </div>

            <div
              className="overflow-hidden rounded-2xl relative shadow-inner bg-stone-950 aspect-[4/3] sm:aspect-[16/9] cursor-pointer group/photo select-none"
              onClick={() => onSelectPhoto(currentSnapshot)}
            >
              {/* Blurred backdrop glow for portrait and landscape seamless display */}
              <img
                key={`bg-${currentSnapshot.id}`}
                src={currentSnapshot.url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none transition-opacity duration-500"
              />

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSnapshot.id}
                  src={currentSnapshot.url}
                  alt={currentSnapshot.title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full object-contain transition-transform duration-700 group-hover/photo:scale-[1.03]"
                />
              </AnimatePresence>

              {/* Gradient scrim with text overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/80 text-white">
                    {currentSnapshot.tag}
                  </span>
                </div>
                <span className="text-lg sm:text-xl font-bold block">{currentSnapshot.title}</span>
                <p className="text-xs sm:text-sm text-stone-200 font-light mt-0.5">
                  {currentSnapshot.subtitle}
                </p>
              </div>

              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous snapshot"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-lg z-10"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next snapshot"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-lg z-10"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Interactive Thumbnail Previews */}
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {FRIENDSHIP_SNAPSHOTS.map((snap, idx) => (
                <button
                  key={snap.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSnapshotIdx(idx);
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all group/thumb ${
                    activeSnapshotIdx === idx
                      ? 'border-emerald-600 ring-2 ring-emerald-400/50 shadow-md scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-400 opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={snap.url} alt={snap.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 right-1 text-[10px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                  <span className="absolute bottom-1 left-1 text-[9px] font-medium text-white truncate max-w-[65%] hidden sm:inline px-1">
                    {snap.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-600">
            <span className="flex items-center gap-2 text-emerald-700 font-medium">
              <CheckCircle2 size={16} /> Authentic laughter certified
            </span>
            <span className="text-slate-400">Squad approved • 3 snapshots</span>
          </div>
        </motion.div>

        {/* Highlight Stats Bento Grid */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 sm:gap-4">
          {FRIENDSHIP_HIGHLIGHTS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-bold text-emerald-700 font-sans block mb-1">
                  {item.stat}
                </span>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-3">
                  {item.statLabel}
                </span>
                <h4 className="text-sm font-bold text-slate-800 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =========================================================================
// 3D INTERACTIVE BIRTHDAY GIFT BOX WISH (THE SURPRISE METHOD)
// =========================================================================
const GiftBoxWish3D = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGift = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Blast celebratory confetti cannons from both sides
    setTimeout(() => {
      const end = Date.now() + 3.5 * 1000;
      const frame = () => {
        confetti({
          particleCount: 12,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.8 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#fde047'],
        });
        confetti({
          particleCount: 12,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.8 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#fde047'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }, 600);
  };

  return (
    <section id="wish-section" className="py-10 sm:py-20 px-4 sm:px-8 bg-gradient-to-t from-emerald-100/50 via-warm-cream to-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
          Birthday Delivery
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-cursive font-bold text-slate-800 mt-3 sm:mt-4 leading-tight">
          A Special Surprise for {PET_NAME} 🎁
        </h2>
        <p className="text-slate-500 text-xs sm:text-base mt-2 px-2">
          {isOpen ? "Your wish scroll is unlocked!" : "Tap the 3D gift box to unwrap your birthday wish."}
        </p>
      </div>

      {/* 3D Gift Stage */}
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {!isOpen ? (
          /* UNOPENED 3D GIFT BOX */
          <motion.div
            onClick={handleOpenGift}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer perspective-1000 flex flex-col items-center group py-4 sm:py-8"
          >
            {/* 3D Gift Box Structure */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 preserve-3d">
              {/* Box Glow */}
              <div className="absolute inset-0 bg-amber-300/40 rounded-full blur-2xl group-hover:bg-amber-300/60 transition-colors" />

              {/* Box Body */}
              <div className="absolute bottom-0 w-full h-40 sm:h-48 bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-600 rounded-3xl shadow-3d-elevated border-2 border-emerald-400/40 flex items-center justify-center">
                {/* Golden Ribbon Vertical */}
                <div className="absolute top-0 bottom-0 w-8 sm:w-10 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-sm" />
                {/* Golden Ribbon Horizontal */}
                <div className="absolute left-0 right-0 h-8 sm:h-10 bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 shadow-sm" />

                <div className="z-10 text-white font-semibold text-center px-4">
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-100 block mb-0.5 sm:mb-1">
                    Special Delivery
                  </span>
                  <p className="text-sm sm:text-base font-bold text-amber-100">
                    To: {FRIEND_NAME} ({PET_NAME})
                  </p>
                </div>
              </div>

              {/* Box Lid */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute top-6 sm:top-8 -left-2 -right-2 h-14 sm:h-16 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl shadow-lg border border-emerald-300/50 flex items-center justify-center z-20"
              >
                {/* Ribbon across lid */}
                <div className="absolute top-0 bottom-0 w-8 sm:w-10 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
                
                {/* Bow on Top */}
                <div className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-10 h-8 sm:w-12 sm:h-10 bg-amber-400 rounded-full border-2 border-amber-300 shadow-md rotate-[-25deg]" />
                  <div className="w-10 h-8 sm:w-12 sm:h-10 bg-amber-400 rounded-full border-2 border-amber-300 shadow-md rotate-[25deg] -ml-5 sm:-ml-6" />
                  <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-amber-300 rounded-full shadow-inner border border-amber-400" />
                </div>
              </motion.div>
            </div>

            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-5 sm:mt-6 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-md flex items-center gap-2 group-hover:bg-emerald-700 transition-colors"
            >
              <Sparkles size={14} className="text-amber-400 sm:w-4 sm:h-4" />
              Tap to Unwrap
            </motion.div>
          </motion.div>
        ) : (
          /* UNLOCKED BIRTHDAY SCROLL REVEAL */
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
            className="w-full bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 shadow-3d-elevated border border-emerald-100 text-left relative"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100 mb-5 sm:mb-8">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  🎉
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                    {BIRTHDAY_WISH.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {BIRTHDAY_WISH.greeting}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                title="Wrap gift again"
                className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <RotateCcw size={12} />
                Rewrap
              </button>
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 sm:space-y-5 text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed font-sans font-light">
              {BIRTHDAY_WISH.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Closing & Sign-off */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <span className="text-emerald-700 font-medium text-sm sm:text-base">
                {BIRTHDAY_WISH.closing}
              </span>
              <div className="text-left sm:text-right">
                <span className="font-cursive text-2xl sm:text-4xl text-amber-700 font-bold block drop-shadow-sm">
                  {BIRTHDAY_WISH.signOff} ✌️
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// =========================================================================
// LIGHTBOX MODAL (FOR HIGH-RES INSPECTION)
// =========================================================================
const LightboxModal = ({ photo, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-md transition-colors"
        >
          <X size={24} />
        </button>

        <motion.div
          className="max-w-4xl max-h-[85vh] bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-auto max-h-[72vh] object-contain bg-black"
          />
          <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{photo.title}</h3>
              <p className="text-xs text-stone-300 font-light">{photo.subtitle}</p>
            </div>
            {photo.tag && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                {photo.tag}
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// =========================================================================
// FLOATING AMBIENCE / MUSIC PLAYER (WIRED TO music.mp3)
// =========================================================================
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Autoplay attempt
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Expected browser autoplay block, wait for first click
      });

    const handleFirstInteraction = () => {
      if (!hasInteracted.current && audio.paused) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            hasInteracted.current = true;
          })
          .catch(() => {});
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    hasInteracted.current = true;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      <audio ref={audioRef} src={`${import.meta.env.BASE_URL}music.mp3`} loop autoPlay />
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        title={isPlaying ? "Pause music" : "Play music"}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-3d-elevated backdrop-blur-md transition-all ${
          isPlaying
            ? 'bg-emerald-600 text-white shadow-emerald-500/30'
            : 'bg-white/90 text-slate-700 border border-slate-200 shadow-sm'
        }`}
      >
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
        >
          <Disc size={22} className="sm:w-[26px] sm:h-[26px]" />
        </motion.div>

        {isPlaying && (
          <motion.div
            className="absolute -top-1.5 -left-1.5 text-amber-500 font-bold text-xs sm:text-base"
            animate={{ y: [-4, -16], opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          >
            ♪
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

// =========================================================================
// FOOTER
// =========================================================================
const Footer = () => (
  <footer className="py-8 sm:py-12 text-center bg-slate-900 text-slate-300">
    <div className="max-w-md mx-auto px-4">
      <p className="text-sm sm:text-base font-sans font-light flex items-center justify-center gap-2">
        Crafted with <Star size={15} className="text-amber-400" fill="currentColor" /> {SIGN_OFF}
      </p>
      <span className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-widest block mt-2">
        Dedicated to {FRIEND_NAME} ({PET_NAME}) • {new Date().getFullYear()}
      </span>
    </div>
  </footer>
);

// =========================================================================
// MAIN APP COMPONENT
// =========================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const scrollToWish = () => {
    const el = document.getElementById('wish-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToGallery = () => {
    const el = document.getElementById('gallery-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-stone-50 text-slate-800 selection:bg-amber-200 selection:text-amber-900">
      <SparkleTrail />

      <AnimatePresence>
        {loading && <LoadingScreen key="loading" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className={loading ? "h-screen overflow-hidden" : ""}>
        <Hero3D onScrollToWish={scrollToWish} onScrollToGallery={scrollToGallery} />
        <SpatialGallery3D onSelectPhoto={setSelectedPhoto} />
        <FriendshipBento onSelectPhoto={setSelectedPhoto} />
        <GiftBoxWish3D />
        <Footer />
        <MusicPlayer />
      </div>

      <LightboxModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </main>
  );
}
