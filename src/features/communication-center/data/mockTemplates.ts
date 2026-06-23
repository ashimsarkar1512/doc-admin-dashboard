import type { Template } from '../types';

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Welcome Email',
    type: 'Email',
    description: 'Welcome to WeightlossMD!',
    subject: 'Welcome to WeightlossMD!',
    body: `Hi, {{patient_name}}

Welcome to WeightlossMD! Your account has been created.

Your assigned provider is {{provider_name}}

Best regards,
WeightlossMD Team`,
    variables: ['patient_name', 'provider_name'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Prescription Ready',
    type: 'Email',
    description: 'Your prescription is ready',
    subject: 'Your prescription is ready',
    body: `Hi, {{patient_name}}

Good news! Your prescription for {{medication_name}} is ready.

Order ID: {{order_id}}

Best regards,
WeightlossMD Team`,
    variables: ['patient_name', 'medication_name', 'order_id'],
    isActive: true,
  },
  {
    id: '3',
    name: 'Appointment Reminder',
    type: 'Email',
    description: 'Reminder: Upcoming appointment on {{appointment_date}}',
    subject: 'Reminder: Your upcoming appointment',
    body: `Hi, {{patient_name}}

This is a reminder that you have an appointment scheduled on {{appointment_date}} at {{appointment_time}} with {{provider_name}}.

Please arrive 10 minutes early.

Best regards,
WeightlossMD Team`,
    variables: ['patient_name', 'appointment_date', 'appointment_time', 'provider_name'],
    isActive: true,
  },
  {
    id: '4',
    name: 'Appointment Reminder SMS',
    type: 'SMS',
    description: 'SMS reminder for appointments',
    body: `WeightlossMD: Reminder - You have an appointment on {{appointment_date}} at {{appointment_time}}. Reply STOP to opt out.`,
    variables: ['appointment_date', 'appointment_time'],
    isActive: true,
  },
  {
    id: '5',
    name: 'Lab Results Ready',
    type: 'Notification',
    description: 'Notification when lab results are available',
    body: 'Your lab results are now available in your patient portal.',
    variables: [],
    isActive: true,
  },
];
