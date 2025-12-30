'use client';

interface ProgressBarProps {
  currentStep: 'cart' | 'address' | 'payment';
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const steps = [
    { id: 'cart', label: 'Cart' },
    { id: 'address', label: 'Address' },
    { id: 'payment', label: 'Payment' },
  ];

  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-sm md:text-base
                    ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm font-medium ${
                    isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 md:mx-4
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

