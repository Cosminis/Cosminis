import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.css']
})
export class LotteryComponent implements OnInit {
  startAngle: number = 0;
  arc: number = 1.256;
  spinTimeout : number = NaN
  spinArcStart : number = 10;
  spinAngleStart : number = 0;
  spinTime : number = 0;
  spinTimeTotal : number = 0;
  ctx : any;

  constructor() { }

  byte2Hex(n:number): string {
    let nybHexString: string = "0123456789ABCDEF";
    return String(nybHexString.substring((n >> 4) & 0x0F,1)) + nybHexString.substring(n & 0x0F,1);
  }
  RGB2Color(r:number,g:number,b:number):string {
    return '#'+ this.byte2Hex(r)+ this.byte2Hex(g)+ this.byte2Hex(b);
  }
  getColor(item: number, maxitem: number): string {
    let phase : number = 0;
    let center : number = 128;
    let width : number = 127;
    let frequency : number = Math.PI*2/maxitem;
    let red : number   = Math.sin(frequency*item+2+phase) * width + center;
    let green : number = Math.sin(frequency*item+0+phase) * width + center;
    let blue : number  = Math.sin(frequency*item+4+phase) * width + center;
  
    return this.RGB2Color(red,green,blue);
  }

  drawRouletteWheel() {
    let canvas:HTMLCanvasElement | null  = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas.getContext) {
      let outsideRadius: number = 200;
  
      this.ctx = canvas.getContext("2d");
      this.ctx.clearRect(0,0,500,500);
  
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 2;
  
      this.ctx.font = 'bold 12px Helvetica, Arial';
  
      for(let i = 0; i < 5; i++) {
        let angle = this.startAngle + i * this.arc;
        //this.ctx.fillStyle = colors[i];
        this.ctx.fillStyle = this.getColor(i, 5);
  
        this.ctx.beginPath();
        this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
        this.ctx.stroke();
        this.ctx.fill();
  
        this.ctx.save();
        this.ctx.shadowOffsetX = -1;
        this.ctx.shadowOffsetY = -1;
        this.ctx.shadowBlur    = 0;
        this.ctx.shadowColor   = "rgb(220,220,220)";
        this.ctx.fillStyle = "black";
        this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
        this.ctx.restore();
      } 
  
      //Arrow
      this.ctx.fillStyle = "black";
      this.ctx.beginPath();
      this.ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
      this.ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
      this.ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      this.ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctx.fill();
    }
  }
  spin(): void {
    this.spinAngleStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    this.rotateWheel();
  }
  rotateWheel() {
    this.spinTime += 30;
    if(this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel();
      return;
    }
    let spinAngle: number = this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
    this.startAngle += (spinAngle * Math.PI / 180);
    this.drawRouletteWheel();
    this.spinTimeout = setTimeout('rotateWheel()', 30);
  }
  stopRotateWheel() {
    clearTimeout(this.spinTimeout);
    let degrees: number = this.startAngle * 180 / Math.PI + 90;
    let arcd: number = this.arc * 180 / Math.PI;
    let index: number = Math.floor((360 - degrees % 360) / arcd);
    this.ctx.save();
    this.ctx.restore();
  }
  easeOut(t:number, b:number, c:number, d:number): number {
    let ts: number = (t/=d)*t;
    let tc: number = ts*t;
    return b+c*(tc + -3*ts + 3*t);
  }
  ngOnInit(): void {
    this.drawRouletteWheel();
  }

}
