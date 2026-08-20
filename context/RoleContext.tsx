"create client";

import { createContext, useContext, useState, ReactNode } from "react";

interface RoleContextType {
  role: string;
  setRole: (role: string) => void;
}

const RoleContext = createContext<RoleContextType>({
  role: "ADMIN",
  setRole: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState("ADMIN");

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
