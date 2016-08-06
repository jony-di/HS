void espera(unsigned short cuenta);
void initMitad();
void mitadLeft();
void mitadRight();
void setDB(unsigned short db);
void instruccion();
void mostrarDatos();
void enable();
unsigned short trazo[11][2];
void escribe(unsigned short lado, unsigned short pagina, unsigned short columna, unsigned short info);
const unsigned short init_columna=0b01000000;
const unsigned short init_pagina=0b10111000;
unsigned short pagina;
short columna;
unsigned short a;
unsigned short limite;
void ponerFlecha(unsigned short mitad);
unsigned short adcValorTinaco=0;
unsigned short adcValorCisterna=0;
unsigned short adcValor=0;
unsigned short adcAux=0;
unsigned short adcBajo=0;
unsigned short nivelControl;
unsigned short adcNivelControl=0;
unsigned short glob_fill=0;

unsigned short TinacoAlto=0;
unsigned short TinacoBajo=0;
unsigned short NivelTinacoBajo;
unsigned short ValorNivelTinacoBajo;

unsigned short CisternaAlto=0;
unsigned short CisternaBajo=0;
unsigned short nivelCisternaAlto;
unsigned short ValorNivelCisternaAlto;

unsigned short btnBomba=1;
unsigned short btnDisplay=1;
unsigned short btnArriba=1;
unsigned short btnAbajo=1;
unsigned short dirEEPromNivelControl;
unsigned short esTinaco=1;
unsigned short ONTinaco=1;
unsigned short ONCisterna=1;
unsigned short ONBomba;

int contadorPulsarManual=0;
unsigned short ControlManual=0;

