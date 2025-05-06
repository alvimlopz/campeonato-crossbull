import { Prova } from "./Prova";


export interface Atleta {
  nome: string;
  categoria: string;
  provas?: {
    [key: string]: {
      tempo: string;
      pontuacao: number;
    }
  };
}



export interface AtletaComId extends Atleta {
  id: string;
}
