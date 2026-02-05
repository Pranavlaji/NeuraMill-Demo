import './Testimonials.css';

const REVIEWS = [
    {
        id: 'LOG_042',
        client: 'Apex Aerospace',
        role: 'Procurement Lead',
        text: "NeuraMill reduced our prototyping cycle from 3 weeks to 48 hours. The tolerance precision matches our internal Tier-1 requirements.",
        date: '2024-02-12'
    },
    {
        id: 'LOG_043',
        client: 'Kinetic EV',
        role: 'Chassis Engineer',
        text: "Zero tooling negotiation. We upload the STEP file, and the parts arrive. It feels like software deployment but for aluminum.",
        date: '2024-03-08'
    },
    {
        id: 'LOG_044',
        client: 'Orbital Dynamics',
        role: 'CTO',
        text: "The API integration allow us to trigger manufacturing runs directly from our CI/CD pipeline. Unheard of in this industry.",
        date: '2024-04-15'
    }
];

export function Testimonials() {
    return (
        <section className="testimonials-section" id="testimonials">
            <div className="container" style={{ border: 'none', padding: 0 }}>
                <div className="testimonials-header">
                    <h2 className="testimonials-title">Transmission<br />Logs</h2>
                    <span className="font-mono" style={{ opacity: 0.5 }}>// ENCRYPTED_FEEDBACK_CHANNEL</span>
                </div>

                <div className="testimonials-grid">
                    {REVIEWS.map((review) => (
                        <div key={review.id} className="data-card">
                            <div className="card-meta">
                                <span>ID: {review.id}</span>
                                <span>{review.date}</span>
                            </div>
                            <p className="card-quote">"{review.text}"</p>
                            <div className="card-author">
                                {review.client}
                                <span className="card-role">{review.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
