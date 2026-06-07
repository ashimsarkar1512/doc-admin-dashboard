export type PatientType = 'New Patient' | 'Repeat Patient';
export type AssessmentStatus = 'Pending' | 'Approved' | 'Declined';
export type AssignStatus = 'Assign' | 'Assigned';

export interface AssessmentRow {
  id: string;
  patientName: string;
  patientInitials: string;
  assessment: string;
  patientType: PatientType;
  payment: string;
  status: AssessmentStatus;
  date: string;
  assignStatus: AssignStatus;
}

export const dummyAssessments: AssessmentRow[] = [
  {
    id: 'asmnt_1',
    patientName: 'Jessica Martinez',
    patientInitials: 'JM',
    assessment: 'Weight Loss',
    patientType: 'Repeat Patient',
    payment: '$99',
    status: 'Pending',
    date: '4/4/18',
    assignStatus: 'Assign',
  },
  {
    id: 'asmnt_2',
    patientName: 'Emily Chen',
    patientInitials: 'EC',
    assessment: 'Hormone Therapy',
    patientType: 'New Patient',
    payment: '$99',
    status: 'Approved',
    date: '5/19/12',
    assignStatus: 'Assigned',
  },
  {
    id: 'asmnt_3',
    patientName: 'Jessica Martinez',
    patientInitials: 'JM',
    assessment: 'Regrow Hair',
    patientType: 'New Patient',
    payment: '$99',
    status: 'Pending',
    date: '4/4/18',
    assignStatus: 'Assign',
  },
  {
    id: 'asmnt_4',
    patientName: 'Michael Roberts',
    patientInitials: 'MR',
    assessment: "Men's Services",
    patientType: 'Repeat Patient',
    payment: '$99',
    status: 'Declined',
    date: '5/19/12',
    assignStatus: 'Assigned',
  },
  {
    id: 'asmnt_5',
    patientName: 'David Wilson',
    patientInitials: 'DW',
    assessment: 'Skin Services',
    patientType: 'New Patient',
    payment: '$99',
    status: 'Approved',
    date: '2/11/12',
    assignStatus: 'Assigned',
  },
];
