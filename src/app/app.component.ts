import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('quotePreview') quotePreviewRef!: ElementRef<HTMLDivElement>;
  @ViewChild('invoicePreview') invoicePreviewRef!: ElementRef<HTMLDivElement>;

  title = 'Generador de Cotizaciones';
  activeTab: 'quote' | 'invoice' = 'quote';

  companyIdType: 'NIT' | 'CC' = 'CC';
  company = {
    name: 'VICTOR FABIAN MORALES RODRIGUEZ',
    nit: '1098736746',
    address: 'CALLE 14 # 26-11',
    city: 'Bucaramanga',
    postalCode: '680002',
    phone: '+57 3167527891',
    email: 'vick@lidr.co',
    logoUrl: ''
  };

  client = {
    name: 'LIDR Talent SL',
    company: 'LIDR Talent SL',
    nit: 'B13990049',
    address: 'Calle Craywinckel, 2. Escalera B, Ático 3',
    city: 'Barcelona',
  };

  quote = {
    number: '1234',
    projectName: 'Nombre del Proyecto',
    createdAt: new Date().toISOString().substring(0, 10),
    validityDays: 15,
    validityDate: this.computeValidityDate(15)
  };

  executiveSummary =
    'Provisión de servicios de desarrollo de software especializado para [Nombre del Proyecto], ' +
    'integrando perfiles Senior para garantizar escalabilidad, mantenibilidad y mejores prácticas.';

  // Configuración de tabla principal de ítems
  baseColumnLabels = {
    name: 'Producto / Servicio',
    quantity: 'Cantidad',
    unitPrice: 'Valor unitario (COP)',
    total: 'Subtotal (COP)'
  };

  extraColumns: string[] = [];

  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    extras: Record<string, string>;
  }[] = [
    { name: 'Desarrollo Backend', quantity: 40, unitPrice: 185000, extras: {} },
    { name: 'Desarrollo Frontend', quantity: 40, unitPrice: 165000, extras: {} }
  ];

  applyIva = true;
  ivaPercentage = 19;

  commercialConditions: string[] = [
    'Forma de pago: 50% anticipo y 50% contra entrega, salvo acuerdo diferente entre las partes.',
    'Los precios indicados son más IVA (19%) si aplica de acuerdo con la normatividad vigente.',
    'Jornada de trabajo: Lunes a Viernes en horario de oficina (8:00 a.m. a 6:00 p.m.).',
    'Las horas extra se facturan con un recargo del 30% sobre la tarifa base.',
  ];

  // Datos de factura
  invoice = {
    number: 'FAC-001',
    issueDate: new Date().toISOString().substring(0, 10),
    dueDate: this.computeDueDate(31)
  };

  invoiceItems: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[] = [
    { description: 'Tareas de teaching assistant durante el mes de diciembre (en horas)', quantity: 12, unitPrice: 10.00 }
  ];

  invoiceIvaPercentage = 0;
  invoiceNote = 'Operación exenta de IVA por tratarse de una exportación de servicios desde Colombia.';

  clientIdType: 'NIF' | 'NIT' | 'CIF' = 'CIF';
  currency: 'USD' | 'EUR' | 'COP' = 'EUR';
  paymentTitle = 'DATOS DE PAGO - GLOBAL66 - Transferencia SEPA en EUR';

  paymentDetails = {
    bank: 'The Currency Cloud Limited',
    beneficiary: this.company.name,
    iban: 'GB79TCCL00997938524202',
    bic: 'TCCLGB21'
  };

  get subtotal(): number {
    return this.items.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      0
    );
  }

  get taxAmount(): number {
    if (!this.applyIva) {
      return 0;
    }
    return (this.subtotal * Number(this.ivaPercentage || 0)) / 100;
  }

  get total(): number {
    return this.subtotal + this.taxAmount;
  }

  onValidityDaysChange(): void {
    const days = Number(this.quote.validityDays) || 0;
    this.quote.validityDate = this.computeValidityDate(days);
  }

  addItemRow(): void {
    this.items.push({
      name: '',
      quantity: 1,
      unitPrice: 0,
      extras: {}
    });
  }

  removeItemRow(index: number): void {
    if (this.items.length <= 1) {
      return;
    }
    this.items.splice(index, 1);
  }

  addExtraColumn(): void {
    const defaultName = `Columna ${this.extraColumns.length + 1}`;
    this.extraColumns.push(defaultName);
  }

  removeExtraColumn(index: number): void {
    this.extraColumns.splice(index, 1);
    // Limpiar valores de esa columna en cada fila
    const columnKey = this.extraColumns[index];
    this.items.forEach((item) => {
      if (columnKey && item.extras[columnKey]) {
        delete item.extras[columnKey];
      }
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Manejo de logo de empresa
  private readonly maxLogoSizeBytes = 2 * 1024 * 1024; // 2MB

  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.handleLogoFile(file);
    // Limpia el input para permitir volver a cargar el mismo archivo si se desea
    input.value = '';
  }

  onLogoDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onLogoDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files?.[0];
    if (!file) {
      return;
    }
    this.handleLogoFile(file);
  }

  private handleLogoFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      alert('Por favor adjunta solo archivos de imagen (PNG, JPG, SVG, etc.).');
      return;
    }

    if (file.size > this.maxLogoSizeBytes) {
      alert('El logo es muy pesado. Tamaño máximo permitido: 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.company.logoUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private computeValidityDate(days: number): string {
    const base = new Date();
    const result = new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
    return result.toISOString().substring(0, 10);
  }

  private computeDueDate(days: number): string {
    const base = new Date();
    const result = new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
    return result.toISOString().substring(0, 10);
  }

  onInvoiceDueDateChange(): void {
    // Puedes agregar lógica aquí si es necesario
  }

  get invoiceSubtotal(): number {
    return this.invoiceItems.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      0
    );
  }

  get invoiceTaxAmount(): number {
    return (this.invoiceSubtotal * Number(this.invoiceIvaPercentage || 0)) / 100;
  }

  get invoiceTotal(): number {
    return this.invoiceSubtotal + this.invoiceTaxAmount;
  }

  get currencySymbol(): string {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'COP': '$'
    };
    return symbols[this.currency] || '';
  }

  updatePaymentTitle(): void {
    this.paymentTitle = `DATOS DE PAGO - Transferencia SEPA en ${this.currency}`;
    // Actualizar el título automáticamente si el usuario no lo ha personalizado
    if (this.paymentTitle.includes('SEPA')) {
      // Solo actualizar si aún tiene el formato por defecto
    }
  }

  addInvoiceItem(): void {
    this.invoiceItems.push({
      description: '',
      quantity: 1,
      unitPrice: 0
    });
  }

  removeInvoiceItem(index: number): void {
    if (this.invoiceItems.length <= 1) {
      return;
    }
    this.invoiceItems.splice(index, 1);
  }

  async generatePdf(): Promise<void> {
    const element = this.activeTab === 'quote'
      ? this.quotePreviewRef?.nativeElement
      : this.invoicePreviewRef?.nativeElement;

    if (!element) return;

    // Esperar a que las fuentes se carguen antes de generar el PDF
    await this.waitForFonts();

    // Intentar usar html2pdf.js que puede tener mejor soporte
    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: [0, 0, 0, 0] as [number, number, number, number],
        filename: this.getPdfFileName(),
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true, // Mejor renderizado de texto
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait' as const,
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: ['tr', 'td', 'th']
        }
      };

      await html2pdf().set(opt).from(element).save();
      return;
    } catch (error) {
      console.warn('html2pdf.js no disponible, usando método alternativo:', error);
    }

    // Fallback: método original con html2canvas + jsPDF
    // NOTA: Este método genera una imagen, por lo que el texto NO es seleccionable
    // Para texto completamente seleccionable, se recomienda usar Puppeteer en un backend
    // Ver archivo: backend-puppeteer-example.js para un ejemplo de implementación
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    } as any);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const calculatedHeight = (canvas.height * pdfWidth) / canvas.width;

    // Si el contenido cabe en una página, usar solo una página
    if (calculatedHeight <= pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, calculatedHeight);
    } else {
      // Si el contenido es más grande, dividirlo en múltiples páginas
      let heightLeft = calculatedHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - calculatedHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
        heightLeft -= pdfHeight;
      }
    }

    pdf.save(this.getPdfFileName());
  }

  private async waitForFonts(): Promise<void> {
    // Esperar a que las fuentes de Google Fonts se carguen
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
        // Esperar un poco más para asegurar que las fuentes estén completamente cargadas
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn('Error esperando fuentes:', error);
      }
    } else {
      // Fallback: esperar un tiempo fijo si document.fonts no está disponible
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private getPdfFileName(): string {
    if (this.activeTab === 'invoice') {
      const rawNumber = (this.invoice.number ?? '').toString().trim();
      const numericPart = rawNumber.replace(/\D/g, '') || '0';
      const paddedNumber = numericPart.slice(-3).padStart(3, '0');

      const baseCompany =
        (this.client.company || this.client.name || 'Cliente')
          .toString()
          .trim() || 'Cliente';

      const companySlug = baseCompany
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toUpperCase();

      return `factura-JOBTY-${companySlug || 'CLIENTE'}-${paddedNumber}.pdf`;
    } else {
      const rawNumber = (this.quote.number ?? '').toString().trim();
      const numericPart = rawNumber.replace(/\D/g, '') || '0';
      const paddedNumber = numericPart.slice(-3).padStart(3, '0');

      const baseCompany =
        (this.client.company || this.client.name || 'Cliente')
          .toString()
          .trim() || 'Cliente';

      const companySlug = baseCompany
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toUpperCase();

      return `cotizacion-JOBTY-${companySlug || 'CLIENTE'}-${paddedNumber}.pdf`;
    }
  }
}
