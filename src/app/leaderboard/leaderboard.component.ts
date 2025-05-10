import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { NgZone } from '@angular/core';

import { atletaConverter } from '../atleta.converter';
import { Atleta } from '../model/Atleta';
import { RouterModule } from '@angular/router';
import { PontuacaoComponent } from '../pontuacao/pontuacao.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PontuacaoComponent],
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

  provaSelecionada: string = '';
  categoriaSelecionada: string = 'Iniciante masculino';


mostrarCodigo = false;

alternarVisibilidadeCodigo() {
  this.mostrarCodigo = !this.mostrarCodigo;
}



codigoDigitado = '';


codigo: string = '';
erroCodigo: string = '';
mostrarModalSenha: boolean = false;
mostrarModalPontuacao: boolean = false;



abrirModalSenha() {
  this.codigoDigitado = '';
  this.erroCodigo = '';
  this.mostrarModalSenha = true;
}

validarCodigo() {
  if (this.codigoDigitado === '534228') {
    this.mostrarModalSenha = false;
    this.mostrarModalPontuacao = true;
    this.erroCodigo = '';
  } else {
    this.erroCodigo = 'Código inválido!';
  }
}





abrirModalPontuacao() {
  this.mostrarModalPontuacao = true;
}

fecharModalPontuacao() {
  this.mostrarModalPontuacao = false;
}


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

        const provasOrdenadas = Array.from(provasSet).sort((a, b) => a.localeCompare(b));
        this.provasDisponiveis = ['Total', ...provasOrdenadas];
        this.categoriasDisponiveis = Array.from(categoriasSet);

        // Definir os valores padrão após as opções estarem disponíveis
        this.provaSelecionada = 'Total';
        this.categoriaSelecionada = 'Iniciante masculino';

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
        const categoriaConfere = this.categoriaSelecionada
          ? atleta.categoria === this.categoriaSelecionada
          : true;

        if (this.provaSelecionada === 'Total') return categoriaConfere;

        const provaExiste = atleta.provas && atleta.provas[this.provaSelecionada];
        return provaExiste && categoriaConfere;
      })
      .sort((a, b) => {
        const pontosA = this.provaSelecionada === 'Total'
          ? this.getSomaPontos(a.provas)
          : a.provas?.[this.provaSelecionada]?.pontuacao || 0;
        const pontosB = this.provaSelecionada === 'Total'
          ? this.getSomaPontos(b.provas)
          : b.provas?.[this.provaSelecionada]?.pontuacao || 0;

        return pontosB - pontosA;
      });
  }
}
