"use client";
import { useState, useEffect, useCallback } from 'react';

const APPROVAL_PREFIX = 'approved_review_';
const APPROVAL_CHANGED_EVENT = 'approval-changed';

export function useApprovalState() {
  const [approvalVersion, setApprovalVersion] = useState(0);

  useEffect(() => {
    const handleApprovalChange = () => {
      setApprovalVersion(prev => prev + 1);
    };

    window.addEventListener(APPROVAL_CHANGED_EVENT, handleApprovalChange);
    window.addEventListener('storage', handleApprovalChange);

    return () => {
      window.removeEventListener(APPROVAL_CHANGED_EVENT, handleApprovalChange);
      window.removeEventListener('storage', handleApprovalChange);
    };
  }, []);

  const isApproved = useCallback((id: number): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`${APPROVAL_PREFIX}${id}`) === '1';
  }, [approvalVersion]); // Add approvalVersion as dependency

  const setApproved = useCallback((id: number, value: boolean) => {
    if (typeof window === 'undefined') return;
    
    if (value) {
      localStorage.setItem(`${APPROVAL_PREFIX}${id}`, '1');
    } else {
      localStorage.removeItem(`${APPROVAL_PREFIX}${id}`);
    }
    
    window.dispatchEvent(new CustomEvent(APPROVAL_CHANGED_EVENT, { 
      detail: { id, value } 
    }));
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: `${APPROVAL_PREFIX}${id}`,
      newValue: value ? '1' : null,
    }));
  }, []);

  return { isApproved, setApproved, approvalVersion };
}