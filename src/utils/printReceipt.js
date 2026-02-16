import { IMG_BASE_URL } from "../config/Config";

export const printReceipt = (data, printerType) => {
    // Adapter to normalize data structure
    const order = data || {};
    const items = data?.order_details || [];
    const user = {
        name: data?.user_name || 'Guest',
        phone: data?.user_phone || 'N/A',
        address: data?.pickup_address || 'N/A' // Defaulting to pickup address as main address
    };

    // Printer Type: 0 = POS, 1 = Regular (Updated based on AppSettings)
    const isPos = String(printerType) === "0";

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        alert("Please allow popups to print receipts");
        return;
    }

    const htmlContent = isPos ? getPosContent(order, items, user) : getRegularContent(order, items, user);

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // improved print handling
    printWindow.onload = () => {
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };
};

const getPosContent = (order, items, user) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Receipt #${order?.id}</title>
        <style>
            body { 
                font-family: 'Courier New', monospace; 
                width: 300px; 
                margin: 0 auto; 
                padding: 10px; 
                background: #fff;
                color: #000;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 5px; }
            .info { font-size: 12px; margin-bottom: 10px; }
            .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
            .item-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
            .item-name { font-weight: bold; width: 100%; }
            .item-details { width: 100%; display: flex; justify-content: space-between; color: #555; }
            .totals { margin-top: 15px; font-size: 12px; }
            .total-row { display: flex; justify-content: space-between; font-weight: bold; margin-top: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">
                <span>🧺</span> LAUNDRY
            </div>
            <div style="font-size: 10px; margin-top: 5px;">+8801711257498</div>
        </div>

        <div class="info">
            <div>Customer: ${user.name}</div>
            <div>Phone: ${user.phone}</div>
            <div>Address: ${user.address}</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
            <div style="font-weight: bold; margin-top: 5px;">Order ID: LM${String(order?.id).padStart(6, '0')}</div>
        </div>

        <div class="divider"></div>

        <div class="items">
            ${items.map(item => `
                <div style="margin-bottom: 8px;">
                    <div class="item-name">${item.product_name}</div>
                    <div class="item-details">
                        <span>${item.quantity} x $${item.price || 0}</span>
                        <span>$${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="divider"></div>

        <div class="totals">
            <div class="item-row">
                <span>Total Items:</span>
                <span>${items.reduce((acc, item) => acc + item.quantity, 0)}</span>
            </div>
            <div class="item-row">
                <span>Subtotal:</span>
                <span>$${items.reduce((acc, item) => acc + (item.quantity * item.price), 0).toFixed(2)}</span>
            </div>
             <div class="item-row">
                <span>Delivery Cost:</span>
                <span>$20.00</span> 
            </div>
            <div class="total-row" style="font-size: 14px; border-top: 1px dashed #000; padding-top: 5px;">
                <span>TOTAL PAYABLE</span>
                <span>$${order?.final_amount || '0.00'}</span>
            </div>
        </div>

        <div style="background: #e0e0e0; padding: 5px; margin-top: 10px; font-size: 12px; display: flex; justify-content: space-between;">
             <span>Total PCs: ${items.reduce((acc, item) => acc + item.quantity, 0)}</span>
             <span>Paid By: Cash</span>
        </div>

        <div class="footer">
            Thank you for choosing Laundry
        </div>
    </body>
    </html>
    `;
};

const getRegularContent = (order, items, user) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice #${order?.id}</title>
        <style>
             body { 
                font-family: 'Arial', sans-serif; 
                width: 100%; 
                max-width: 800px;
                margin: 0 auto; 
                padding: 40px; 
                color: #333;
            }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #00bfa5; display: flex; align-items: center; gap: 10px; }
            .invoice-title { font-size: 32px; color: #00bfa5; text-align: right; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 40px; }
            .customer-info h3 { margin: 0 0 10px 0; font-size: 16px; color: #555; }
            .meta-info { text-align: right; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #00bfa5; color: white; padding: 12px; text-align: left; font-size: 14px; }
            td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            th:last-child, td:last-child { text-align: right; }
            
            .totals { width: 300px; margin-left: auto; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .grand-total { background: #eee; padding: 10px; font-weight: bold; }
            
            .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; display: flex; justify-content: space-between; color: #777; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">
                <span>🧺</span> LAUNDRY
            </div>
            <div>
                <div class="invoice-title">Invoice</div>
            </div>
        </div>

        <div class="info-grid">
            <div class="customer-info">
                <h3>Customer: ${user.name}</h3>
                <div>Address: ${user.address}</div>
                <div>Phone: ${user.phone}</div>
                <br/>
                <div><strong>Pickup Date:</strong> ${order?.pickup_date}</div>
                <div><strong>Delivery Date:</strong> ${order?.delivery_date}</div>
            </div>
            <div class="meta-info">
                <div><strong>RECEIPT #</strong> LM${String(order?.id).padStart(6, '0')}</div>
                <div><strong>DATE:</strong> ${new Date().toLocaleDateString()}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td>${item.product_name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price || 0}</td>
                        <td>$${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>SUBTOTAL</span>
                <span>$${items.reduce((acc, item) => acc + (item.quantity * item.price), 0).toFixed(2)}</span>
            </div>
             <div class="total-row">
                <span>DELIVERY CHARGE</span>
                <span>$20.00</span>
            </div>
            <div class="total-row grand-total">
                <span>TOTAL PAYABLE</span>
                <span>$${order?.final_amount || '0.00'}</span>
            </div>
        </div>

        <div class="footer">
            <div class="notes">
                <strong>Delivery Note:</strong><br/>
                Thank you for your business
            </div>
            <div>
                Authorised sign
            </div>
        </div>
    </body>
    </html>
    `;
};
