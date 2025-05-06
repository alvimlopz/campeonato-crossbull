import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { NgZone } from '@angular/core';


import { atletaConverter } from '../atleta.converter';
import { Atleta } from '../model/Atleta';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  private ngZone: NgZone = inject(NgZone);

  

  dados: Atleta[] = [];
  dadosFiltrados: Atleta[] = [];

  provasDisponiveis: string[] = [];
  categoriasDisponiveis: string[] = [];

  provaSelecionada: string = 'prova 1';
  categoriaSelecionada: string = 'Iniciante masculino';

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    const atletasRef = collection(this.firestore, 'atletas').withConverter(atletaConverter);

    collectionData(atletasRef).subscribe((res: Atleta[]) => {
      this.ngZone.run(() => {
        this.dados = res;

        const provasSet = new Set<string>();
        const categoriasSet = new Set<string>();

        res.forEach(atleta => {
          if (atleta.provas) {
            Object.keys(atleta.provas).forEach(nomeProva => {
              provasSet.add(nomeProva);
            });
          }

          categoriasSet.add(atleta.categoria);
        });

        this.provasDisponiveis = Array.from(provasSet);
        this.categoriasDisponiveis = Array.from(categoriasSet);

        this.filtrar();
      });
    });
  }

  getSomaPontos(provas: { [key: string]: { tempo: string; pontuacao: number } } | undefined): number {
    if (!provas) return 0;
  
    return Object.values(provas)
      .map(p => p.pontuacao || 0)
      .reduce((acc, curr) => acc + curr, 0);
  }
  

  getSomaTempos(provas: { [key: string]: { tempo: string; pontuacao: number } } | undefined): string {
    if (!provas) return '---';
  
    let totalSegundos = 0;
  
    Object.values(provas).forEach(prova => {
      if (prova.tempo && prova.tempo.includes(':')) {
        const [min, seg] = prova.tempo.split(':').map(Number);
        totalSegundos += (min * 60) + seg;
      }
    });
  
    const minutosTotais = Math.floor(totalSegundos / 60);
    const segundosRestantes = totalSegundos % 60;
  
    const segundosFormatado = segundosRestantes < 10 ? `0${segundosRestantes}` : segundosRestantes;
  
    return `${minutosTotais}:${segundosFormatado}`;
  }
  
  

  filtrar(): void {
    this.dadosFiltrados = this.dados
      .filter(atleta => {
        const provaExiste = this.provaSelecionada
          ? atleta.provas && atleta.provas[this.provaSelecionada]
          : true;
        const categoriaConfere = this.categoriaSelecionada
          ? atleta.categoria === this.categoriaSelecionada
          : true;
        return provaExiste && categoriaConfere;
      })
      .sort((a, b) => {
        const pontosA = this.provaSelecionada
          ? a.provas?.[this.provaSelecionada]?.pontuacao || 0
          : this.getSomaPontos(a.provas);
        const pontosB = this.provaSelecionada
          ? b.provas?.[this.provaSelecionada]?.pontuacao || 0
          : this.getSomaPontos(b.provas);
        return pontosB - pontosA;
      });
  }


  
}
