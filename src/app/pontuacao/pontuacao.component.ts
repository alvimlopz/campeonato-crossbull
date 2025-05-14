import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pontuacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pontuacao.component.html',
  styleUrl: './pontuacao.component.scss'
})
export class PontuacaoComponent {
  minutos: number = 0;
  segundos: number = 0;
  pontuacao: number | null = null;

  pesoPR: number = 0;
pontuacaoPR: number | null = null;

pesoMaximoReferencia = 200;

  calcularPontuacao(): void {
  const totalSegundos = this.minutos * 60 + this.segundos;

  // Tabela de pontos por minuto (1 a 10)
  const tabela: { [minuto: number]: number } = {
    1: 1000,
    2: 900,
    3: 800,
    4: 700,
    5: 600,
    6: 500,
    7: 400,
    8: 300,
    9: 200,
    10: 100
  };

  

  // Se for abaixo de 1 minuto, recebe 100
  if (totalSegundos <= 60) {
    this.pontuacao = 100;
    return;
  }

  const minutoAtual = this.minutos;
  const proximoMinuto = minutoAtual + 1;

  const p1 = tabela[minutoAtual] ?? 0;
  const p2 = tabela[proximoMinuto] ?? 0;

  const proporcao = this.segundos / 60;
  const pontosInterpolados = p1 - ((p1 - p2) * proporcao);

  this.pontuacao = Math.round(pontosInterpolados);
}

roundsCompletos: number = 0;
shutterRunParcial: number = 0;
powerCleanParcial: number = 0;
pontuacaoRounds: number | null = null;

// Pontuação total máxima por 1 round completo (ajustável)
pontosPorRound = 100;

calcularPontuacaoRounds(): void {
  const movimentosPorRound = 6 + 20; // 26 movimentos totais

  const totalCompletos = this.roundsCompletos * movimentosPorRound;
  const totalParcial = Math.min(this.shutterRunParcial, 6) + Math.min(this.powerCleanParcial, 20);
  const totalMovimentos = totalCompletos + totalParcial;

  const pontuacaoPorMovimento = this.pontosPorRound / movimentosPorRound;
  this.pontuacaoRounds = Math.round(pontuacaoPorMovimento * totalMovimentos);
}

devilPressQuantidade: number = 0;
pontuacaoTotalComDevilPress: number | null = null;

calcularPontuacaoComDevilPress(): void {
  const basePontuacao = this.pontuacao ?? 0; // se não tiver calculado tempo ainda, considera 0
  const devilPress = this.devilPressQuantidade ?? 0;

  this.pontuacaoTotalComDevilPress = basePontuacao + devilPress;
}

limparCampos(): void {
  this.minutos = 0;
  this.segundos = 0;
  this.pontuacao = null;
  this.pesoPR = 0;
  this.pontuacaoPR = null;
}


calcularPontuacaoPR(): void {
  if (this.pesoPR <= 0) {
    this.pontuacaoPR = 0;
    return;
  }

  const proporcao = Math.min(this.pesoPR / this.pesoMaximoReferencia, 1);
  this.pontuacaoPR = Math.round(proporcao * 1000);
}


}
