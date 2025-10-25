export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export interface InvoiceData {
  // Company info
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyPostalCode: string;
  companyVAT: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo?: string;

  // Client info
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientPostalCode: string;
  clientVAT: string;

  // Invoice details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;

  // Items
  items: InvoiceItem[];

  // Notes
  notes?: string;
}

export type TemplateType =
  | 'modern'
  | 'modern2'
  | 'modern3'
  | 'modern4'
  | 'classic'
  | 'classic_gray'
  | 'classic_yellow'
  | 'classic_blue'
  | 'minimal';
