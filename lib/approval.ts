const APPROVAL_PREFIX = 'approved_review_';

export function isApproved(id: number): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${APPROVAL_PREFIX}${id}`) === '1';
}

export function setApproved(id: number, value: boolean) {
  if (typeof window === 'undefined') return;
  if (value) {
    localStorage.setItem(`${APPROVAL_PREFIX}${id}`, '1');
  } else {
    localStorage.removeItem(`${APPROVAL_PREFIX}${id}`);
  }
}
