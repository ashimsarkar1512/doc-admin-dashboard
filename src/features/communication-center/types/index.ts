export type TemplateType = 'Email' | 'SMS' | 'Notification';

export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  description: string;
  subject?: string;
  body: string;
  variables: string[];
  isActive: boolean;
}
