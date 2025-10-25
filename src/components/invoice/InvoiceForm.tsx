import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceData, InvoiceItem } from '@/types/invoice';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceForm = ({ data, onChange }: InvoiceFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoName, setLogoName] = useState('Aucun fichier sélectionné');

  const handleCompanyLogoChange = (file: File | null) => {
    if (!file) {
      updateField('companyLogo', '');
      setLogoName('Aucun fichier sélectionné');
      return;
    }
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = () => updateField('companyLogo', reader.result as string);
    reader.readAsDataURL(file);
  };
  const updateField = (field: keyof InvoiceData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 21,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const items = data.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items });
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) });
  };

  return (
    <div className="space-y-8 p-6 bg-card rounded-lg border shadow-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Détails de votre entreprise</h3>
        <div className="space-y-2">
          <Label>Logo de l’entreprise</Label>

          {/* real input (hidden) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleCompanyLogoChange(e.target.files?.[0] ?? null)
            }
            hidden
          />

          <div className="flex items-center gap-10 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choisir un logo
            </Button>

            {/* remove */}
            {data.companyLogo && (
              <Button
                type="button"
                variant="ghost"
                className="text-xs"
                onClick={() => {
                  handleCompanyLogoChange(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                Supprimer
              </Button>
            )}

            {/* preview inline, before Supprimer */}
            {data.companyLogo && (
              <div className="w-20 h-12 md:-mt-[70px] shrink-0 rounded-md border border-gray-200 bg-white">
                <img
                  src={data.companyLogo}
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
                {/* filename */}
                <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                  {logoName}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 mt-4 md:mt-0">
            <Label htmlFor="companyName">Nom de l'entreprise</Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="Nom de l'entreprise"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyVAT">Numéro de TVA</Label>
            <Input
              id="companyVAT"
              value={data.companyVAT}
              onChange={(e) => updateField('companyVAT', e.target.value)}
              placeholder="BE0123456789"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Adresse</Label>
            <Input
              id="companyAddress"
              value={data.companyAddress}
              onChange={(e) => updateField('companyAddress', e.target.value)}
              placeholder="Rue 123"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="companyPostalCode">Code Postal</Label>
              <Input
                id="companyPostalCode"
                value={data.companyPostalCode}
                onChange={(e) =>
                  updateField('companyPostalCode', e.target.value)
                }
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyCity">Ville</Label>
              <Input
                id="companyCity"
                value={data.companyCity}
                onChange={(e) => updateField('companyCity', e.target.value)}
                placeholder="Brussels"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyPhone">Téléphone</Label>
            <Input
              id="companyPhone"
              value={data.companyPhone}
              onChange={(e) => updateField('companyPhone', e.target.value)}
              placeholder="+32 2 123 45 67"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyEmail">E-mail</Label>
            <Input
              id="companyEmail"
              type="email"
              value={data.companyEmail}
              onChange={(e) => updateField('companyEmail', e.target.value)}
              placeholder="info@entreprise.be"
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Détails du client</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nom du client</Label>
            <Input
              id="clientName"
              value={data.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
              placeholder="Nom du client"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientVAT">Numéro de TVA</Label>
            <Input
              id="clientVAT"
              value={data.clientVAT}
              onChange={(e) => updateField('clientVAT', e.target.value)}
              placeholder="BE0987654321"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Adresse</Label>
            <Input
              id="clientAddress"
              value={data.clientAddress}
              onChange={(e) => updateField('clientAddress', e.target.value)}
              placeholder="Avenue 456"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="clientPostalCode">Code Postal</Label>
              <Input
                id="clientPostalCode"
                value={data.clientPostalCode}
                onChange={(e) =>
                  updateField('clientPostalCode', e.target.value)
                }
                placeholder="2000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientCity">Ville</Label>
              <Input
                id="clientCity"
                value={data.clientCity}
                onChange={(e) => updateField('clientCity', e.target.value)}
                placeholder="Antwerp"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Détails de la facture</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Numéro de facture</Label>
            <Input
              id="invoiceNumber"
              value={data.invoiceNumber}
              onChange={(e) => updateField('invoiceNumber', e.target.value)}
              placeholder="01/2025"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Date de facture</Label>
            <Input
              id="invoiceDate"
              type="date"
              value={data.invoiceDate}
              onChange={(e) => updateField('invoiceDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Date d'échéance</Label>
            <Input
              id="dueDate"
              type="date"
              value={data.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Articles</h3>
          <Button onClick={addItem} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un article
          </Button>
        </div>
        <div className="space-y-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-3 p-3 bg-muted/50 rounded-lg items-end"
            >
              {/* Description */}
              <div className="sm:col-span-6 md:col-span-5 space-y-1.5">
                <Label className="text-xs sm:text-[13px]">Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, 'description', e.target.value)
                  }
                  placeholder="Service, Travaux, Produit, etc."
                  className="h-10 text-sm"
                  autoComplete="off"
                />
              </div>

              {/* Quantité */}
              <div className="sm:col-span-3 md:col-span-2 space-y-1.5">
                <Label className="text-xs sm:text-[13px]">Quantité</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      'quantity',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  step="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="h-10 text-sm [appearance:textfield]"
                />
              </div>

              {/* Prix unitaire */}
              <div className="sm:col-span-3 md:col-span-2 space-y-1.5">
                <Label className="text-xs sm:text-[13px]">
                  Prix unitaire (€)
                </Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      'unitPrice',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  className="h-10 text-sm [appearance:textfield]"
                />
              </div>

              {/* TVA */}
              <div className="sm:col-span-3 md:col-span-2 space-y-1.5">
                <Label className="text-xs sm:text-[13px]">TVA (%)</Label>
                <Input
                  type="number"
                  value={item.vatRate}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      'vatRate',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  max="100"
                  step="0.01"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  className="h-10 text-sm [appearance:textfield]"
                />
              </div>

              {/* Delete */}
              <div className="flex sm:col-span-3 md:col-span-1 justify-end md:justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label="Supprimer la ligne"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes complémentaires</Label>
        <Textarea
          id="notes"
          value={data.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="ex: Autoliquidation"
          rows={3}
        />
      </div>
    </div>
  );
};
