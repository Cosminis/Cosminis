import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $:any;

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cosminis-go',
  templateUrl: './cosminis-go.component.html',
  styleUrls: ['./cosminis-go.component.css']
})
export class CosminisGoComponent implements OnInit 
{

  constructor(private router: Router) { }

  gotoHome(){
    this.router.navigateByUrl('/homepage');  // define your component where you want to go
  }    
  
  ngOnInit(): void 
  {
    $(document).ready(() => {        
      let LeftSelect = false; //this get toggled in the RNG
      let RightSelect = false;
      let WinCondition = 0;
      let PlayCount = 0;
      let WinStreak = 0;
      $('.generate').click(function()
      {
          $('.tm').addClass('spin1');
          $('.bm').addClass('spin');
          $('.Player-counter-display').text(PlayCount);
          PlayCount++;
              let WinCondition = Math.floor(Math.random() * 2);
              if ((WinCondition === 0 && LeftSelect === true) || (WinCondition === 1 && RightSelect === true))
              {
                  console.log(WinStreak);
                  WinStreak = WinStreak + 1;
                  $('.Winning_streak_display').text(WinStreak);
                  LeftSelect = false;
                  LeftSelect = false;
                  $('.image1').removeClass('colour');
                  $('.image4').removeClass('colour');
                  Swal.fire("You have won purely by luck, zero skill involved");
              }
              else if(LeftSelect === false && RightSelect === false)
              {
                  console.log(WinStreak);
                  WinStreak = 0;
                  $('.Winning_streak_display').text(WinStreak);
                  LeftSelect = false;
                  LeftSelect = false;
                  $('.image1').removeClass('colour');
                  $('.image4').removeClass('colour');
                  Swal.fire("Are you even trying?")
              }
              else
              {
                  console.log(WinStreak);
                  WinStreak = 0;
                  $('.Winning_streak_display').text(WinStreak);
                  LeftSelect = false;
                  LeftSelect = false;
                  $('.image1').removeClass('colour');
                  $('.image4').removeClass('colour');
                  Swal.fire("You stink")
              }
              
              let topImg = document.createElement("img"); //creates an html img tag
              topImg.src = `https://app.pixelencounter.com/api/basic/stars?disableBackground=true&height=300&width=300&date=${Date.now()}`;
              $('.tm').html(topImg);
      
              let bottomImg = document.createElement("img"); //creates an html img tag
              bottomImg.src = `https://app.pixelencounter.com/api/basic/planets?disableBackground=true&frame=450&height=500&width=500&date=${Date.now()}`;
              $('.bm').html(bottomImg);
              
              let leftImg = document.createElement("img"); //creates an html img tag
              leftImg.src = `https://app.pixelencounter.com/api/basic/monsters/random?date=${Date.now()}`;
              $('.image1').html(leftImg);
      
              let rightImg = document.createElement("img"); //creates an html img tag
              rightImg.src = `https://app.pixelencounter.com/api/v2/basic/svgmonsters?disableBackground=True&date=${Date.now()}`;
              $('.image4').html(rightImg); 
       
      });
      
      $('.SelectLeft').click(function()
      {
          if(LeftSelect===true && RightSelect===false)
          {
              LeftSelect = false;
              $('.image1').removeClass('colour');
          }
          else if(LeftSelect===true && RightSelect===true)
          {
              $('.image1').removeClass('colour');
              $('.image4').removeClass('colour');
              LeftSelect = false;
              RightSelect = false;
              Swal.fire("How TF you got here m8");
          }
          else if(LeftSelect===false && RightSelect===false)
          {
              LeftSelect = true;
              $('.image1').addClass('colour');
          }
          else if(LeftSelect===false && RightSelect===true)
          {
              LeftSelect = true;
              $('.image1').addClass('colour');
              RightSelect = false;
              $('.image4').removeClass('colour');
          }
      });
      
      $('.SelectRight').click(function()
      {
          if(LeftSelect===true && RightSelect===false)
          {
              LeftSelect = false;
              $('.image1').removeClass('colour');
              RightSelect = true;
              $('.image4').addClass('colour');
          }
          else if(LeftSelect===true && RightSelect===true)
          {
              $('.image1').removeClass('colour');
              $('.image4').removeClass('colour');
              LeftSelect = false;
              RightSelect = false;
              Swal.fire("How TF you got here m8");
          }
          else if(LeftSelect===false && RightSelect===false)
          {
              RightSelect = true;
              $('.image4').addClass('colour');
          }
          else if(LeftSelect===false && RightSelect===true)
          {
              RightSelect = false;
              $('.image4').removeClass('colour');
          }
      });
      });
  }

}
