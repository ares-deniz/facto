import { InvoiceData } from '@/types/invoice';

interface TemplateProps {
  data: InvoiceData;
}

export const ClassicTemplateGray = ({ data }: TemplateProps) => {
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
      className="bg-white text-gray-900 p-12 min-h-[297mm] shadow-xl border-8 border-double border-gray-400"
      style={{ width: '210mm' }}
    >
      {/* Header */}
      <div className="text-center border-b-4 border-gray-400 pb-6 mb-8 flex space-x-60">
        {data.companyLogo && (
          <div className="mt-4 w-[250px] bg-white p-2 rounded-md">
            <img
              src={data.companyLogo}
              alt="Logo"
              className="block h-42 w-full object-contain"
            />
          </div>
        )}
        <div className="flex-col">
          <h1 className="text-5xl font-serif font-bold mb-2 text-gray-800">
            {data.companyName}
          </h1>
          <div className="text-gray-600 space-y-1 mt-4">
            <p>
              {data.companyAddress}, {data.companyPostalCode} {data.companyCity}
            </p>
            <p>
              Tel: {data.companyPhone} | E-mail: {data.companyEmail}
            </p>
            <p className="font-semibold">TVA: {data.companyVAT}</p>
          </div>
        </div>
      </div>

      <h2 className="text-4xl font-serif text-center mb-8 text-gray-800 border-b border-gray-300 pb-4">
        FACTURE
      </h2>

      {/* Invoice info and client */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="border-2 border-gray-300 p-4 bg-slate-100">
          <h3 className="font-serif font-bold text-lg mb-3 text-gray-800">
            Facturer à:
          </h3>
          <div className="space-y-1 text-gray-700">
            <p className="font-semibold">{data.clientName}</p>
            <p>{data.clientAddress}</p>
            <p>
              {data.clientPostalCode} {data.clientCity}
            </p>
            <p>TVA: {data.clientVAT}</p>
          </div>
        </div>
        <div className="border-2 border-gray-300 p-4 bg-slate-100">
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Numéro de facture:</span>
              <span className="font-mono">{data.invoiceNumber}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Date de facture:</span>
              <span>{data.invoiceDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date d'échéance:</span>
              <span>{data.dueDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="mb-8 border-2 border-gray-500">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-400 text-white">
              <th className="text-left p-4 font-serif">Description</th>
              <th className="text-center p-4 font-serif">Quantité</th>
              <th className="text-right p-4 font-serif">Prix unitaire</th>
              <th className="text-center p-4 font-serif">TVA %</th>
              <th className="text-right p-4 font-serif">Montant</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr
                key={item.id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="p-4 border-b border-gray-300">
                  {item.description}
                </td>
                <td className="text-center p-4 border-b border-gray-300">
                  {item.quantity}
                </td>
                <td className="text-right p-4 border-b border-gray-300">
                  €{item.unitPrice.toFixed(2)}
                </td>
                <td className="text-center p-4 border-b border-gray-300">
                  {item.vatRate}%
                </td>
                <td className="text-right p-4 border-b border-gray-300 font-semibold">
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
        <div className="w-80 border-2 border-gray-500">
          <div className="flex justify-between p-4 border-b border-gray-300 bg-gray-50">
            <span className="font-semibold">Sous-total:</span>
            <span className="font-mono">€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-4 border-b border-gray-300 bg-gray-50">
            <span className="font-semibold">Total TVA:</span>
            <span className="font-mono">€{totalVAT.toFixed(2)}</span>
          </div>
          <div className="flex justify-between p-4 bg-gray-400 text-white">
            <span className="font-serif font-bold text-xl">TOTAL:</span>
            <span className="font-mono font-bold text-xl">
              €{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="border-2 border-gray-300 p-4">
          <h4 className="font-serif font-bold text-lg mb-2 text-gray-800">
            Notes complémentaires:
          </h4>
          <p className="text-gray-700 text-xl uppercase whitespace-pre-wrap leading-relaxed">
            {data.notes}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-8 pt-6 border-t-2 border-gray-300 text-gray-600 text-sm" />
    </div>
  );
};
