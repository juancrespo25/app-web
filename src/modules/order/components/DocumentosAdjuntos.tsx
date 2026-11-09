import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { FilePlus2, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DocumentoAdjunto } from "@/modules/guia/types/guia.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const tiposDocumento = [
  { id: "1", nombre: "Factura" },
  { id: "2", nombre: "Boleta" },
  { id: "3", nombre: "Guía de Remisión" },
  { id: "4", nombre: "Guía" },
  { id: "5", nombre: "Orden de Servicio" },
  { id: "6", nombre: "Otro" },
];

interface DocumentoAdjuntoRow extends DocumentoAdjunto {
  id: number;
}

interface DocumentosAdjuntosProps {
  documentos: DocumentoAdjuntoRow[];
  setDocumentos: Dispatch<SetStateAction<DocumentoAdjuntoRow[]>>;
  disabled?: boolean;
}

export default function DocumentosAdjuntos({ documentos, setDocumentos, disabled }: DocumentosAdjuntosProps) {
  const [tipo, setTipo] = useState("");
  const [numero, setNumero] = useState("");
  const [error, setError] = useState("");
  const siguienteId = useRef(1);
  const tipoRef = useRef<HTMLSelectElement>(null);
  const numeroRef = useRef<HTMLInputElement>(null);

  const agregarDocumento = () => {
    const numeroLimpio = numero.trim();
    const tipoSeleccionado = tiposDocumento.find((item) => item.id === tipo);

    if (!tipoSeleccionado || !numeroLimpio) {
      setError("Seleccione un tipo e ingrese el número del documento.");
      return;
    }

    const id = siguienteId.current;
    siguienteId.current += 1;
    setDocumentos((actuales) => [
      ...actuales,
      { id, numero: numeroLimpio, tipo: Number(tipoSeleccionado.id) },
    ]);
    setNumero("");
    setTipo("");
    setError("");
    tipoRef.current?.focus();
  };

  return (
    <Dialog>
      <div className="flex shrink-0 flex-col items-center gap-1">
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-label={`Documentos adjuntos (${documentos.length})`}
            className="h-10 gap-2 rounded-xl border-zinc-300 bg-white! px-3 text-slate-700 hover:border-red-300 hover:bg-red-50! hover:text-red-700"
          >
            <FilePlus2 className="h-4 w-4" />
            <span className="hidden text-xs font-semibold sm:inline">Documentos</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
              {documentos.length}
            </span>
          </Button>
        </DialogTrigger>
        <span className="text-center text-[10px] text-slate-500">Pendientes de grabar</span>
      </div>
      <DialogContent className="w-[calc(100%-2rem)] max-w-xl rounded-2xl p-0 overflow-hidden bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-slate-900">
              Documentos adjuntos
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-slate-500">
              Registre los números de documentos relacionados con la guía.
            </DialogDescription>
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Los documentos se enviarán al grabar la orden o guía. Se descartarán si cierra el formulario sin grabar.
          </p>

          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tipo-documento-adjunto" className="text-xs font-bold uppercase text-slate-700">
                  Tipo de documento
                </Label>
                <select
                  ref={tipoRef}
                  id="tipo-documento-adjunto"
                  value={tipo}
                  onChange={(event) => {
                    const selectedTipo = event.target.value;
                    setTipo(selectedTipo);
                    setError("");
                    if (selectedTipo) numeroRef.current?.focus();
                  }}
                  className="h-9 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10"
                >
                  <option value="">Seleccionar tipo</option>
                  {tiposDocumento.map((item) => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="numero-documento-adjunto" className="text-xs font-bold uppercase text-slate-700">
                  Número
                </Label>
                <Input
                  ref={numeroRef}
                  id="numero-documento-adjunto"
                  value={numero}
                  onChange={(event) => { setNumero(event.target.value); setError(""); }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                      event.preventDefault();
                      agregarDocumento();
                    }
                  }}
                  placeholder="Ingrese el número"
                  className="rounded-xl border-zinc-200 text-sm focus-visible:border-red-600 focus-visible:ring-red-600/10"
                />
              </div>
            </div>
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
            <p className="text-xs text-slate-500">Presione Enter en el número para agregar el documento.</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="max-h-56 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="w-16 px-4 text-xs font-bold uppercase text-slate-600">ID</TableHead>
                    <TableHead className="px-4 text-xs font-bold uppercase text-slate-600">Número</TableHead>
                    <TableHead className="px-4 text-xs font-bold uppercase text-slate-600">Tipo</TableHead>
                    <TableHead className="w-12"><span className="sr-only">Acciones</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-4 py-6 text-center text-sm text-slate-400">
                        Aún no hay documentos agregados.
                      </TableCell>
                    </TableRow>
                  ) : documentos.map((documento) => (
                    <TableRow key={documento.id}>
                      <TableCell className="px-4 text-slate-500">{documento.id}</TableCell>
                      <TableCell className="max-w-48 truncate px-4 font-medium text-slate-700">{documento.numero}</TableCell>
                      <TableCell className="px-4 text-slate-600">{tiposDocumento.find((item) => Number(item.id) === documento.tipo)?.nombre}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Eliminar documento ${documento.numero}`}
                          onClick={() => setDocumentos((actuales) => actuales.filter((item) => item.id !== documento.id))}
                          className="h-8 w-8 text-slate-400 hover:bg-red-50! hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
