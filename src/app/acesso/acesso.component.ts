import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-acesso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.scss']
})
export class AcessoComponent {
  codigo = '';
  erro = '';
  destino = 'pontuacao';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['destino']) this.destino = params['destino'];
    });
  }

  entrar() {
    if (this.codigo === 'crossbull2025') {
      this.router.navigate(['/' + this.destino]);
    } else {
      this.erro = 'Código inválido!';
    }
  }
}