void main() {
     ANSEL = 0x03; //AN1 y AN2 son entradas analogicas las demas digitales
     ANSELH= 0;    //AN8-AN13 son entradas digitales
     NivelTinacoBajo= EEPROM_Read(5);
     NivelCisternaAlto= EEPROM_Read(6);

     if((NivelTinacoBajo < 0) || (NivelTinacoBajo > 6)){
        EEPROM_Write(5,0);
        NivelTinacoBajo=0;
     }
     if((NivelCisternaAlto < 0) || (NivelCisternaAlto > 6)){
        EEPROM_Write(6,6);
        NivelCisternaAlto=6;
     }
     TRISA = 0b11100111;
     ADCON1.B4 = 0;

     TRISB=0;
     TRISC=0b00000110;
     PORTB=0;
     PORTC.RC0=0;
     PORTC.RC3=0;
     PORTC.RC4=0;
     PORTC.RC5=0;
     PORTC.RC6=0;
     PORTC.RC7=0;
     /*OPTION_REG.T0CS = 0;
     OPTION_REG.PSA = 0;
     OPTION_REG.PS0 = 1;
     OPTION_REG.PS1 = 1;
     OPTION_REG.PS2 = 1;
     TMR0 = 0;*/
     mitadRight();
     initMitad();
     mitadLeft();
     initMitad();

     while(1){
        adcValorTinaco= (ADC_Read(0)>>2);
        adcValorCisterna= (ADC_Read(1)>>2);
        
        if(adcValorTinaco > 60) adcValorTinaco= adcValorTinaco-60;
        else adcValorTinaco=0;
        if(adcValorCisterna > 60) adcValorCisterna= adcValorCisterna-60;
        else adcValorCisterna=0;

        ValorNivelTinacoBajo=(NivelTinacoBajo << 4)+28;
        ValorNivelCisternaAlto=(NivelCisternaAlto << 4)+28;

        if(adcValorTinaco > 120)TinacoAlto=1;
        else TinacoAlto=0;
        if(adcValorTinaco < ValorNivelTinacoBajo) TinacoBajo=0;
        else TinacoBajo=1;

        if(adcValorCisterna > ValorNivelCisternaAlto)CisternaAlto=1;
        else CisternaAlto=0;
        if(adcValorCisterna < 30) CisternaBajo=0;
        else CisternaBajo=1;

        ONBomba=!PORTC.RC3;
        if(TinacoAlto){
           ONTinaco=0;
        }
        if(!TinacoAlto&&!TinacoBajo){
           ONTinaco=1;
        }
        if(!CisternaBajo){
           ONCisterna=0;
        }
        if(CisternaAlto&&CisternaBajo){
           ONCisterna=1;
        }

        if(!ONBomba&&CisternaBajo&&((!PORTA.RA5&&btnBomba&&!TinacoAlto) || (ONTinaco&&ONCisterna) || ControlManual)){
             PORTC.RC3=0;
             PORTC.RC0=0;
        }else if(ONBomba&&((TinacoAlto&&!ControlManual) || !CisternaBajo)){
             PORTC.RC3=1;
             PORTC.RC0=1;
        }btnBomba=PORTA.RA5;

        if(!PORTA.RA2&&btnDisplay){
           esTinaco=!esTinaco;
        }btnDisplay= PORTA.RA2;

        if(esTinaco){
           adcValor= adcValorTinaco;
           nivelControl= EEPROM_Read(5);
           NivelTinacoBajo= nivelControl;
           dirEEPromNivelControl=5;
           PORTC.RC5=1;
           PORTC.RC4=0;
        }else{
           adcValor= adcValorCisterna;
           nivelControl= EEPROM_Read(6);
           NivelCisternaAlto= nivelControl;
           dirEEPromNivelControl=6;
           PORTC.RC5=0;
           PORTC.RC4=1;
        }

        if(!PORTC.RC1&&btnArriba&&(nivelControl < 6)&&(PORTC.RC2)){
            nivelControl++;
            EEPROM_Write(dirEEPromNivelControl,nivelControl);
        }btnArriba=PORTC.RC1;
        if(!PORTC.RC2&&btnAbajo&&(nivelControl > 0)&&(PORTC.RC1)){
            nivelControl--;
            EEPROM_Write(dirEEPromNivelControl,nivelControl);
        }btnAbajo=PORTC.RC2;
        
        adcNivelControl=(nivelControl << 4)+28;
         /*Pintar Contenedor*/
        for(columna=63;columna >=0; columna--){
             adcAux=columna + 64;
             if(columna > 62){
                 escribe(0,1,columna,0b00000000);escribe(0,2,columna,0b11100000);escribe(0,3,columna,0b11111111);escribe(0,4,columna,0b11111111);escribe(0,5,columna,0b11111111);escribe(0,6,columna,0b00000111);escribe(0,7,columna,0b00000000);
             }else if(columna > 53){
                 escribe(0,1,columna,0b00000000);escribe(0,7,columna,0b00000000);
                 if(adcAux <= adcValor){
                      escribe(0,2,columna,0b11100000);escribe(0,3,columna,0b11111111);escribe(0,4,columna,0b11111111);escribe(0,5,columna,0b11111111);escribe(0,6,columna,0b00000111);
                 }else{
                      escribe(0,2,columna,0b00100000);escribe(0,3,columna,0b00000000);escribe(0,4,columna,0b00000000);escribe(0,5,columna,0b00000000);escribe(0,6,columna,0b00000100);
                 }
             }else if(columna > 52){
                 escribe(0,1,columna,0b11111111);escribe(0,7,columna,0b11111111);
                 if(adcAux <= adcValor){
                      escribe(0,2,columna,0b11111111);escribe(0,3,columna,0b11111111);escribe(0,4,columna,0b11111111);escribe(0,5,columna,0b11111111);escribe(0,6,columna,0b11111111);
                 }else{
                      escribe(0,2,columna,0b00111111);escribe(0,3,columna,0b00000000);escribe(0,4,columna,0b00000000);escribe(0,5,columna,0b00000000);escribe(0,6,columna,0b11111100);
                 }
             }else if(columna >=0){
                 if(adcAux <= adcValor){
                      escribe(0,1,columna,0b11111111);escribe(0,2,columna,0b11111111);escribe(0,3,columna,0b11111111);escribe(0,4,columna,0b11111111);escribe(0,5,columna,0b11111111);escribe(0,6,columna,0b11111111);escribe(0,7,columna,0b11111111);
                 }else{
                      escribe(0,1,columna,0b00000001);escribe(0,2,columna,0b00000000);escribe(0,3,columna,0b00000000);escribe(0,4,columna,0b00000000);escribe(0,5,columna,0b00000000);escribe(0,6,columna,0b00000000);escribe(0,7,columna,0b10000000);
                 }
             }
        }
        for(columna=63;columna >=0; columna--){
             if(columna > 0){
                 if(columna <= adcValor){
                      escribe(1,1,columna,0b11111111);escribe(1,2,columna,0b11111111);escribe(1,3,columna,0b11111111);escribe(1,4,columna,0b11111111);escribe(1,5,columna,0b11111111);escribe(1,6,columna,0b11111111);escribe(1,7,columna,0b11111111);
                 }else{
                      escribe(1,1,columna,0b00000001);escribe(1,2,columna,0b00000000);escribe(1,3,columna,0b00000000);escribe(1,4,columna,0b00000000);escribe(1,5,columna,0b00000000);escribe(1,6,columna,0b00000000);escribe(1,7,columna,0b10000000);
                 }
             }else if(columna ==0){
                 escribe(1,1,columna,0b11111111);escribe(1,2,columna,0b11111111);escribe(1,3,columna,0b11111111);escribe(1,4,columna,0b11111111);escribe(1,5,columna,0b11111111);escribe(1,6,columna,0b11111111);escribe(1,7,columna,0b11111111);
             }
        }
       /*Fin Pintar Contenedor*/
       
       /*Pintar Flecha*/
       for(columna=63;columna>=8;columna--){
           adcAux= columna + 64;
           if((adcAux - 3) == adcNivelControl){
               ponerFlecha(0);
               columna=columna-6;
           }else{
                 escribe(0,0,columna,0b00000000);
           }
       } /* Se pueden acelerar con un break,valiable limpiar y otro for*/
       
       for(columna=63;columna>=8;columna--){
           if((columna - 3) == adcNivelControl){
               ponerFlecha(1);
               columna=columna-6;
           }else{
               escribe(1,0,columna,0b00000000);
           }
       }

        if(!PORTA.RA5){
            if(contadorPulsarManual>12){
               ControlManual=1;
            }else{
               contadorPulsarManual++;
               ControlManual=0;
            }
        }else{
            contadorPulsarManual=0;
            ControlManual=0;
        }
     }
}

