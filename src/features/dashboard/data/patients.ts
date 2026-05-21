export interface PatientRow {
  id: number;
  patient: {
    name: string;
    initials: string;
  };
  assessment: string;
  userType: 'New Patient' | 'Repeat Patient';
  status: 'Approved' | 'Declined' | 'Pending';
  payment: string;
  date: string;
}

export const PATIENTS: PatientRow[] = [
  {
    id: 1,
    patient: { name: 'Emily Chen', initials: 'SJ' },
    assessment: 'Fitness Evaluation',
    userType: 'New Patient',
    status: 'Approved',
    payment: '$99',
    date: '5/27/15',
  },
  {
    id: 2,
    patient: { name: 'Michael Roberts', initials: 'SJ' },
    assessment: 'Nutrition Intake Form',
    userType: 'Repeat Patient',
    status: 'Declined',
    payment: '$99',
    date: '5/19/12',
  },
  {
    id: 3,
    patient: { name: 'David Wilson', initials: 'SJ' },
    assessment: 'Initial Health Assessment',
    userType: 'New Patient',
    status: 'Approved',
    payment: '$99',
    date: '2/11/12',
  },
  {
    id: 4,
    patient: { name: 'Jessica Martinez', initials: 'SJ' },
    assessment: 'Follow-up Assessment',
    userType: 'Repeat Patient',
    status: 'Pending',
    payment: '$99',
    date: '4/4/18',
  },
];
