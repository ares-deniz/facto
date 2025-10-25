import { InvoiceData, TemplateType } from '@/types/invoice';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { forwardRef } from 'react';
import { ModernTemplateTwo } from './templates/ModernTemplateTwo';
import { ModernTemplateThree } from './templates/ModernTemplateThree';
import { ModernTemplateFour } from './templates/modernTemplateFour';
import { ClassicTemplateGray } from './templates/ClassicTemplateGray';
import { ClassicTemplateYellow } from './templates/ClassicTemplateYellow';
import { ClassicTemplateBlue } from './templates/ClassicTemplateBlue';

interface InvoicePreviewProps {
  data: InvoiceData;
  template: TemplateType;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ data, template }, ref) => {
    const renderTemplate = () => {
      switch (template) {
        case 'modern':
          return <ModernTemplate data={data} />;
        case 'modern2':
          return <ModernTemplateTwo data={data} />;
        case 'modern3':
          return <ModernTemplateThree data={data} />;
        case 'modern4':
          return <ModernTemplateFour data={data} />;
        case 'classic':
          return <ClassicTemplate data={data} />;
        case 'classic_gray':
          return <ClassicTemplateGray data={data} />;
        case 'classic_yellow':
          return <ClassicTemplateYellow data={data} />;
        case 'classic_blue':
          return <ClassicTemplateBlue data={data} />;
        case 'minimal':
          return <MinimalTemplate data={data} />;
        default:
          return <ModernTemplate data={data} />;
      }
    };

    return (
      <div ref={ref} className="invoice-preview">
        {renderTemplate()}
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
