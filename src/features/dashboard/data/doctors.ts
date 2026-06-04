export type Doctor = {
  id: string;
  name: string;
  avatar: string;
  office: string;
  role: string;
  email: string;
  activeConsultation: string;
  status: 'Active' | 'Inactive';
};

export const dummyDoctors: Doctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Runa Pradhan',
    avatar: 'https://i.pravatar.cc/150?u=runa',
    office: 'Colorado Springs',
    role: 'FNP-BC',
    email: 'runa.pradhannp@gmail.com',
    activeConsultation: '05',
    status: 'Active',
  },
  {
    id: 'doc_2',
    name: 'Dr. Jeffrey Richker',
    avatar: 'https://i.pravatar.cc/150?u=jeffrey',
    office: 'Cherry Creek',
    role: 'APNP',
    email: 'jeffrey.richker@gmail.com',
    activeConsultation: '02',
    status: 'Active',
  },
  {
    id: 'doc_3',
    name: 'Dr. Nicole Sheeder',
    avatar: 'https://i.pravatar.cc/150?u=nicole',
    office: 'Colorado Springs',
    role: 'FNP',
    email: 'nicole.sheeder@gmail.com',
    activeConsultation: '02',
    status: 'Active',
  },
  {
    id: 'doc_4',
    name: 'Dr. Christine Czarnecki',
    avatar: 'https://i.pravatar.cc/150?u=christine',
    office: 'DTC / Greenwood Village',
    role: 'APNP',
    email: 'c.czarnecki@gmail.com',
    activeConsultation: '04',
    status: 'Active',
  },
  {
    id: 'doc_5',
    name: 'Dr. Natalie Nicholas',
    avatar: 'https://i.pravatar.cc/150?u=natalie',
    office: 'Cherry Creek',
    role: 'AGACNPBC',
    email: 'natalie.nicholas@gmail.com',
    activeConsultation: '01',
    status: 'Active',
  },
  {
    id: 'doc_6',
    name: 'Tara Terrones,',
    avatar: 'https://i.pravatar.cc/150?u=tara',
    office: 'Boulder',
    role: 'Esthetician',
    email: 'terrones@gmail.com',
    activeConsultation: '03',
    status: 'Active',
  },
];
