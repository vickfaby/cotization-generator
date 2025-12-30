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

  company = {
    name: 'Milenio Digital',
    nit: '900.000.000-1',
    address: 'Calle 123 # 45-67',
    city: 'Bogotá D. C.',
    phone: '+57 300 000 0000',
    email: 'contacto@empresa.com',
    logoUrl: ''
  };

  client = {
    name: 'Nombre del Cliente',
    company: 'Empresa del Cliente',
    nit: 'NIT del Cliente',
    address: 'Dirección del Cliente',
    city: 'Ciudad',
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
    dueDate: this.computeDueDate(7)
  };

  invoiceItems: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[] = [
    { description: 'Servicios profesionales de desarrollo de software', quantity: 1, unitPrice: 2000 }
  ];

  invoiceIvaPercentage = 0;
  invoiceNote = 'Operación exenta de IVA por tratarse de una exportación de servicios desde Colombia.';

  clientIdType: 'NIF' | 'NIT' | 'CIF' = 'NIF';
  currency: 'USD' | 'EUR' | 'COP' = 'EUR';
  paymentTitle = 'DATOS DE PAGO - Transferencia SEPA en EUR';

  paymentDetails = {
    bank: 'Banking Circle S.A.',
    beneficiary: this.company.name,
    iban: 'LU93 1234 5678 9012 3456',
    bic: 'BKCILULL'
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
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const element = this.activeTab === 'quote'
      ? this.quotePreviewRef?.nativeElement
      : this.invoicePreviewRef?.nativeElement;

    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 } as any);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(this.getPdfFileName());
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
