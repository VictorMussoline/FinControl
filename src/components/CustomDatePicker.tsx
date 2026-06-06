import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(value ? value + "T12:00:00" : Date.now()));
  const { formatDate, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setCurrentDate(new Date(value + "T12:00:00"));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split("T")[0];
    onChange(dateString);
    setIsOpen(false);
  };

  const monthNamesPT = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const monthNamesEN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthNamesES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const getMonthName = () => {
    if (language === "EN-US") return monthNamesEN[currentDate.getMonth()];
    if (language === "ES") return monthNamesES[currentDate.getMonth()];
    return monthNamesPT[currentDate.getMonth()];
  };

  const weekDaysPT = ["D", "S", "T", "Q", "Q", "S", "S"];
  const weekDaysEN = ["S", "M", "T", "W", "T", "F", "S"];
  const weekDaysES = ["D", "L", "M", "M", "J", "V", "S"];

  const getWeekDays = () => {
    if (language === "EN-US") return weekDaysEN;
    if (language === "ES") return weekDaysES;
    return weekDaysPT;
  };

  const selectedDate = value ? new Date(value + "T12:00:00") : null;

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          readOnly
          value={value ? formatDate(value) : ""}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
        />
        <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
          <CalendarIcon size={20} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
              type="button"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-gray-800 dark:text-white">
              {getMonthName()} {currentDate.getFullYear()}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
              type="button"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {getWeekDays().map((d, i) => (
              <div key={i} className="text-xs font-medium text-gray-400">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === currentDate.getMonth() &&
                selectedDate?.getFullYear() === currentDate.getFullYear();
              
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDate(day);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white font-bold shadow-md transform scale-110"
                      : isToday
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
