import './HazardStrip.css';
import { clsx } from 'clsx';

interface HazardStripProps {
    position?: 'top' | 'bottom';
    className?: string;
}

export function HazardStrip({ position = 'top', className }: HazardStripProps) {
    return (
        <div
            className={clsx('hazard-strip', position, className)}
            aria-hidden="true"
        />
    );
}
