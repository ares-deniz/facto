import { InvoiceData } from '@/types/invoice';

interface TemplateProps {
  data: InvoiceData;
}

export const MinimalTemplate = ({ data }: TemplateProps) => {
  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateItemVAT = (
    quantity: number,
    unitPrice: number,
    vatRate: number
  ) => {
    return (quantity * unitPrice * vatRate) / 100;
  };

  const subtotal = data.items.reduce(
    (sum, item) => sum + calculateItemTotal(item.quantity, item.unitPrice),
    0
  );
  const totalVAT = data.items.reduce(
    (sum, item) =>
      sum + calculateItemVAT(item.quantity, item.unitPrice, item.vatRate),
    0
  );
  const total = subtotal + totalVAT;

  return (
    <div
      className="bg-white text-gray-900 p-12 min-h-[297mm] shadow-xl"
      style={{ width: '210mm' }}
    >
      {/* Simple header */}
      <div className="flex justify-between items-start mb-12 pb-8 border-b">
        <div>
          <h1 className="text-3xl font-light mb-4 text-gray-900">
            {data.companyName}
          </h1>
          <div className="space-y-1 text-sm text-gray-600">
            <p>{data.companyAddress}</p>
            <p>
              {data.companyPostalCode} {data.companyCity}
            </p>
            <p>{data.companyPhone}</p>
            <p>{data.companyEmail}</p>
            <p className="pt-2">TVA: {data.companyVAT}</p>
          </div>
        </div>

        {data.companyLogo && (
          <div className="w-[250px] bg-white p-2 rounded-md">
            <img
              src={data.companyLogo}
              alt="Logo"
              className="block h-42 w-full object-contain"
            />
          </div>
        )}

        <div className="text-right">
          <h2 className="text-4xl font-light mb-6 text-gray-400">Facture</h2>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">N° Facture {data.invoiceNumber}</p>
            <p className="text-gray-600">Date: {data.invoiceDate}</p>
            <p className="text-gray-600">Date d'échéance: {data.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Client info */}
      <div className="mb-12">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
          Facturer à
        </p>
        <div className="space-y-1 text-sm">
          <p className="font-medium text-gray-900">{data.clientName}</p>
          <p className="text-gray-600">{data.clientAddress}</p>
          <p className="text-gray-600">
            {data.clientPostalCode} {data.clientCity}
          </p>
          <p className="text-gray-600">VAT: {data.clientVAT}</p>
        </div>
      </div>

      {/* Items table */}
      <div className="mb-12">
        <div className="border-b pb-3 mb-4">
          <div className="grid grid-cols-12 gap-4 text-xs text-gray-400 uppercase tracking-wider">
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-right">Quantité</div>
            <div className="col-span-2 text-right">Prix</div>
            <div className="col-span-1 text-right">TVA</div>
            <div className="col-span-2 text-right">Montant</div>
          </div>
        </div>
        <div className="space-y-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 text-sm border-b border-gray-100 pb-3"
            >
              <div className="col-span-5 text-gray-900">{item.description}</div>
              <div className="col-span-2 text-right text-gray-600">
                {item.quantity}
              </div>
              <div className="col-span-2 text-right text-gray-600">
                €{item.unitPrice.toFixed(2)}
              </div>
              <div className="col-span-1 text-right text-gray-600">
                {item.vatRate}%
              </div>
              <div className="col-span-2 text-right font-medium text-gray-900">
                €{calculateItemTotal(item.quantity, item.unitPrice).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-72 space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Sous-total</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>TVA</span>
            <span>€{totalVAT.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t-2 border-gray-900 text-lg font-medium text-gray-900">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="border-t pt-8">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
            Remarques
          </p>
          <p className="text-xl uppercase text-gray-600 whitespace-pre-wrap leading-relaxed">
            {data.notes}
          </p>
        </div>
      )}
    </div>
  );
};
