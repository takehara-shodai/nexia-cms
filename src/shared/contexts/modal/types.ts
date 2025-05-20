import React from 'react';

export interface ModalProps {
  title?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface ModalContextType {
  showModal: (props: ModalProps) => void;
  hideModal: () => void;
} 