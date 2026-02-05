import { Upload, Cpu, Cog, Package } from 'lucide-react';
import './ProcessPipeline.css';

const STEPS = [
    {
        id: '01',
        title: 'Upload CAD',
        desc: 'Drag & drop STEP/IGES files. Instant geometric analysis.',
        icon: Upload
    },
    {
        id: '02',
        title: 'AI Analysis',
        desc: 'Engine identifies features, tolerances, and optimal toolpaths.',
        icon: Cpu
    },
    {
        id: '03',
        title: 'Auto-Milling',
        desc: '3-axis and 5-axis machines execute the code autonomously.',
        icon: Cog
    },
    {
        id: '04',
        title: 'Shipment',
        desc: 'Parts are inspected, packed, and shipped within 48h.',
        icon: Package
    }
];

export function ProcessPipeline() {
    return (
        <section className="pipeline-section" id="process">
            <div className="container" style={{ border: 'none', padding: 0 }}>
                <div className="pipeline-header">
                    <h2 className="pipeline-title"> The Assembly Line </h2>
                    <p className="font-mono"> // AUTOMATED_WORKFLOW_SEQUENCE </p>
                </div>

                <div className="pipeline-grid">
                    {STEPS.map((step) => (
                        <div key={step.id} className="process-node">
                            <div className="node-header">
                                <span>STEP {step.id}</span>
                                <span>[ REF: {Math.random().toString(36).substr(2, 4).toUpperCase()} ]</span>
                            </div>
                            <div className="node-icon-container">
                                <step.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="node-title">{step.title}</h3>
                            <p className="node-desc">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
