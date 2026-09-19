'use client';

import React, { useEffect } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * RainbowKit Modal Bridge:
 * Delegates wallet connection entirely to RainbowKit's official modal.
 */
export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (isOpen && openConnectModal) {
      openConnectModal();
      onClose();
    }
  }, [isOpen, openConnectModal, onClose]);

  return null;
};
