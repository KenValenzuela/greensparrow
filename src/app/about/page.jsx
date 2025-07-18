import Footer from '@/components/Footer.jsx';

export const metadata = {
  title: 'About – Green Sparrow Tattoo Co.',
  description: 'Meet the founder and story behind our Mesa tattoo studio.',
};

export default function AboutPage() {
  return (
    <>
      <main
        style={{
          backgroundImage:
              "linear-gradient(rgba(30, 26, 23, 0.94), rgba(30, 26, 23, 0.94)), url('/images/background.webp')",
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center top',
          color: '#F1EDE0',
          fontFamily: 'Lora, serif',
          padding: '5rem 2rem',
          lineHeight: 1.8,
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* STUDIO OVERVIEW */}
          <p style={{ marginBottom: '1.5rem' }}>
            Green Sparrow Tattoo Co. opened its doors on <strong>April 1, 2025</strong>, with the mission of creating an inclusive space for artistic self-expression in Mesa, Arizona.
          </p>
          <p style={{ marginBottom: '2rem' }}>
            The studio reflects years of independent growth, community support, and a lifelong dedication to visual art. Every piece created here carries that story forward — grounded in honesty, accessibility, and care.
          </p>

          {/* FOUNDER INTRO */}
          <h2
            style={{
              fontFamily: 'Sancreek, cursive',
              fontSize: '2.25rem',
              color: '#E8B562',
              marginBottom: '1rem',
            }}
          >
            Meet the Founder
          </h2>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              alignItems: 'flex-start',
              marginBottom: '3rem',
            }}
          >
            {/* Text */}
            <div style={{ flex: '1 1 400px', minWidth: '280px' }}>
              <p>
                The founder of Green Sparrow Tattoo Co. has been immersed in the arts since childhood. What began as a part-time job at Sundust Art Gallery — a local paint-and-sip studio — evolved into a lifelong passion for visual expression.
              </p>
              <p>
                Over the years, they developed across multiple mediums including acrylic, charcoal, and clay before discovering tattooing in 2019 through an unexpected apprenticeship opportunity.
              </p>
              <p>
                After working between shops and independently building a client base, they returned to a traditional studio and later stepped out to establish something more personal. Green Sparrow was born from that vision: a space built with the help of family, community, and intention.
              </p>
              <p>
                Today, the shop stands as a reflection of that journey — rooted in grit, shaped by art, and open to all.
              </p>
            </div>

            {/* Image */}
            <div style={{
              flex: '1 1 280px',
              maxWidth: '400px',
              height: '100%',
            }}>
              <img
                  src="/images/owner_outside_shop.webp"
                alt="Green Sparrow founder outside the shop"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '520px', // ensures height matches text on desktop
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              />
            </div>
          </div>

          {/* MISSION */}
          <h2
            style={{
              fontFamily: 'Sancreek, cursive',
              fontSize: '2.25rem',
              color: '#E8B562',
              marginBottom: '1rem',
            }}
          >
            Our Mission
          </h2>

          <p style={{ marginBottom: '2rem' }}>
            At Green Sparrow, our mission is to provide high-quality, custom tattoo artistry at fair and transparent prices. We are committed to creating a safe, inclusive, and welcoming space where everyone can express themselves through art.
          </p>
          <p style={{ marginBottom: '3rem' }}>
            Our goal is to ensure each client feels respected, comfortable, and confident in their tattoo journey — from design to aftercare.
          </p>

          {/* CORE VALUES */}
          <h2
            style={{
              fontFamily: 'Sancreek, cursive',
              fontSize: '2.25rem',
              color: '#E8B562',
              marginBottom: '1rem',
            }}
          >
            What We Stand For
          </h2>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            <div style={{ flex: '1 1 300px' }}>
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Respect & Inclusivity
              </h3>
              <p>
                Green Sparrow Tattoo Co. is an inclusive space welcoming individuals from all walks of life. We're committed to maintaining an environment where everyone feels comfortable, respected, and accommodated.
              </p>
            </div>

            <div style={{ flex: '1 1 300px' }}>
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Honesty & Integrity
              </h3>
              <p>
                We are transparent about the tattoo process, pricing, and any questions you may have. There are no hidden fees or surprises here — just clarity, trust, and professionalism.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
