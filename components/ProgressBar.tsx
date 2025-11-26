'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gukbap-brown">
          {current} / {total}
        </span>
        <span className="text-sm font-medium text-gukbap-brown">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-3 bg-gukbap-cream rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gukbap-red to-gukbap-lightRed rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
