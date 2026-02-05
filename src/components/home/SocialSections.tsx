import './SocialSections.css';

const JOBS = [
    { title: 'CAM Software Engineer', loc: 'Remote', type: 'Full-Time' },
    { title: 'Robotics Control Specialist', loc: 'San Francisco', type: 'On-Site' },
    { title: 'Solutions Architect', loc: 'New York', type: 'Hybrid' }
];

export function Careers() {
    return (
        <section className="careers-section" id="careers">
            <div className="container" style={{ border: 'none', padding: '0 1rem' }}>
                <h2 className="pipeline-title" style={{ marginBottom: '2rem' }}>Join The Machine</h2>
                <div className="job-board">
                    {JOBS.map((job) => (
                        <div key={job.title} className="job-row">
                            <span className="job-title">{job.title}</span>
                            <div className="flex gap-4">
                                <span>{job.loc}</span>
                                <span>[{job.type}]</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Contact() {
    return (
        <section className="contact-section container" style={{ borderTop: 'none', borderBottom: 'none' }}>
            <div className="contact-info">
                <h2 className="pipeline-title">Initialize<br />Protocol</h2>
                <p className="hero-sub" style={{ margin: '2rem 0' }}>
                    Ready to automate your production? Transmit your signal.
                </p>
                <div className="font-mono">
                    <p>FREQ: 144.92 MHz</p>
                    <p>LOC: 37.7749° N, 122.4194° W</p>
                </div>
            </div>

            <div className="contact-form-container">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label className="form-label">Signal Source (Name)</label>
                        <input type="text" className="form-input" placeholder="Enter identification..." />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Frequency (Email)</label>
                        <input type="email" className="form-input" placeholder="name@domain.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Payload (Message)</label>
                        <textarea className="form-textarea" placeholder="Describe requirements..." />
                    </div>
                    <button type="submit" className="submit-btn">
                        [ TRANSMIT ]
                    </button>
                </form>
            </div>
        </section>
    );
}
