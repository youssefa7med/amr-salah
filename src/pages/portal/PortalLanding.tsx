import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { usePortalSettingsWithShop } from '@/hooks/usePortalSettingsWithShop'

// Global animation styles for all templates
const animationStyles = `
  @keyframes float-particle {
    0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
    25% { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
    50% { transform: translateY(-60px) translateX(-20px); opacity: 0.3; }
    75% { transform: translateY(-30px) translateX(30px); opacity: 0.6; }
  }

  @keyframes slide-in {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes shine {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes diagonal-move {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes glow-pulse {
    0%, 100% { text-shadow: 0 0 10px rgba(212, 175, 55, 0.5); }
    50% { text-shadow: 0 0 20px rgba(212, 175, 55, 0.8); }
  }

  @keyframes sparkle {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  @keyframes scale-up {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .float-particle {
    animation: float-particle 6s ease-in-out infinite;
  }

  .slide-in { animation: slide-in 0.8s ease-out; }
  .glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
  .scale-up { animation: scale-up 0.6s ease-out; }
`

/**
 * Template 1: "الكلاسيك الذهبي" - Luxury Dark
 * Dark background with floating particles, huge gold gradient text, glassmorphism buttons
 */
function Template1({ settings, slug, navigate }: any) {
  return (
    <div
      className="min-h-screen relative overflow-hidden text-white flex items-center justify-center"
      dir="rtl"
      style={{
        backgroundColor: settings.secondary_color || '#0A0F1E',
        background: `radial-gradient(ellipse at center, ${settings.secondary_color || '#0A0F1E'} 0%, #000 100%)`,
      }}
    >
      <style>{animationStyles}</style>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute float-particle"
            style={{
              width: Math.random() * 100 + 50 + 'px',
              height: Math.random() * 100 + 50 + 'px',
              borderRadius: '50%',
              backgroundColor: settings.primary_color,
              opacity: 0.05,
              right: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's',
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 text-center z-10">
        {/* Scissors icon with glow */}
        <div className="mb-8 scale-up">
          <div
            className="text-8xl glow-pulse inline-block"
            style={{ color: settings.primary_color }}
          >
            ✂
          </div>
        </div>

        {/* Shop name with huge gold gradient */}
        <h1
          className="text-6xl md:text-7xl font-bold mb-6 slide-in"
          style={{
            backgroundImage: `linear-gradient(135deg, ${settings.primary_color}, #FFD700)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {settings.shop_name}
        </h1>

        {/* Welcome message */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 slide-in" style={{ animationDelay: '0.2s' }}>
          {settings.welcome_message || 'احجز موعدك الآن'}
        </p>

        {/* Glassmorphism buttons */}
        <div className="grid md:grid-cols-2 gap-6 max-w-md mx-auto" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => navigate(`/shop/${slug}/login`)}
            className="py-4 px-8 rounded-xl backdrop-blur-md border border-white/20 bg-white/10 hover:bg-white/20 transition text-lg font-bold transform hover:scale-105"
          >
            دخول الحساب
          </button>
          <button
            onClick={() => navigate(`/shop/${slug}/register`)}
            className="py-4 px-8 rounded-xl backdrop-blur-md border border-white/20 bg-white/10 hover:bg-white/20 transition text-lg font-bold transform hover:scale-105"
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Template 2: "العصري النظيف" - Clean Modern
 * Split layout with animated gradient border
 */
function Template2({ settings, slug, navigate }: any) {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <style>{animationStyles}</style>
      
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Left Panel - Colored */}
        <div
          className="p-8 md:p-16 flex flex-col justify-center items-center text-white relative border-r-4 slide-in"
          style={{
            background: `linear-gradient(135deg, ${settings.primary_color}, ${settings.secondary_color})`,
            borderColor: settings.accent_color || settings.primary_color,
          }}
        >
          <div className="text-6xl md:text-5xl mb-8">✂</div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {settings.shop_name}
          </h1>
          <p className="text-lg opacity-90 text-center">
            {settings.welcome_message || 'تجربة عصرية وسهلة'}
          </p>
        </div>

        {/* Right Panel - White */}
        <div className="p-8 md:p-16 flex flex-col justify-center items-center">
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: settings.primary_color }}>
              ابدأ الآن
            </h2>
            
            <button
              onClick={() => navigate(`/shop/${slug}/login`)}
              className="w-full mb-4 py-4 px-6 rounded-lg font-bold text-white transition transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: settings.primary_color }}
            >
              دخول الحساب
            </button>
            
            <button
              onClick={() => navigate(`/shop/${slug}/register`)}
              className="w-full py-4 px-6 rounded-lg font-bold transition transform hover:scale-105"
              style={{
                backgroundColor: settings.primary_color + '20',
                color: settings.primary_color,
                border: `2px solid ${settings.primary_color}`,
              }}
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Template 3: "البسيط الأنيق" - Minimal Elegant
 * Pure white background, lots of whitespace, ghost buttons
 */
function Template3({ settings, slug, navigate }: any) {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <style>{animationStyles}</style>
      
      {/* Thin gold line at top */}
      <div className="h-1" style={{ backgroundColor: settings.primary_color }} />

      <div className="max-w-2xl mx-auto px-4 py-24">
        {/* Elegant icon */}
        <div className="text-center mb-16">
          <div className="text-5xl mb-8 scale-up">✂</div>
          
          {/* Shop name in thin elegant font */}
          <h1
            className="text-5xl md:text-6xl font-light mb-4 slide-in"
            style={{ color: settings.primary_color, fontWeight: 300 }}
          >
            {settings.shop_name}
          </h1>
          
          {/* Welcome message */}
          <p className="text-lg text-gray-500 mb-16 font-light">
            {settings.welcome_message || 'احجز موعدك بأناقة'}
          </p>
        </div>

        {/* Floating card with shadow */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 mb-12 border-t-4" style={{ borderColor: settings.primary_color }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate(`/shop/${slug}/login`)}
              className="py-4 px-6 rounded-lg font-light text-lg transition border-2"
              style={{
                borderColor: settings.primary_color,
                color: settings.primary_color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = settings.primary_color
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = settings.primary_color
              }}
            >
              دخول الحساب
            </button>
            
            <button
              onClick={() => navigate(`/shop/${slug}/register`)}
              className="py-4 px-6 rounded-lg font-light text-lg transition border-2"
              style={{
                borderColor: settings.primary_color,
                color: settings.primary_color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = settings.primary_color
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = settings.primary_color
              }}
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>

        {/* Decorative dots pattern at bottom */}
        <div className="flex justify-center gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: settings.primary_color, opacity: 0.5 - i * 0.08 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Template 4: "الجريء" - Bold & Energetic
 * Dark background with diagonal stripe, bold typography, high energy
 */
function Template4({ settings, slug, navigate }: any) {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden flex items-center" dir="rtl">
      <style>{animationStyles}</style>
      
      {/* Large diagonal stripe */}
      <div
        className="absolute inset-0 transform -skew-y-12"
        style={{
          backgroundColor: settings.primary_color,
          left: '-50%',
          right: '-50%',
          width: '200%',
          opacity: 0.9,
        }}
      />

      {/* Corner geometric shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: settings.primary_color }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: settings.secondary_color }} />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Shop name on dark */}
          <div className="text-center md:text-right">
            <div className="text-6xl mb-4 scale-up">✂</div>
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight slide-in">
              {settings.shop_name}
            </h1>
            <p className="text-xl opacity-80 slide-in" style={{ animationDelay: '0.2s' }}>
              {settings.welcome_message || 'التجربة الأفضل'}
            </p>
          </div>

          {/* Right: Buttons on colored stripe */}
          <div className="space-y-4 text-center md:text-left">
            <button
              onClick={() => navigate(`/shop/${slug}/login`)}
              className="w-full block py-4 px-8 bg-white text-black font-bold text-lg rounded-lg transition transform hover:scale-105 hover:shadow-2xl"
              style={{ color: settings.primary_color }}
            >
              دخول الحساب
            </button>
            
            <button
              onClick={() => navigate(`/shop/${slug}/register`)}
              className="w-full block py-4 px-8 border-2 border-white text-white font-bold text-lg rounded-lg transition transform hover:scale-105 hover:bg-white/10"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Template 5: "الفاخر" - Premium Luxury
 * Deep dark with ornamental borders, shimmer animation, rose gold accents
 */
function Template5({ settings, slug, navigate }: any) {
  const roseGold = '#b76e79'
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1a1a2e' }} dir="rtl">
      <style>{animationStyles}</style>

      {/* Subtle sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: roseGold,
              right: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.2,
              animationDuration: (Math.random() * 2 + 2) + 's',
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Ornamental border top */}
        <div className="text-center mb-8 text-3xl" style={{ color: roseGold }}>
          ✦ ✧ ✦
        </div>

        {/* Frosted glass card */}
        <div
          className="rounded-xl backdrop-blur-md border-2 p-12 text-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: roseGold,
            boxShadow: `inset 0 0 30px rgba(183, 110, 121, 0.1), 0 8px 32px rgba(0, 0, 0, 0.3)`,
          }}
        >
          {/* Shimmer text effect for shop name */}
          <div
            style={{
              backgroundImage: `linear-gradient(90deg, ${roseGold}, #FFD700, ${roseGold})`,
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shine 3s linear infinite',
            }}
            className="text-5xl md:text-6xl font-bold mb-2"
          >
            {settings.shop_name}
          </div>

          {/* Decorative ornaments */}
          <div className="text-xl mb-6" style={{ color: roseGold }}>
            ◆ ◇ ◆
          </div>

          {/* Welcome message */}
          <p className="text-gray-300 text-lg mb-10">
            {settings.welcome_message || 'تجربة فاخرة لا مثيل لها'}
          </p>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate(`/shop/${slug}/login`)}
              className="w-full py-4 px-8 rounded-lg font-bold text-lg text-black transition transform hover:scale-105"
              style={{
                backgroundColor: roseGold,
                boxShadow: `0 0 20px rgba(183, 110, 121, 0.5)`,
              }}
            >
              دخول الحساب
            </button>
            
            <button
              onClick={() => navigate(`/shop/${slug}/register`)}
              className="w-full py-4 px-8 rounded-lg font-bold text-lg transition transform hover:scale-105"
              style={{
                borderColor: roseGold,
                color: roseGold,
                border: `2px solid ${roseGold}`,
                backgroundColor: 'rgba(183, 110, 121, 0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(183, 110, 121, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(183, 110, 121, 0.05)'
              }}
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>

        {/* Ornamental border bottom */}
        <div className="text-center mt-8 text-3xl" style={{ color: roseGold }}>
          ✦ ✧ ✦
        </div>
      </div>
    </div>
  )
}

export function PortalLanding() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { settings, loading, error } = usePortalSettingsWithShop(slug)

  // Update browser title
  useEffect(() => {
    if (settings?.shop_name) {
      document.title = `${settings.shop_name} - احجز الآن`
    }
  }, [settings?.shop_name])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gold-400/20 border-t-gold-400 animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (error || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'البوربتال غير موجود'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gold-400 text-black rounded hover:bg-gold-500 transition"
          >
            العودة للرئيسة
          </button>
        </div>
      </div>
    )
  }

  // Check if portal is inactive
  if (settings.is_active === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-3xl text-red-400 font-bold">
            هذا المحل غير متاح حالياً
          </p>
          <p className="text-gray-400 mt-4">يرجى العودة لاحقاً</p>
        </div>
      </div>
    )
  }

  // Render based on template_id
  const templateProps = { settings, slug, navigate }

  switch (settings.template_id) {
    case 1:
      return <Template1 {...templateProps} />
    case 2:
      return <Template2 {...templateProps} />
    case 3:
      return <Template3 {...templateProps} />
    case 4:
      return <Template4 {...templateProps} />
    case 5:
      return <Template5 {...templateProps} />
    default:
      return <Template1 {...templateProps} />
  }
}
