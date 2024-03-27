import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  apareceTabla = false;
  anioActual = 2024;
  arrayRespuesta = [];
  tipo = '';
  aparecetotal = false;
  total = 0;
  inputteclado = '';
  habilitatecladovirtual = false;

  miFormulario!: FormGroup;
  ngOnInit(): void {
    console.log("version 2")
    this.crearFormulario();
  }
  crearFormulario() {
    console.log('Crear formulario22');
    this.miFormulario = this.formBuilder.group({
      fcncedula: [''],
    });
  }

  constructor(
    private router: Router,
    private service: HomeService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {}

  seleccioneTipoDocumento(event: any) {
    console.log(event.target.value);
    this.tipo = event.target.value;
  }
  verDetalle() {
    if (this.apareceTabla == true) {
      this.apareceTabla = false;
    } else {
      this.apareceTabla = true;
    }
  }
  nuevaConsulta() {
    location.reload();
  }
  buscarporciu(ciu: any) {
    this.service.getDatabyCIU(ciu).subscribe({
      next: (resp) => {
        console.log('****respuesta ciu**');

        this.arrayRespuesta = resp['items'];
        console.log(this.arrayRespuesta);
      },
      error: (error) => {
        // En caso de error, puedes manejarlo aquí
        console.error('Error al obtener la respuesta:', error);
        console.error('Error al obtener la respuesta:', error.status);
      },
    });
  }
  buscarporcedula(cedula: any) {
    this.service.getDatabyCi(cedula).subscribe({
      next: (resp) => {
        console.log('****respuesta cedula**');

        console.log(resp);
        this.arrayRespuesta = resp['items'];
      },
      error: (error) => {
        // En caso de error, puedes manejarlo aquí
        console.error('Error al obtener la respuesta:', error);
        console.error('Error al obtener la respuesta:', error.status);
      },
    });
  }

  async consultar() {
    console.log('_________' + this.miFormulario.value.fcncedula);
    console.log('_________' + this.tipo);
    this.total = 0;
    this.spinner.show();
    if (this.tipo == 'CEDULA' || this.tipo == 'CIU') {
      
        this.arrayRespuesta = [];
        if (this.tipo == 'CEDULA') {
           this.buscarporcedula(this.miFormulario.value.fcncedula);
          setTimeout( () => {
             this.calcularSuma();

            this.spinner.hide();
          }, 1000);
        } else {
          if (this.tipo == 'CIU') {
            await this.buscarporciu(this.miFormulario.value.fcncedula);
            setTimeout(async () => {
              await this.calcularSuma();

              this.spinner.hide();
            }, 2000);
          } else {
            this.apareceTabla = false;
            this.spinner.hide();
          }
        }
      
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Ingrese todos los campos!',
      });
      this.spinner.hide();
    }
  }
  async consultar2() {
    console.log('____inputteclado_____' + this.inputteclado);
    console.log('____this.miFormulario.value.fcncedula_____' + this.miFormulario.value.fcncedula);
    console.log('_________' + this.tipo);
    this.total = 0;
    this.apareceTabla = false;
    this.spinner.show();
    if (this.tipo == 'CEDULA' || this.tipo == 'CIU') {
      if (this.inputteclado == '') {
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: 'Ingrese todos los campos!',
        });
        this.spinner.hide();
      } else {
        this.arrayRespuesta = [];
        if (this.tipo == 'CEDULA') {
          await this.buscarporcedula(this.inputteclado);
          setTimeout(async () => {
            await this.calcularSuma();

            this.spinner.hide();
          }, 2000);
        } else {
          if (this.tipo == 'CIU') {
            await this.buscarporciu(this.inputteclado);
            setTimeout(async () => {
              await this.calcularSuma();

              this.spinner.hide();
            }, 2000);
          } else {
            this.apareceTabla = false;
            this.spinner.hide();
          }
        }
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Ingrese todos los campos!',
      });
      this.spinner.hide();
    }
  }
  onSubmit() {
    if (this.miFormulario.valid) {
      console.log('Datos del formulario:', this.miFormulario.value);
      // Aquí puedes enviar los datos a través de un servicio, realizar alguna acción, etc.
    } else {
      console.log('El formulario no es válido. Revisa los campos.');
    }
  }
  calcularSuma() {
    const fechaActual = new Date();
    this.anioActual = fechaActual.getFullYear();
    console.log('el año actual es ' + this.anioActual);
    let suma = 0;
    for (let i = 0; i < this.arrayRespuesta.length; i++) {
      if (this.arrayRespuesta[i]['anio'] <= this.anioActual) {
        console.log('entra al for');
        suma = suma + this.arrayRespuesta[i]['total'];
        this.total = suma;

        console.log('----------------suma---' + suma);
        this.aparecetotal = true;
      } else {
        this.apareceTabla = false;
      }
    }
    if (this.total == 0) {
      this.aparecetotal = true;
      console.log('la suma es 0');

      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'No tiene deudas!',
      });
      this.habilitatecladovirtual = false;
      this.aparecetotal = false;
    } else {
      this.aparecetotal = true;
      this.habilitatecladovirtual = false;
    }
  }
  pagar() {
    let param1 = '';
    if (this.tipo == 'CIU') {
      param1 = 'C';
    }
    if (this.tipo == 'CEDULA') {
      param1 = 'I';
    }
    window.open(
      'https://gadmatic.ambato.gob.ec/WsPlaceToPlay/ListDeudas.jsp?group1=' +
        param1 +
        '&txtBuscar=' +
        this.miFormulario.value.fcncedula +
        '&action=',
      '_blank'
    );
  }
  //teclado
  teclado(numero: number) {
    var inputValue = document.getElementById('inputValue') as HTMLInputElement;
    if (inputValue) {
      this.inputteclado = this.inputteclado + numero.toString();
      inputValue.value = this.inputteclado;
    } else {
      console.error('No se encontró el elemento con ID "inputValue"');
    }
  }
  delete() {
    var inputValue = document.getElementById('inputValue') as HTMLInputElement;
    this.inputteclado = '';
    inputValue.value = '';
  }
  touch() {
    if (this.habilitatecladovirtual == true) {
      this.habilitatecladovirtual = false;
    } else {
      this.habilitatecladovirtual = true;
    }
  }
}
