
"use client";

import { createContext, useContext, useState } from "react";

// After
export interface RentalPeriodType {
  startDate: Date | null;
  endDate: Date | null;
  // ...
}


type RentalPeriodContextType = {
  rentalPeriod: RentalPeriodType;
  setRentalPeriod: (rentalPeriod: RentalPeriodType) => void;
};

const RentalPeriodContext = createContext<RentalPeriodContextType | null>(null);

export function RentalPeriodProvider({ children }: { children: React.ReactNode }) {
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriodType>({
    startDate: null,
    endDate: null,
  });

  return (
    <RentalPeriodContext.Provider value={{ rentalPeriod, setRentalPeriod }}>
      {children}
    </RentalPeriodContext.Provider>
  );
}

export function useRentalPeriod() {
  return useContext(RentalPeriodContext);
}
