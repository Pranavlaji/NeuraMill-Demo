import './Hero.css';
import { ArrowRight } from 'lucide-react';

export function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-frame">
                <div className="hero-grid">
                    <div className="hero-text-content">
                        <h1 className="hero-headline">
                            Design <br /> to cut <br /> 10x Faster
                        </h1>
                        <p className="hero-sub">
                            From CAD to the machine in minutes, not days. AI-powered CAM that captures your machinists' tribal knowledge and makes it repeatable.
                        </p>
                        <button className="hero-cta">
                            Book a Demo <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="hero-visual">
                        <img
                            src="/arm2.webp"
                            alt="Robotic Manufacturing Arm"
                            className="hero-image"
                        />
                    </div>
                </div>

                {/* Trusted By Grid */}
                <div className="trusted-by-section">
                    <div className="logo-grid">
                        <div className="logo-item"><span>Ascend</span></div>
                        <div className="logo-item"><span>Breakwater</span></div>
                        <div className="logo-item logo-text-block">
                            Trusted by world-class<br />engineering teams
                        </div>
                        <div className="logo-item"><span>Schema Ventures</span></div>
                        <div className="logo-item"><span>Creative Destruction Labs</span></div>

                        {/* Hazard Corners */}
                        <div className="logo-item hazard-filler"></div>
                        <div className="logo-item hazard-filler"></div>
                        <div className="logo-item hazard-filler"></div>
                        <div className="logo-item hazard-filler"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
