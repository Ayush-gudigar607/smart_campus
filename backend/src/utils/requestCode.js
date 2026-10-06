export const formatRequestCode = (year, sequence) => `SR-${year}-${String(sequence).padStart(6, '0')}`;
