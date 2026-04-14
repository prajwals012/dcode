import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';

const QRCodeGenerator = () => {
  const [tableNumber, setTableNumber] = useState('1');
  const [numberOfTables, setNumberOfTables] = useState(10);

  const baseUrl = window.location.origin;
  const qrUrl = `${baseUrl}?table=${tableNumber}`;

  const downloadQR = (table: string) => {
    const svg = document.getElementById(`qr-${table}`) as HTMLElement;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 512;
    canvas.height = 612;

    img.onload = () => {
      ctx!.fillStyle = 'white';
      ctx!.fillRect(0, 0, 512, 612);
      ctx!.drawImage(img, 56, 56, 400, 400);

      ctx!.fillStyle = 'black';
      ctx!.font = 'bold 32px Arial';
      ctx!.textAlign = 'center';
      ctx!.fillText(`Table #${table}`, 256, 500);
      ctx!.font = '20px Arial';
      ctx!.fillText('Scan to view menu & order', 256, 550);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `table-${table}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const downloadAllQRs = () => {
    for (let i = 1; i <= numberOfTables; i++) {
      setTimeout(() => {
        downloadQR(i.toString());
      }, i * 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <QrCode size={32} className="text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">QR Code Generator</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Generate QR codes for restaurant tables. Customers can scan these codes to view the menu and place orders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Single Table Number
              </label>
              <input
                type="number"
                min="1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Generate Multiple Tables (1 to N)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={numberOfTables}
                onChange={(e) => setNumberOfTables(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => downloadQR(tableNumber)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-orange-600 transition"
            >
              <Download size={20} />
              Download Single QR
            </button>
            <button
              onClick={downloadAllQRs}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 transition"
            >
              <Download size={20} />
              Download All ({numberOfTables} QRs)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: Math.min(numberOfTables, 12) }, (_, i) => {
              const table = (i + 1).toString();
              const url = `${baseUrl}?table=${table}`;
              return (
                <div key={table} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <div className="bg-white p-4 rounded-lg mb-3">
                    <QRCodeSVG
                      id={`qr-${table}`}
                      value={url}
                      size={200}
                      level="H"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-gray-800">Table #{table}</p>
                    <p className="text-xs text-gray-600 mt-1 break-all">{url}</p>
                    <button
                      onClick={() => downloadQR(table)}
                      className="mt-3 bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 transition w-full"
                    >
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {numberOfTables > 12 && (
            <p className="text-center text-gray-600 mt-6">
              Showing first 12 tables. Use "Download All" to get all {numberOfTables} QR codes.
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Download QR codes for your restaurant tables</li>
            <li>Print them and place on respective tables</li>
            <li>Customers scan the QR code to access the menu</li>
            <li>Orders are automatically tagged with the table number</li>
            <li>Monitor orders in real-time from the Admin Dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
