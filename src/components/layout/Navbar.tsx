import './Navbar.css';
import { ArrowRight } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'How It Works', href: '#process' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Team', href: '#team' },
    { label: 'Contact', href: '#contact' },
    { label: 'Careers', href: '#careers' },
];

export function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo-text">NeuraMill</span>
            </div>

            <nav className="navbar-links">
                {NAV_ITEMS.map((item) => (
                    <a key={item.label} href={item.href} className="nav-link">
                        {item.label}
                    </a>
                ))}
            </nav>

            {/* Empty div to balance the flex container for centering if using space-between, 
          OR we can just let it sit on the right if that's preferred. 
          But centered is better. Let's adjust CSS for true centering. */}
            <button className="nav-cta">
                Book a Demo <ArrowRight size={20} />
            </button>
        </header>
    );
}
