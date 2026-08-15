import React, { useRef, useEffect, useState } from 'react';
import type { CustomerFromProps } from '../types/customer.type';
import type { UbigeoItem } from '@/modules/ubigeo/services/ubigeo.service';
import { useCustomerForm } from '../hooks/userCustomerFrom'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { UbigeoFrom } from "@/modules/ubigeo/UbigeoFrom";

export default function CustomerForm({ isOpen, onClose, onSubmit, initialData, isProcessing }: CustomerFromProps) {
    const {
        descripcion, setDescripcion,
        ruc, setRuc,
        direccion, setDireccion,
        ubigeo, setUbigeo,
        ubigeoLabel, setUbigeoLabel,
        contacto, setContacto,
        email, setEmail,
        telefono, setTelefono,
        user, setUser,
        password, setPassword,
        isEmailValid,
        isFormValid,
        rucExists,
        isValidatingRuc,
    } = useCustomerForm(initialData, isOpen);

    // Referencias para el control del foco
    const descripcionRef = useRef<HTMLInputElement>(null);
    const rucRef = useRef<HTMLInputElement>(null);
    const direccionRef = useRef<HTMLInputElement>(null);
    const ubigeoRef = useRef<HTMLInputElement>(null);
    const contactoRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const telefonoRef = useRef<HTMLInputElement>(null);
    const userRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const submitBtnRef = useRef<HTMLButtonElement>(null);

    // Forzar foco en el primer campo al abrir
    useEffect(() => {
        if (isOpen) {
            // Un pequeño delay asegura que el Dialog esté renderizado en el DOM
            setTimeout(() => rucRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const [isUbigeoOpen, setIsUbigeoOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFormValid) {
            const normalizedPhone = telefono.replace(/\D/g, '');
            onSubmit({ descripcion, ruc, direccion, ubigeo, contacto, email, telefono: normalizedPhone, user, password, status: true });
        }
    };

    const handleUbigeoSelect = (item: UbigeoItem) => {
        setUbigeo(item.codigo.trim());
        setUbigeoLabel(`${item.departamento} - ${item.provincia} - ${item.distrito}`);
        setIsUbigeoOpen(false);
    };

    const formatPhoneNumber = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 9);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }

    const handleKeyDown = (
        e: React.KeyboardEvent,
        nextRef: { current: HTMLElement | null }
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            nextRef.current?.focus();
        }
    };

    return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border-none bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight text-zinc-1000 uppercase">
            {initialData ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-xs">
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
            <Label htmlFor="ruc" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">RUC</Label>
            <Input
              ref={rucRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={11}
              id="ruc"
              value={ruc}
              onChange={(e) => setRuc(e.target.value.replace(/\D/g, '').slice(0, 11))}
              onKeyDown={(e) => handleKeyDown(e, descripcionRef)}
              className={`rounded-xl ${rucExists ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-red-600'} bg-white focus:ring-red-600/10 h-9`}
              required
            />
            {ruc !== '' && ruc.length !== 11 && (
              <p className="text-[10px] text-red-500 ml-1 font-bold uppercase tracking-tighter">
                El RUC debe tener 11 dígitos numéricos.
              </p>
            )}
            {ruc.startsWith('0') && (
              <p className="text-[10px] text-red-500 ml-1 font-bold uppercase tracking-tighter">
                El RUC no puede comenzar con 0.
              </p>
            )}
            {rucExists && (
              <p className="text-[10px] text-red-500 ml-1 font-bold uppercase tracking-tighter">
                Este RUC ya existe en el sistema.
              </p>
            )}
            {isValidatingRuc && ruc.length === 11 && !ruc.startsWith('0') && (
              <p className="text-[10px] text-amber-600 ml-1 font-bold uppercase tracking-tighter">
                Validando RUC...
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="descripcion" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Descripcion</Label>
            <Input
              ref={descripcionRef}
              type="text"
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, direccionRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              required
            />
          </div>



          <div className="space-y-1">
            <Label htmlFor="direccion" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Dirección</Label>
            <Input
              ref={direccionRef}
              type="text"
              id="direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, ubigeoRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              required
            />
          </div>

        <div className="space-y-1">
            <Label htmlFor="ubigeo" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Ubigeo</Label>
            <Input
              ref={ubigeoRef}
              type="text"
              id="ubigeo"
              value={ubigeoLabel || ubigeo}
              readOnly
              onClick={() => setIsUbigeoOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setIsUbigeoOpen(true);
                }
              }}
              className="cursor-pointer rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              placeholder="Haz clic para seleccionar ubigeo"
              required
            />
          </div>
          <UbigeoFrom
            open={isUbigeoOpen}
            onOpenChange={setIsUbigeoOpen}
            onSelect={handleUbigeoSelect}
          />

          <div className="space-y-1">
            <Label htmlFor="contacto" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Contacto</Label>
            <Input
              ref={contactoRef}
              type="text"
              id="contacto"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              required
            />
          </div>
          

          <div className="space-y-1">
            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email</Label>
            <Input
              ref={emailRef}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, telefonoRef)}
              className={`rounded-xl ${!isEmailValid && email !== '' ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-red-600'} bg-white focus:ring-red-600/10 h-9`}
              required
            />
            {!isEmailValid && email !== '' && (
              <p className="text-[10px] text-red-500 ml-1 font-bold uppercase tracking-tighter">Email inválido</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="telefono" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Teléfono</Label>
            <Input
              ref={telefonoRef}
              type="text"
              inputMode="numeric"
              id="telefono"
              value={telefono}
              maxLength={11}
              onChange={(e) => setTelefono(formatPhoneNumber(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, userRef)}
              className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
              placeholder="123 456 789"
              required
            />
            {telefono !== '' && telefono.replace(/\D/g, '').length !== 9 && (
              <p className="text-[10px] text-red-500 ml-1 font-bold uppercase tracking-tighter">El teléfono debe tener 9 dígitos</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="user" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Usuario</Label>
              <Input
                ref={userRef}
                type="text"
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Contraseña</Label>
              <Input
                ref={passwordRef}
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, submitBtnRef)}
                className="rounded-xl border-zinc-200 bg-white focus:border-red-600 focus:ring-red-600/10 h-9"
                required
              />
            </div>
          </div>         

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="rounded-xl border-zinc-200 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-zinc-50 active:scale-95 h-10"
            >
              Cancelar
            </Button>
            <Button
              ref={submitBtnRef}
              type="submit"
              disabled={!isFormValid || isProcessing || isValidatingRuc}
              className="rounded-xl bg-red-600 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-red-600/40 active:scale-95 disabled:opacity-30 h-10 w-25 px-8"
            >
              {isProcessing ? (initialData ? 'Actualizando...' : 'Guardando...') : (initialData ? 'Actualizar' : 'Guardar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    );
}