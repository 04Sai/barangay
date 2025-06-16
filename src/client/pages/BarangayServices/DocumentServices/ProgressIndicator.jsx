import React, { memo } from "react";

const ProgressIndicator = memo(({ currentStep, totalSteps = 2 }) => {
  return (
    <div className="flex justify-center mb-8 mt-12">
      <div className="flex items-center w-full max-w-md">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isLast = stepNumber === totalSteps;
          
          return (
            <React.Fragment key={stepNumber}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? "bg-blue-600" : "bg-gray-400"
                } text-white font-bold`}
              >
                {stepNumber}
              </div>
              {!isLast && (
                <div className="flex-1 h-1 mx-2 bg-gray-300">
                  <div
                    className={`h-full ${
                      stepNumber < currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    style={{
                      width: stepNumber < currentStep ? "100%" : "0%",
                    }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});

ProgressIndicator.displayName = 'ProgressIndicator';

export default ProgressIndicator;
