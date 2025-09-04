// src/app/booking/page.jsx
// Server Component wrapper — imports the client BookingForm
import BookingForm from '@/components/BookingForm'; // if @ alias isn't set, use: ../../components/BookingForm
import styles from './booking.module.css';

export const dynamic = 'force-dynamic';

export default function BookingPage() {
  return (
    <main
        className={styles.main}
      style={{
          backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center top',
        backgroundAttachment: 'scroll',
        color: '#F1EDE0',
        fontFamily: 'Lora, serif',
        minHeight: '100vh',
        padding: '2.5rem 1rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h1
          style={{
            fontFamily: 'Sancreek, cursive',
            fontSize: '3rem',
            margin: 0,
            color: '#E8B562',
          }}
        >
          Book an Appointment
        </h1>
          <p style={{marginTop: '1rem', maxWidth: 600, fontSize: '1rem', lineHeight: 1.6}}>
              Use the form below to request an appointment—we’ll reach out to confirm.
              If you already know who you’d like to work with, feel free to message your preferred artist directly.
        </p>
      </header>

        <section className={styles.section}
                 style={{width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div className={styles.content} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {/* Booking Form */}
          <div
            style={{
              width: '100%',
              backgroundColor: 'rgba(42,42,42,0.95)',
              padding: '1.5rem',
                borderRadius: 10,
              flex: 1,
              boxSizing: 'border-box',
            }}
          >
            <BookingForm />
          </div>

                {/* Embedded Map (non-blocking) */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
                borderRadius: 12,
              overflow: 'hidden',
              flex: 1,
            }}
          >
            <iframe
              title="Green Sparrow Tattoo Co Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.027890899718!2d-111.87509329999999!3d33.422517199999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b09f15e9115fb%3A0x4044232360b464b7!2sGreen%20Sparrow%20Tattoo%20Company!5e0!3m2!1sen!2sus!4v1752110600323!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{
                  maxWidth: 600,
                  minHeight: 420,
                height: '100%',
                border: 0,
                filter: 'grayscale(30%) brightness(95%) contrast(95%)',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
