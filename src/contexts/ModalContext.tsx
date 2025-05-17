import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '@/components/common/Modal';

interface ModalContextType {
  showModal: (props: ModalProps) => void;
  hideModal: () => void;
}

interface ModalProps {
  title?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

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

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}