/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AmbientBackground } from './components/AmbientBackground';
import { AudioToggle } from './components/AudioToggle';
import { PasswordScreen } from './components/screens/PasswordScreen';
import { LoveCheckScreen } from './components/screens/LoveCheckScreen';
import { LoveMoreScreen } from './components/screens/LoveMoreScreen';
import { MultilingualScreen } from './components/screens/MultilingualScreen';
import { TypographyHeartScreen } from './components/screens/TypographyHeartScreen';
import { BirthdayLetterScreen } from './components/screens/BirthdayLetterScreen';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  const handleStepTransition = (nextStep: number) => {
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplay = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isBlackScreen = currentStep === 5;

  return (
    <main
      className={`relative min-h-screen w-full flex flex-col justify-center transition-colors duration-700 ${
        isBlackScreen
          ? 'bg-black text-white selection:bg-rose-500 selection:text-white'
          : 'bg-[#fff0f5] text-zinc-900 selection:bg-pink-300 selection:text-pink-900'
      }`}
    >
      {/* Dynamic Ambient Background (hidden during pure black text heart animation) */}
      {!isBlackScreen && <AmbientBackground />}

      {/* Floating Audio & Story Chapter Controls */}
      <AudioToggle
        currentStep={currentStep}
        totalSteps={totalSteps}
        onJumpStep={(step) => handleStepTransition(step)}
      />

      {/* Screen Transitions */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            <PasswordScreen onUnlock={() => handleStepTransition(2)} />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            <LoveCheckScreen onYes={() => handleStepTransition(3)} />
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            <LoveMoreScreen onProve={() => handleStepTransition(4)} />
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            <MultilingualScreen onContinue={() => handleStepTransition(5)} />
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            <TypographyHeartScreen onProceedToLetter={() => handleStepTransition(6)} />
          </motion.div>
        )}

        {currentStep === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full flex-1 flex flex-col justify-center"
          >
            <BirthdayLetterScreen onReplay={handleReplay} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
