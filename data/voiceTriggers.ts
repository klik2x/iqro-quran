
import { VoiceTrigger } from '../types';

export const voiceTriggers: VoiceTrigger[] = [
  {
    keyword: 'next',
    languages: {
      'id': ['lanjut', 'berikutnya', 'terus'],
      'en': ['next', 'continue', 'forward'],
      'ar': ['التالي', 'استمر', 'تقدم'],
    },
    action: 'next',
  },
  {
    keyword: 'previous',
    languages: {
      'id': ['balik', 'sebelumnya', 'mundur'],
      'en': ['previous', 'back', 'go back'],
      'ar': ['السابق', 'الخلف', 'ارجع'],
    },
    action: 'previous',
  },
  {
    keyword: 'repeat',
    languages: {
      'id': ['ulang', 'ulangi', 'bacakan lagi'],
      'en': ['repeat', 'say again'],
      'ar': ['أعد', 'كرر'],
    },
    action: 'repeat',
  },
  {
    keyword: 'stop',
    languages: {
      'id': ['stop', 'berhenti', 'sudah'],
      'en': ['stop', 'pause', 'enough'],
      'ar': ['توقف', 'قف'],
    },
    action: 'stop',
  },
  {
    keyword: 'start',
    languages: {
      'id': ['mulai', 'rekam', 'baca'],
      'en': ['start', 'record', 'begin'],
      'ar': ['ابدأ', 'سجل'],
    },
    action: 'start',
  },
  {
    keyword: 'help',
    languages: {
      'id': ['bantuan', 'tolong', 'cara'],
      'en': ['help', 'assist', 'commands'],
      'ar': ['مساعدة', 'أمر'],
    },
    action: 'help',
  },
];
