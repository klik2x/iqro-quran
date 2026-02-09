
export const formatHonorifics = (text: string): string => {
  if (!text) return text;
  
  // Rule 9: Replace abbreviations with full honorifics as specified
  let formatted = text
    // Allah SWT -> Allah Subhanahu wa Ta'ala
    .replace(/\b(Allah\s+)?SWT\b/g, 'Subhanahu wa Ta\'ala')
    // Muhammad SAW -> Shallallahu ‘Alaihi wa Sallam
    .replace(/\b(Muhammad\s+)?SAW\b/g, 'Shallallahu ‘Alaihi wa Sallam')
    // Prophets AS -> Alaihis-salam
    .replace(/\bAS\b/g, 'Alaihis-salam')
    // Sahabat RA -> Radhiyallahu ‘anhu (generalized logic, can be refined per context)
    .replace(/\bRA\b/g, 'Radhiyallahu ‘anhu');

  // Case insensitive variants often found in translation text
  formatted = formatted
    .replace(/\bswt\b/gi, 'Subhanahu wa Ta\'ala')
    .replace(/\bsaw\b/gi, 'Shallallahu ‘Alaihi wa Sallam')
    .replace(/\bas\b/gi, 'Alaihis-salam')
    .replace(/\bra\b/gi, 'Radhiyallahu ‘anhu');

  return formatted;
};
