import { TemplateType } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, File } from 'lucide-react';

interface TemplateSelectorProps {
  selected: TemplateType;
  onSelect: (template: TemplateType) => void;
}

export const TemplateSelector = ({
  selected,
  onSelect,
}: TemplateSelectorProps) => {
  const templates: {
    type: TemplateType;
    name: string;
    icon: any;
    description: string;
  }[] = [
    {
      type: 'modern',
      name: 'Modern',
      icon: FileText,
      description: 'Conception épurée avec en-tête bannière bleue',
    },
    {
      type: 'modern2',
      name: 'Modern2',
      icon: FileText,
      description: 'Conception épurée avec en-tête bannière jaune',
    },
    {
      type: 'modern3',
      name: 'Modern3',
      icon: FileText,
      description: 'Conception épurée avec en-tête bannière orange',
    },
    {
      type: 'modern4',
      name: 'Modern4',
      icon: FileText,
      description: 'Conception épurée avec en-tête bannière indigo',
    },
    {
      type: 'classic',
      name: 'Classic',
      icon: FileSpreadsheet,
      description: 'Style traditionnel avec bordures et sections définies',
    },
    {
      type: 'classic_gray',
      name: 'Classic Gray',
      icon: FileSpreadsheet,
      description: 'Style traditionnel avec bordures et sections gris',
    },
    {
      type: 'classic_yellow',
      name: 'Classic Yellow',
      icon: FileSpreadsheet,
      description: 'Style traditionnel avec bordures et sections jaunes',
    },
    {
      type: 'classic_blue',
      name: 'Classic Blue',
      icon: FileSpreadsheet,
      description: 'Style traditionnel avec bordures et sections bleues',
    },
    {
      type: 'minimal',
      name: 'Minimal',
      icon: File,
      description: 'Mise en page simple axée sur le contenu',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choisir un modèle</h3>

      {/* Horizontal scroller (all breakpoints) */}
      <div className="-mx-6 px-6">
        {' '}
        {/* more outer breathing room */}
        <div
          className="
      flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 pt-2
      scroll-px-2 px-4"
        >
          {templates.map((template) => {
            const Icon = template.icon;
            const isSelected = selected === template.type;
            return (
              <Button
                key={template.type}
                onClick={() => onSelect(template.type)}
                variant={isSelected ? 'default' : 'outline'}
                className={`snap-start shrink-0 w-44 md:w-48 h-auto
                      flex flex-col items-center justify-start gap-4 p-4 text-center
                      ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              >
                <Icon className="h-8 w-8 shrink-0" />
                <div className="min-w-0 w-full">
                  <div className="font-semibold mb-1 break-words">
                    {template.name}
                  </div>
                  <div className="text-xs opacity-80 font-normal break-words text-pretty">
                    {template.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
