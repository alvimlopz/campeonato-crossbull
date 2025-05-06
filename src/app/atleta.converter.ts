import { FirestoreDataConverter, DocumentData } from 'firebase/firestore';
import { Atleta } from './model/Atleta';

export const atletaConverter: FirestoreDataConverter<Atleta> = {
  toFirestore(atleta: Atleta): DocumentData {
    return { ...atleta };
  },
  fromFirestore(snapshot, options): Atleta {
    const data = snapshot.data(options) as DocumentData;
    return {
      nome: data['nome'],
      categoria: data['categoria'],
      provas: data['provas'] // <-- aqui era 'prova', mas o correto é 'provas'
    };
  }
};
