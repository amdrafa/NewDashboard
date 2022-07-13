import dayjs from "dayjs";
import { createContext, ReactNode, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


type CalendarProviderProps = {
  children: ReactNode;
};

interface CalendarContextProps {
  monthIndex: number;
  setMonthIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const CalendarContext = createContext({} as CalendarContextProps);

export function CalendarContextProvider({ children }: CalendarProviderProps) {
  
    const [monthIndex, setMonthIndex] = useState(dayjs().month())


  //isAutenticated e User (com informações do user) devem ser retornados dentro de mais um objeto
  // exemplo value={{createUser, user, isAutenticated } }>
  return (
    <CalendarContext.Provider value={{ monthIndex, setMonthIndex }}>
      <ToastContainer theme="colored" />
      {children}
    </CalendarContext.Provider>
  );
}
