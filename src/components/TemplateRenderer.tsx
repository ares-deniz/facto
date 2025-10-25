import { InvoiceData, TemplateType } from '@/types/invoice';
import { ModernTemplate } from './invoice/templates/ModernTemplate';
import { ModernTemplateTwo } from './invoice/templates/ModernTemplateTwo';
import { ClassicTemplate } from './invoice/templates/ClassicTemplate';
import { MinimalTemplate } from './invoice/templates/MinimalTemplate';
import { ModernTemplateThree } from './invoice/templates/ModernTemplateThree';
import { ModernTemplateFour } from './invoice/templates/modernTemplateFour';
import { ClassicTemplateGray } from './invoice/templates/ClassicTemplateGray';
import { ClassicTemplateYellow } from './invoice/templates/ClassicTemplateYellow';
import { ClassicTemplateBlue } from './invoice/templates/ClassicTemplateBlue';

export function TemplateRenderer({
  selected,
  data,
}: {
  selected: TemplateType;
  data: InvoiceData;
}) {
  switch (selected) {
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
}
