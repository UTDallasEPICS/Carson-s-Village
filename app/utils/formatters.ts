export const formatPhoneForDisplay = (phone: string | null | undefined): string => {
  if (!phone) return "";
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

export const formatPhoneWhileTyping = (digits: string): string => {
    digits = (digits || '').replace(/\D/g, '');
    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) {
      return '';
    }
    const parts = [match[1], match[2], match[3]].filter(Boolean);
    if (parts.length <= 1) {
        return parts.join('');
    }
    if (parts.length === 2) {
        if (match[1].length === 3) {
            return `(${match[1]}) ${match[2]}`;
        }
        return `(${match[1]}${match[2]}`;
    }
    if (parts.length === 3) {
        if (match[2].length === 3) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return `(${match[1]}) ${match[2]}${match[3]}`;
    }
    return '';
}
