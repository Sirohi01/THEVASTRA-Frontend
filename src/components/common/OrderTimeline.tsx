"use client";

import { motion } from "framer-motion";
import { Check, Clock, Package, Truck, Home } from "lucide-react";

interface OrderTimelineProps {
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
}

export const OrderTimeline = ({ status }: OrderTimelineProps) => {
  const steps = [
    { name: 'Processing', icon: Clock },
    { name: 'Shipped', icon: Truck },
    { name: 'Delivered', icon: Home },
  ];

  const currentStep = steps.findIndex(step => step.name === status);
  const isCancelled = status === 'Cancelled';

  return (
    <div className="w-full py-12">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-accent -translate-y-1/2 z-0" />
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0"
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.name} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? "#540B0E" : "#FFF8F0",
                  borderColor: isCompleted ? "#540B0E" : "#E2D1C3",
                  scale: isCurrent ? 1.2 : 1
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors`}
              >
                {isCompleted ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <Icon size={18} className="text-secondary" />
                )}
              </motion.div>
              <div className="absolute -bottom-8 whitespace-nowrap">
                <span className={`text-[10px] uppercase tracking-widest font-bold ${isCompleted ? 'text-primary' : 'text-secondary/40'}`}>
                  {step.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {isCancelled && (
        <div className="mt-16 p-4 bg-red-50 border border-red-200 text-red-800 text-center text-xs uppercase tracking-widest font-bold">
          Order Cancelled
        </div>
      )}
    </div>
  );
};
