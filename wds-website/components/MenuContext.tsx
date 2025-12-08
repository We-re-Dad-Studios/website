"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

interface MenuContextValue {
  open: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  closeMenuDelayed: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be inside MenuProvider");
  return ctx;
};

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const openMenu = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  }, []);

  const closeMenuDelayed = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 150);
  }, []);

  // ESC closes menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeMenu]);

  return (
    <MenuContext.Provider
      value={{
        open,
        openMenu,
        closeMenu,
        closeMenuDelayed,
        menuRef,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
