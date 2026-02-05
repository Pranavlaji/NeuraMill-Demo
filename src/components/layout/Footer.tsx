import './Footer.css';
import { HazardStrip } from './HazardStrip';

export function Footer() {
    return (
        <footer className="footer">
            <div className="container" style={{ border: 'none', padding: 0, backgroundColor: 'transparent' }}>
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>NeuraMill</h3>
                        <p className="footer-desc">
                            Defining the future of autonomous manufacturing.
                            The infrastructure for the next industrial revolution.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>System</h4>
                        <ul className="footer-links">
                            <li><a href="#">Platform</a></li>
                            <li><a href="#">Security</a></li>
                            <li><a href="#">Uptime</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><a href="#">About</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Legal</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Connect</h4>
                        <ul className="footer-links">
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">LinkedIn</a></li>
                            <li><a href="#">GitHub</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>&copy; 2024 NeuraMill Inc.</span>
                    <span>SYSTEM_STATUS: NOMINAL</span>
                </div>

                <HazardStrip />
            </div>
        </footer>
    );
}
