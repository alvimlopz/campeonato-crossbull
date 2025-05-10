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



limparCampos(): void {
  this.minutos = 0;
  this.segundos = 0;
  this.pontuacao = null;
}


}
