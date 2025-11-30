
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Briefcase, Building, Sparkles } from 'lucide-react';

export default function UserIntentDialog({ open, onIntentSelect }) {
  const handleSelect = (intent) => {
    localStorage.setItem('userIntent', intent);
    onIntentSelect(intent);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-white p-6 fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[480px] backdrop-blur-lg shadow-2xl rounded-2xl border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="brand-gold">Master</span>
            <span className="brand-blue">Pro</span>
            <span className="brand-green">Dev</span>
          </DialogTitle>
          <DialogDescription className="text-center text-lg pt-2">
            Welcome! What brings you here today?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={() => handleSelect('career')}
            className="w-full h-16 text-lg bg-white text-white border-2 border-transparent hover:bg-[#ffb400] hover:border-[#ffb400] flex items-center justify-center gap-3 transition-transform hover:scale-105"
          >
            <Briefcase />
            Career Growth
          </Button>
          <Button
            onClick={() => handleSelect('business')}
            className="w-full h-16 text-lg bg-white text-white border-2 border-transparent hover:bg-[#5271ff] hover:border-[#5271ff] flex items-center justify-center gap-3 transition-transform hover:scale-105"
          >
            <Building />
            Business Development
          </Button>
          <Button
            onClick={() => handleSelect('other')}
            className="w-full h-16 text-lg bg-white text-white border-2 border-transparent hover:bg-black hover:border-black flex items-center justify-center gap-3 transition-transform hover:scale-105"
          >
            <Sparkles />
            Just Exploring
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
