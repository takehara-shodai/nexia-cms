import React from 'react';

export interface ModalProps {
  title?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  message?: string;
}

export interface ModalContextType {
  showModal: (props: ModalProps) => void;
  hideModal: () => void;
}
