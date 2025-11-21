import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild('previewRef') previewRef!: ElementRef<HTMLDivElement>;

  protected readonly title = signal('Generador de cotizaciones');

  // Datos de la empresa
  company = {
    nombre: 'Tu Empresa S.A.S.',
    nit: '900.000.000-1',
    direccion: 'Calle 123 #45-67, Bogotá D. C.',
    telefono: '+57 320 000 0000',
    email: 'contacto@tuempresa.com',
    logoUrl: ''
  };

  // Datos del cliente
  client = {
    nombre: 'Nombre del Cliente',
    empresa: 'Empresa del Cliente',
    contacto: 'Persona de contacto',
    direccion: 'Dirección del cliente'
  };

  // Metadatos de la cotización
  quoteMeta = {
    numero: 'COT-2025-001',
    fecha: new Date().toISOString().substring(0, 10),
    validezDias: 15
  };

  resumenEjecutivo = `Provisión de servicios de desarrollo de software especializado para [Nombre del Proyecto], integrando perfiles Senior para garantizar escalabilidad, calidad y mejores prácticas en la construcción del producto.`;

  // Configuración de columnas de la tabla principal
  tableColumns = [
    { key: 'perfil', label: 'Perfil' },
    { key: 'seniority', label: 'Seniority' },
    { key: 'tecnologias', label: 'Tecnologías' },
    { key: 'tipo', label: 'Modalidad (Hora / Mensual)' },
    { key: 'cantidad', label: 'Cantidad (horas / mes)' },
    { key: 'tarifa', label: 'Tarifa (COP)' },
    { key: 'total', label: 'Total (COP)' }
  ] as const;

  // Items de la cotización
  items: Array<{
    perfil: string;
    seniority: string;
    tecnologias: string;
    tipo: 'hora' | 'mensual';
    cantidad: number;
    tarifa: number;
  }> = [
    {
      perfil: 'Desarrollador Backend',
      seniority: 'Senior',
      tecnologias: 'Node.js, AWS, SQL',
      tipo: 'hora',
      cantidad: 40,
      tarifa: 185000
    },
    {
      perfil: 'Desarrollador Frontend',
      seniority: 'Senior',
      tecnologias: 'Angular, Tailwind',
      tipo: 'hora',
      cantidad: 40,
      tarifa: 165000
    }
  ];

  condicionesComerciales = [
    'Forma de pago: 50% de anticipo y 50% contra entrega, o pagos mensuales si el proyecto es de larga duración.',
    'Los valores presentados son más IVA (19%) en caso de aplicar.',
    'Jornada de trabajo: Lunes a Viernes, horario de oficina.',
    'Las horas extra se cobran con un recargo del 30% sobre la tarifa base.'
  ];

  get fechaValidez(): string {
    const fecha = new Date(this.quoteMeta.fecha);
    const result = new Date(fecha.getTime());
    result.setDate(result.getDate() + Number(this.quoteMeta.validezDias || 0));
    return result.toISOString().substring(0, 10);
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + this.calcularTotalItem(item), 0);
  }

  get impuestos(): number {
    return this.subtotal * 0.19;
  }

  get total(): number {
    return this.subtotal + this.impuestos;
  }

  trackByIndex(index: number): number {
    return index;
  }

  agregarItem(): void {
    this.items.push({
      perfil: '',
      seniority: '',
      tecnologias: '',
      tipo: 'hora',
      cantidad: 0,
      tarifa: 0
    });
  }

  eliminarItem(index: number): void {
    if (this.items.length === 1) return;
    this.items.splice(index, 1);
  }

  calcularTotalItem(item: { cantidad: number; tarifa: number }): number {
    const cantidad = Number(item.cantidad || 0);
    const tarifa = Number(item.tarifa || 0);
    return cantidad * tarifa;
  }

  async descargarPdf(): Promise<void> {
    if (!this.previewRef) return;

    const element = this.previewRef.nativeElement;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const nombreBase = this.client.empresa || this.client.nombre || 'cotizacion';
    pdf.save(`${nombreBase.replace(/\s+/g, '_').toLowerCase()}_software.pdf`);
  }
}