void escribe(unsigned short lado, unsigned short pagina, unsigned short columna, unsigned short info){
    if(lado) mitadLeft();
    else mitadRight();
    setDB(init_pagina + pagina);
    instruccion();
    setDB(init_columna + columna);
    instruccion();
    setDB(info);
    mostrarDatos();
}

void ponerFlecha(unsigned short mitad){
   escribe(mitad,0,columna     ,0b00001000);
   escribe(mitad,0,columna - 1 ,0b00011000);
   escribe(mitad,0,columna - 2 ,0b00111111);
   escribe(mitad,0,columna - 3 ,0b01111111);
   escribe(mitad,0,columna - 4 ,0b00111111);
   escribe(mitad,0,columna - 5 ,0b00011000);
   escribe(mitad,0,columna - 6 ,0b00001000);
}

void mitadLeft(){
     //mitad
    PORTA.RA3=0;
    PORTA.RA4=1;
}

void mitadRight(){
     //mitad
    PORTA.RA3=1;
    PORTA.RA4=0;
}

void initMitad(){
      setDB(0b00111110); //off display
      instruccion();
      setDB(0b00111111); //on display
      instruccion();
}

void espera(unsigned short limite){
   /*int cuenta=0;
   while(cuenta < limite){
        if(TMR0 == 5){
              cuenta= cuenta + 1;
              TMR0=0;
        }
      } */
}

void setDB(unsigned short db){
      PORTB= db;
}

void instruccion(){
      //D/I
      PORTC.RC6=0;
      enable();
      espera(2);
}

void mostrarDatos(){
      //D/I
      PORTC.RC6=1;
      enable();
      espera(1);
}

void enable(){
     //Enable
      PORTC.RC7=1;
      espera(1);
      PORTC.RC7=0;
}