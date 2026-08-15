import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUbigeoSearch } from './hooks/useUbigeoSearch';
import type { UbigeoItem } from './types/ubigeo.type';

interface UbigeoFromProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: UbigeoItem) => void;
}

export function UbigeoFrom({ open, onOpenChange, onSelect }: UbigeoFromProps) {
  const [search, setSearch] = useState('');
  const { results, isLoading, error, searchUbigeo } = useUbigeoSearch();

  const handleSelect = (item: UbigeoItem) => {
    onSelect(item);
    setSearch('');
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    if (search.trim().length >= 3) {
      await searchUbigeo(search);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl border-none bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight text-zinc-1000 uppercase">Ubigeo</DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs">Escribe al menos 3 caracteres y presiona Enter para buscar.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="ubigeo-search" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Buscar ubigeo
            </Label>
            <div>
              <Input
                id="ubigeo-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={handleKeyDown}
                className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9 w-full"
                placeholder="Ingresa código, departamento, provincia o distrito"
              />
            </div>
            {isLoading && <p className="text-[10px] text-zinc-500 ml-1">Cargando resultados...</p>}
            {error && <p className="text-[10px] text-red-500 ml-1">{error}</p>}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="max-h-[50vh] overflow-y-auto">
              <Table className="min-w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-zinc-100 text-xs uppercase tracking-wider text-zinc-600">Código</TableHead>
                    <TableHead className="bg-zinc-100 text-xs uppercase tracking-wider text-zinc-600">Departamento</TableHead>
                    <TableHead className="bg-zinc-100 text-xs uppercase tracking-wider text-zinc-600">Provincia</TableHead>
                    <TableHead className="bg-zinc-100 text-xs uppercase tracking-wider text-zinc-600">Distrito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((item) => (
                    <TableRow
                      key={item.codigo}
                      className="cursor-pointer hover:bg-zinc-50"
                      onClick={() => handleSelect(item)}
                    >
                      <TableCell className="px-3 py-2 text-sm">{item.codigo.trim()}</TableCell>
                      <TableCell className="px-3 py-2 text-sm">{item.departamento}</TableCell>
                      <TableCell className="px-3 py-2 text-sm">{item.provincia}</TableCell>
                      <TableCell className="px-3 py-2 text-sm">{item.distrito}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UbigeoFrom;
