import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations'; 
import { LotteryService } from '../services/Lottery-Service/lottery.service';
import { UserApiServicesService } from '../services/User-Api-Service/user-api-services.service';
import { Users } from '../Models/User';
import { Route, Router } from '@angular/router';
import { ComsinisApiServiceService } from '../services/Comsini-api-service/comsinis-api-service.service';
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
  ctxa :any;
  state: string = 'default';
  rotate() {
    this.state = (this.state === 'default' ? 'rotated' : 'default');
  }
  constructor(private lottery:LotteryService, private route:Router, private user:UserApiServicesService) { }
  
  byte2Hex(n:number): string {
    let nybHexString: string = "0123456789ABCDEF";
    return String(nybHexString.substring((n >> 4) & 0x0F,1)) + nybHexString.substring(n & 0x0F,1);
  }
  RGB2Color(r:number,g:number,b:number):string {
    // console.log('#'+ r.toString(16)+ g.toString(16)+ b.toString(16))
    return '#'+ r.toString(16)+ g.toString(16)+ b.toString(16);

  }
  getColor(item: number, maxitem: number): string {
    let phase : number = 0;
    let center : number = 128;
    let width : number = 127;
    let frequency : number = Math.PI*2/maxitem;
    let red : number   = Math.sin(frequency*+40+phase) * width + center;
    let green : number = Math.sin(frequency*item+30+phase) * width + center;
    let blue : number  = Math.sin(frequency*item+9+phase) * width + center;
    // console.log(Math.floor(red));
    // console.log(blue);
    // console.log(green);
    return this.RGB2Color(Math.floor(red),Math.floor(green),Math.floor(blue));
  }

  drawRouletteWheel():void {
    let canvas:HTMLCanvasElement  = document.getElementById("canvas") as HTMLCanvasElement;
    let arrow:HTMLCanvasElement  = document.getElementById("arrow") as HTMLCanvasElement;
    if (canvas.getContext) {
      let outsideRadius: number = 200;
      let insideRadius: number =0;
      this.ctx = canvas.getContext("2d");
      this.ctxa = arrow.getContext("2d")
      this.ctx.clearRect(0,0,500,500);
      this.ctxa.clearRect(0,0,50,50);
      
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 2;
  
      // this.ctx.font = 'bold 12px Helvetica, Arial';
  
      for(let i = 0; i < 5; i++) {
        let angle = this.startAngle + i * this.arc;
        //this.ctx.fillStyle = colors[i];
        this.ctx.fillStyle = this.getColor(i, 5);
  
        this.ctx.beginPath();
        this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
        this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
        this.ctx.stroke();
        this.ctx.fill();
  
        this.ctx.save();
        this.ctx.shadowOffsetX = -1;
        this.ctx.shadowOffsetY = -1;
        this.ctx.shadowBlur    = 0;
        this.ctx.shadowColor   = "rgb(220,220,220)";
        this.ctx.fillStyle = "red";
        this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
        this.ctx.restore();
      } 
      //Arrow
      this.ctxa.fillStyle = "red";
      this.ctxa.beginPath();
      this.ctxa.moveTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctxa.lineTo(250 + 4, 250 - (outsideRadius + 5));
      this.ctxa.lineTo(250 + 4, 250 - (outsideRadius - 5));
      this.ctxa.lineTo(250 + 9, 250 - (outsideRadius - 5));
      this.ctxa.lineTo(250 + 0, 250 - (outsideRadius - 13));
      this.ctxa.lineTo(250 - 9, 250 - (outsideRadius - 5));
      this.ctxa.lineTo(250 - 4, 250 - (outsideRadius - 5));
      this.ctxa.lineTo(250 - 4, 250 - (outsideRadius + 5));
      this.ctxa.fill();
    }
  }
  rotateWheel() :void{
    this.spinTime += 30;
    // this.spinTimeout = setTimeout('this.rotateWheel()', 30); 
      let spinAngle: number = this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
      this.startAngle += (spinAngle * Math.PI / 180);
      this.startAngle +=1;
      this.spinTime +=1;
      // this.rotate();
      // this.ctx.clearRect(0,0,500,500);
      this.drawRouletteWheel();
      // console.log(this.startAngle+'_'+spinAngle)
      // console.log(this.spinTime+'_'+this.spinTimeTotal)
      this.ctx.save();
      this.ctx.restore(); 
      console.log('here');
    
      this.stopRotateWheel();
      
  }
  stopRotateWheel() :void {
    // clearTimeout(this.spinTimeout);
    let degrees: number = this.startAngle * 180 / Math.PI + 90;
    let arcd: number = this.arc * 180 / Math.PI;
    let index: number = Math.floor((360 - degrees % 360) / this.arc);
    this.ctx.save();
    this.ctx.restore();
  }
  easeOut(t:number, b:number, c:number, d:number): number {
    let ts: number = (t/=d)*t;
    let tc: number = ts*t;
    return b+c*(tc + -3*ts + 3*t);
  }
  spin(spins:number): void {
    // this.spinAngleStart = Math.random() * 10 + 10;
    // this.spinTime = 0;
    // this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    // this.rotateWheel();
    let stringUser : string = sessionStorage.getItem('currentUser') as string;
    let currentUser = JSON.parse(stringUser);
    const canvas = document.getElementById('canvas')
    canvas?.classList.remove('spinning');
    if(canvas){
      canvas.classList.add('spinning');
    }
    this.lottery.CanPlay(spins*5,currentUser.userId).subscribe((res) => this.lottery.GiveRewards(res,JSON.parse(stringUser)).subscribe({next: (res) => {
      console.log(res);
      if (res){
        alert('Congradulations')
        if(canvas){
          canvas.style.display ='none';
        }
      }
      this.route.navigateByUrl('/homepage');
    }, error: (err) => {
      if(err.status === 400) {
        alert('You are broke!!');
      }
    }}
));
  }
  ngOnInit(): void {
    this.drawRouletteWheel();
  }

}