import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#2d2a26',
      color: '#fff',
      padding: '2rem',
      marginTop: '3rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#d4a574' }}>
            🍵 হৃদয়ের চা ঘর
          </h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6' }}>
            আমরা প্রদান করি সর্বশ্রেষ্ঠ মানের চা ও বিভিন্ন পানীয়। 
            আমাদের দোকানে আপনাকে স্বাগতম!
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>দ্রুত লিংক</h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>
              মেনু
            </Link>
            <Link to="/cart" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>
              কার্ট
            </Link>
            <Link to="/admin/login" style={{ color: '#fff', textDecoration: 'none', opacity: 0.8 }}>
              অ্যাডমিন লগইন
            </Link>
          </nav>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>যোগাযোগ</h4>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.8' }}>
            📍 দোকানের ঠিকানা<br />
            📞 যোগাযোগ নম্বর<br />
            ✉️ ইমেইল
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>খোলার সময়</h4>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.8' }}>
            প্রতিদিন: সকাল ৭টা - রাত ১২টা
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto 0',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        fontSize: '0.85rem',
        opacity: 0.6
      }}>
        © ২০২৬ হৃদয়ের চা ঘর। সর্বস্বত্ব সংরক্ষিত।<br />
        Built for Hot&Cold Lover ☕🧊
      </div>
    </footer>
  )
}