import React from 'react';

export interface ModalProps {
  title?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

export interface ModalContextType {
  showModal: (props: ModalProps) => void;
  hideModal: () => void;
}
