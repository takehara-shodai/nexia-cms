import React, { createContext, useState, useCallback } from 'react';
import Modal from '@/components/common/Modal';
import { ModalProps, ModalContextType } from './types';

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalProps, setModalProps] = useState<ModalProps | null>(null);

  const showModal = useCallback((props: ModalProps) => {
    setModalProps(props);
  }, []);

  const hideModal = useCallback(() => {
    setModalProps(null);
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        isOpen={modalProps !== null}
        onClose={hideModal}
        title={modalProps?.title}
        footer={modalProps?.footer}
      >
        {modalProps?.content}
      </Modal>
    </ModalContext.Provider>
  );
}
