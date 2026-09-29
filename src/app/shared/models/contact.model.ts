import { Metadata } from "./utilities/metadata.model";

export interface Contact extends Metadata {
  nombre: string;
  email: string;
  telefono: string;
  estado: string;
  tipoPersona: string;
  servicio: string;
  solicitaPreautorizacion: boolean;
  rfc: string;
  descripcionFinanciamiento: string;
}
