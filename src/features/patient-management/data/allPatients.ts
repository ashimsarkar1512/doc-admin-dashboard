export type PatientStatus = 'Active' | 'Banned' | 'Inactive';

export interface AllPatientRow {
  id: number;
  patient: {
    name: string;
    initials: string;
    avatarColor: string;
  };
  email: string;
  contact: string;
  activeConsultation: number;
  payment: string;
  status: PatientStatus;
  joiningDate: string;
}

export const ALL_PATIENTS: AllPatientRow[] = [
  {
    id: 1,
    patient: { name: 'Jessica Martinez', initials: 'JM', avatarColor: '#C4B5FD' },
    email: 'webdragon@msn.com',
    contact: '(307) 555-0133',
    activeConsultation: 2,
    payment: '$99',
    status: 'Active',
    joiningDate: '4/4/18',
  },
  {
    id: 2,
    patient: { name: 'Emily Chen', initials: 'EC', avatarColor: '#A5F3FC' },
    email: 'wkrebs@verizon.net',
    contact: '(319) 555-0115',
    activeConsultation: 6,
    payment: '$99',
    status: 'Active',
    joiningDate: '5/19/12',
  },
  {
    id: 3,
    patient: { name: 'Jessica Martinez', initials: 'JM', avatarColor: '#C4B5FD' },
    email: 'dgatwood@msn.com',
    contact: '(406) 555-0120',
    activeConsultation: 1,
    payment: '$99',
    status: 'Active',
    joiningDate: '4/4/18',
  },
  {
    id: 4,
    patient: { name: 'Michael Roberts', initials: 'MR', avatarColor: '#FCA5A5' },
    email: 'sabren@comcast.net',
    contact: '(704) 555-0127',
    activeConsultation: 5,
    payment: '$99',
    status: 'Banned',
    joiningDate: '5/19/12',
  },
  {
    id: 5,
    patient: { name: 'David Wilson', initials: 'DW', avatarColor: '#86EFAC' },
    email: 'sumdumass@gmail.com',
    contact: '(603) 555-0123',
    activeConsultation: 8,
    payment: '$99',
    status: 'Active',
    joiningDate: '2/11/12',
  },
  {
    id: 6,
    patient: { name: 'Sarah Johnson', initials: 'SJ', avatarColor: '#FDE68A' },
    email: 'sjohnson@gmail.com',
    contact: '(512) 555-0198',
    activeConsultation: 3,
    payment: '$99',
    status: 'Active',
    joiningDate: '7/15/20',
  },
  {
    id: 7,
    patient: { name: 'Robert Brown', initials: 'RB', avatarColor: '#C4B5FD' },
    email: 'rbrown@yahoo.com',
    contact: '(415) 555-0211',
    activeConsultation: 0,
    payment: '$99',
    status: 'Inactive',
    joiningDate: '3/22/19',
  },
];
