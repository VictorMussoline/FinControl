/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface ModalContextType {
  showAlert: (message: string, title?: string, isError?: boolean) => void;
  showConfirm: (message: string, onConfirm: () => void, title?: string, requireInputMatch?: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, message: string, title: string, isError: boolean}>({isOpen: false, message: '', title: '', isError: false});
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, title: string, onConfirm: () => void, requireInputMatch?: string}>({isOpen: false, message: '', title: '', onConfirm: () => {}});
  const [confirmInput, setConfirmInput] = useState('');

  const showAlert = (message: string, title = 'Aviso', isError = false) => {
    setAlertConfig({ isOpen: true, message, title, isError });
  };

  const showConfirm = (message: string, onConfirm: () => void, title = 'Confirmação', requireInputMatch?: string) => {
    setConfirmConfig({ isOpen: true, message, title, onConfirm, requireInputMatch });
    setConfirmInput('');
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      
      {/* Alert Modal */}
      {alertConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${alertConfig.isError ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{alertConfig.title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">{alertConfig.message}</p>
            <button 
              onClick={() => setAlertConfig(prev => ({...prev, isOpen: false}))}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all active:scale-[0.98] ${alertConfig.isError ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20'}`}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{confirmConfig.title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">{confirmConfig.message}</p>
            
            {confirmConfig.requireInputMatch && (
              <div className="mb-6">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Para confirmar, digite <strong className="text-gray-900 dark:text-white select-none">{confirmConfig.requireInputMatch}</strong> abaixo:
                </label>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder={confirmConfig.requireInputMatch}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmConfig(prev => ({...prev, isOpen: false}))}
                className="flex-1 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
              >
                Cancelar
              </button>
              <button 
                disabled={confirmConfig.requireInputMatch ? confirmInput !== confirmConfig.requireInputMatch : false}
                onClick={() => {
                  confirmConfig.onConfirm();
                  setConfirmConfig(prev => ({...prev, isOpen: false}));
                }}
                className="flex-1 py-3 rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
