document.addEventListener('DOMContentLoaded', () => {
    const menuItems = [
        { id: 1, name: 'Comida 1', price: 10, type: 'comida' },
        { id: 2, name: 'Comida 2', price: 12, type: 'comida' },
        { id: 3, name: 'Entrada 1', price: 5, type: 'entrada' },
        { id: 4, name: 'Entrada 2', price: 6, type: 'entrada' },
        { id: 5, name: 'Bebida 1', price: 3, type: 'bebida' },
        { id: 6, name: 'Bebida 2', price: 4, type: 'bebida' },
        // ... otros elementos del menú
    ];

    const boleta = [];

    const menuComidas = document.getElementById('menu-comidas');
    const menuEntradas = document.getElementById('menu-entradas');
    const menuBebidas = document.getElementById('menu-bebidas');
    const boletaSection = document.getElementById('boleta-items');
    const boletaTotal = document.getElementById('boleta-total');
    const generatePdfButton = document.getElementById('generate-pdf');
    const printBoletaButton = document.getElementById('print-boleta');

    menuItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('p-4', 'bg-white', 'rounded', 'shadow', 'text-center');
        itemDiv.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
            <p class="text-gray-700 mb-2">$${item.price.toFixed(2)}</p>
            <button class="mt-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"><i class="fas fa-plus"></i> Agregar</button>
        `;
        itemDiv.querySelector('button').addEventListener('click', () => {
            addItemToBoleta(item);
        });
        if (item.type === 'comida') {
            menuComidas.appendChild(itemDiv);
        } else if (item.type === 'entrada') {
            menuEntradas.appendChild(itemDiv);
        } else if (item.type === 'bebida') {
            menuBebidas.appendChild(itemDiv);
        }
    });

    const addItemToBoleta = (item) => {
        const existingItem = boleta.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            boleta.push({ ...item, quantity: 1 });
        }
        renderBoleta();
    };

    const renderBoleta = () => {
        boletaSection.innerHTML = '';
        let total = 0;
        boleta.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('p-2', 'flex', 'justify-between', 'border-b', 'items-center');
            itemDiv.innerHTML = `
                <span class="text-gray-800 flex-1">${item.name} (${item.quantity})</span>
                <span class="text-gray-800 w-20 text-right">$${item.price.toFixed(2)}</span>
                <span class="text-gray-800 w-20 text-right">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="text-red-500 hover:text-red-700 ml-2" data-index="${index}"><i class="fas fa-trash"></i> Eliminar</button>
            `;
            itemDiv.querySelector('button').addEventListener('click', (e) => {
                removeItemFromBoleta(e.target.dataset.index);
            });
            boletaSection.appendChild(itemDiv);
        });
        boletaTotal.innerHTML = `
            <p class="text-lg font-semibold text-gray-800">Total: $${total.toFixed(2)}</p>
        `;
    };

    const removeItemFromBoleta = (index) => {
        boleta.splice(index, 1);
        renderBoleta();
    };

    generatePdfButton.addEventListener('click', () => {
        generatePDF();
    });

    printBoletaButton.addEventListener('click', () => {
        printBoleta();
    });

    const generatePDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Estilos generales
        doc.setFontSize(16);
        doc.setTextColor(40);

        // Título de la empresa
        doc.setFont('helvetica', 'bold');
        doc.text('Nombre de la Empresa', 105, 20, null, null, 'center');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Dirección de la Empresa', 105, 28, null, null, 'center');
        doc.text('Teléfono: (123) 456-7890', 105, 36, null, null, 'center');

        // Título de la boleta
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Boleta de Venta', 105, 50, null, null, 'center');

        // Encabezados de la tabla
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Descripción', 10, 60);
        doc.text('Cantidad', 100, 60, null, null, 'right');
        doc.text('Precio', 130, 60, null, null, 'right');
        doc.text('Total', 160, 60, null, null, 'right');

        // Items de la boleta
        doc.setFont('helvetica', 'normal');
        let y = 70;
        boleta.forEach(item => {
            doc.text(item.name, 10, y);
            doc.text(String(item.quantity), 100, y, null, null, 'right');
            doc.text(`$${item.price.toFixed(2)}`, 130, y, null, null, 'right');
            doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 160, y, null, null, 'right');
            y += 10;
        });

        // Total final
        doc.setFont('helvetica', 'bold');
        doc.text(`Total: $${boleta.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`, 160, y + 10, null, null, 'right');

        doc.save('boleta.pdf');
    };

    const printBoleta = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Boleta de Venta</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .boleta-header, .boleta-items, .boleta-total { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
                    .boleta-header { text-align: center; }
                    .boleta-items { width: 100%; border-collapse: collapse; }
                    .boleta-items th, .boleta-items td { border: 1px solid #ccc; padding: 8px; text-align: right; }
                    .boleta-items th { background-color: #f2f2f2; }
                    .boleta-total { text-align: right; }
                </style>
            </head>
            <body>
                <div class="boleta-header">
                    <p><strong>Nombre de la Empresa</strong></p>
                    <p>Dirección de la Empresa</p>
                    <p>Teléfono: (123) 456-7890</p>
                </div>
                <table class="boleta-items">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${boleta.map(item => `
                            <tr>
                                <td style="text-align: left;">${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.price.toFixed(2)}</td>
                                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="boleta-total">
                    <p><strong>Total: $${boleta.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</strong></p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };
});
