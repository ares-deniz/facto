import { InvoiceData } from '@/types/invoice';

interface TemplateProps {
  data: InvoiceData;
}

export const ModernTemplateThree = ({ data }: TemplateProps) => {
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
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500/85 text-white p-8 -mx-12 -mt-12 mb-8 rounded-b-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{data.companyName}</h1>
            <div className="space-y-1 text-blue-50">
              <p>{data.companyAddress}</p>
              <p>
                {data.companyPostalCode} {data.companyCity}
              </p>
              <p>TVA: {data.companyVAT}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-50">{data.companyPhone}</p>
            <p className="text-blue-50">{data.companyEmail}</p>
            {data.companyLogo && (
              <div className="mt-4 w-[250px] bg-white p-2 rounded-md">
                <img
                  src={data.companyLogo}
                  alt="Logo"
                  className="block h-32 w-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice details and client info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">
            Facturer à
          </h3>
          <div className="space-y-1">
            <p className="font-semibold text-lg">{data.clientName}</p>
            <p className="text-gray-600">{data.clientAddress}</p>
            <p className="text-gray-600">
              {data.clientPostalCode} {data.clientCity}
            </p>
            <p className="text-gray-600">TVA: {data.clientVAT}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-orange-500 mb-4">FACTURE</h2>
          <div className="space-y-2">
            <div className="flex justify-end gap-4">
              <span className="text-gray-500 font-medium">N° Facture </span>
              <span className="font-semibold">{data.invoiceNumber}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-500 font-medium">Date:</span>
              <span>{data.invoiceDate}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-500 font-medium">
                Date d'échéance:
              </span>
              <span>{data.dueDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-orange-600">
              <th className="text-left p-3 font-semibold">Description</th>
              <th className="text-right p-3 font-semibold">Quantité</th>
              <th className="text-right p-3 font-semibold">Prix unitaire</th>
              <th className="text-right p-3 font-semibold">TVA %</th>
              <th className="text-right p-3 font-semibold">Montant</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-3">{item.description}</td>
                <td className="text-right p-3">{item.quantity}</td>
                <td className="text-right p-3">€{item.unitPrice.toFixed(2)}</td>
                <td className="text-right p-3">{item.vatRate}%</td>
                <td className="text-right p-3 font-medium">
                  €
                  {calculateItemTotal(item.quantity, item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Sous-total:</span>
            <span className="font-medium">€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">TVA:</span>
            <span className="font-medium">€{totalVAT.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 bg-orange-400 text-white px-4 rounded">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg">€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Remarques:</h4>
          <p className="text-gray-600 text-xl uppercase whitespace-pre-wrap">
            {data.notes}
          </p>
        </div>
      )}
    </div>
  );
};
