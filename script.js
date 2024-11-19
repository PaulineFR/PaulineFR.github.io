///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                         TOOLS                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////


/*******************************************************************************************************
* Procedure    : daysInYear
* Author       : PFR
* Date         : 07/10/2024
* Last modifed : --
* Purpose      : gets how many days is there in parameter year (whether it is a leap year)
* Parameters   : {int:year} the year to know the number of days of
* Return       : {int} the number of days of the year
/*******************************************************************************************************
/*/
function daysInYear(year)
{
return new Date(year,1,29).getMonth()==1 ? 366 : 365;
}

function isLeapYear(year){
   return daysInYear(year) == 366
}

function isWeekend(day) {
   return (day === 6) || (day  === 0); // 6 = Saturday, 0 = Sunday
}

function isSunday(day) {
   return (day  === 0);
}

function isMonday(day) {
   return (day  === 1);
}

function isWednersday(day) {
   return (day  === 3);
}

function getDayLetter(day) {
   switch (day){
    case 1:
      return "L";
    case 2:
      return "M";
    case 3:
      return "M";
    case 4:
      return "J";
    case 5:
      return "V";
    case 6:
      return "S";
    case 0:
      return "D";
  }
}

/* For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    THIS PAGE (DOMAIN EVEN) DOESN'T EXIST ANYMORE UNFORTUNATELY
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 * 
 * source :  https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 */
function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}


const FUCK_JAVASCRIPT = -1;
generate();

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                          CODE                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////


function generate(){

  // user input
  let year = Number(document.getElementById("year").value);
  const TEMPLATE   = year == 0;
  const U_WEEKENDS = !TEMPLATE && document.getElementById("weekend").checked; // weekend affichés
  const U_WEEKS    = !TEMPLATE && document.getElementById("week").checked; // semaines affcihés
  const U_NOWEEEK  = !TEMPLATE && document.getElementById("weekno").checked; // no semaine affichés
  const U_WEEKDAY  = !TEMPLATE && document.getElementById("weekday").checked; // jour semaine affiché
  const U_PAST     = !TEMPLATE && document.getElementById("past").checked; // past blacked out
  const U_VERTICAL = document.getElementById("vertical").checked; // vertical


  // Namespace pour SVG
  const svgNS = "http://www.w3.org/2000/svg";

  // Dimensions du SVG
  const cellSize = 10; // taille des cercles
  const spacing = 5; // espacement entre les cercles
  const margin = 10;
  const header = 10;
  const title = 20;
  const trait = 1;
  const days_axis_size = cellSize * 31 + spacing * 31 + trait * 31 + margin * 2 + header;
  const month_axis_size = cellSize * 12 + spacing * 12 + trait * 12 + margin * 2 + header;
  const svgWidth = U_VERTICAL ? month_axis_size : days_axis_size;  // largeur totale
  const svgHeight = (!TEMPLATE ? title : 0) + (U_VERTICAL ? days_axis_size : month_axis_size); // hauteur totale
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const daysInMonths = [31, isLeapYear(year) || TEMPLATE ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const verticalHeaderTextSize = "11";
  const horizontalHeaderTextSize = "9";
  const monthTextSize = U_VERTICAL ? horizontalHeaderTextSize : verticalHeaderTextSize;
  const daysTextSize = U_VERTICAL ? verticalHeaderTextSize : horizontalHeaderTextSize;

  // Crée le conteneur SVG
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", svgWidth);
  svg.setAttribute("height", svgHeight);
  svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  svg.setAttribute("xmlns", `${svgNS}`);
  svg.style.border = "1px solid black"; // Pour visualiser la bordure du SVG


  
  ///////////////////////////////////////////////


  /// YEAR TITLE
  if(!TEMPLATE){
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", svgWidth / 2 - title);
    text.setAttribute("y", margin + title/2);
    text.setAttribute("font-size", "15");
    text.setAttribute("font-family", "Arial");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "black");
    text.textContent = year;
    svg.appendChild(text);
  }


  // Génère les mois et jours
  for (let month = 0; month < months.length; month++) {
    // Ajouter le label du mois
    const text = document.createElementNS(svgNS, "text");
    const days_axis = header/2 + margin + 0;
    const month_axis = header + margin + (month + 1) * (cellSize + spacing) + trait;
    text.setAttribute("x", (U_VERTICAL ? month_axis - cellSize / 2 : days_axis));
    text.setAttribute("y", (!TEMPLATE ? title : 0) + (U_VERTICAL ? days_axis + header/2 : month_axis) );
    text.setAttribute("font-size", "11");
    text.setAttribute("font-family", "Arial");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "black");
    text.textContent = months[month];
    svg.appendChild(text);

    
    const days = daysInMonths[month];
    // Générer les carrés
    if(U_WEEKS){
      for (let day = 1; day <= days; day++) {

        const circle_date = new Date(year, month, day);

        const square = document.createElementNS(svgNS, "rect");

        const days_axis = header + margin + day * (cellSize + spacing)- trait / 2;
        const month_axis = header + margin + (month + 1) * (cellSize + spacing) - cellSize / 2 - trait / 2;
        const x = (U_VERTICAL ? month_axis : days_axis); // Position horizontale
        const y = (!TEMPLATE ? title : 0) + (U_VERTICAL ? days_axis : month_axis); // Position verticale
        const w = (U_VERTICAL ? 0 : (day == days ? -(cellSize / 2) : spacing))
        const h = (U_VERTICAL ? (day == days ? -(cellSize / 2) : spacing) : 0)

        // Définir la position et la taille des cercles
        square.setAttribute("width", cellSize + w + trait);
        square.setAttribute("height", cellSize + h + trait);
        square.setAttribute("x", x );
        square.setAttribute("y", y );
        square.setAttribute("fill", "black"); 

        if (!isSunday(circle_date.getDay())) {
            svg.appendChild(square);
        }

        if(day == 1 && !isMonday(circle_date.getDay())){
          const square2 = square.cloneNode(true)
          //square2.x -= cellSize;
          square2.setAttribute((U_VERTICAL ? "y" : "x"), (U_VERTICAL ? y : x) - trait / 2 - cellSize/2);
          square2.setAttribute((U_VERTICAL ? "height" : "width") , cellSize / 2  + trait);
          svg.appendChild(square2);
        }
      }
    }

    // Générer les cercles pour chaque jour du mois
    let header_ok = false;
    for (let day = 1; day <= days; day++) {

      if(!header_ok){
        // Ajouter le label du jour
        const text = document.createElementNS(svgNS, "text");
        
        const days_axis = header + margin + day * (cellSize + spacing) - cellSize/2 + trait/2 ;
        const month_axis = header/2 + margin + 0;
        text.setAttribute("x", (U_VERTICAL ? month_axis : days_axis + (day <10 ? 1.5 : 0)));
        text.setAttribute("y", (!TEMPLATE ? title : 0) + (U_VERTICAL ? days_axis+ trait/2 : month_axis));
        text.setAttribute("font-size", daysTextSize);
        text.setAttribute("font-family", "Arial");
        text.setAttribute("dominant-baseline", "hanging");
        text.setAttribute("fill", "black");
        text.textContent = day;
        svg.appendChild(text);
      }

      const circle_date = new Date(year, month, day);

      

      const circle = document.createElementNS(svgNS, "circle");

      const days_axis = header + margin + day * (cellSize + spacing);
      const month_axis = header + margin + (month + 1) * (cellSize + spacing);
      const x = (U_VERTICAL ? month_axis : days_axis); // Position horizontale
      const y = (!TEMPLATE ? title : 0) + (U_VERTICAL ? days_axis : month_axis); // Position verticale

      // Définir la position et la taille des cercles
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", cellSize / 2);

      // Couleur des cercles
      circle.setAttribute("fill", "white"); 
      circle.setAttribute("stroke-width", trait);
      circle.setAttribute("stroke", "black");
      // Weekend
      if (U_WEEKENDS && isWeekend(circle_date.getDay())) {
        circle.setAttribute("fill", "lightgray");
      }
      // 29 février
      if (TEMPLATE && day == 29 && month == 2 + FUCK_JAVASCRIPT) {
        circle.setAttribute("stroke-dasharray", "1,1")
      };
      // past blaked out
      if (U_PAST && circle_date < Date.now()) {
        circle.setAttribute("fill", "black");
      }

      svg.appendChild(circle);


      if(U_WEEKDAY){
        // Ajouter le label du jour
        const text = document.createElementNS(svgNS, "text");
        
        const days_axis = header + margin + day * (cellSize + spacing) - cellSize/4 ;
        const month_axis = header + margin + (month + 1) * (cellSize + spacing) - cellSize/4;
        text.setAttribute("x", (U_VERTICAL ? month_axis : days_axis) + (getDayLetter(circle_date.getDay()) == "M" ? 0 : 0.5));
        text.setAttribute("y", (!TEMPLATE ? title : 0) + (U_VERTICAL ? days_axis : month_axis));
        text.setAttribute("font-size", "6");
        text.setAttribute("font-family", "Arial");
        text.setAttribute("dominant-baseline", "hanging");
        text.setAttribute("fill", "black");
        text.textContent = getDayLetter(circle_date.getDay());
        svg.appendChild(text);
      }

      if(U_NOWEEEK && isWednersday(circle_date.getDay())){
        // Ajouter le label du jour
        const text = document.createElementNS(svgNS, "text");
        const weekno = Number(getWeekNumber(circle_date)[1]);
        
        const days_axis = header + margin + day * (cellSize + spacing) - cellSize/4 ;
        const month_axis = header + margin + (month + 1) * (cellSize + spacing) - cellSize/4;
        text.setAttribute("x", (U_VERTICAL ? month_axis : days_axis) + (weekno < 10 ? 1 : -1) * 0.8);
        text.setAttribute("y", (!TEMPLATE ? title : 0) + (U_VERTICAL ? days_axis : month_axis));
        text.setAttribute("font-size", "6");
        text.setAttribute("font-family", "Arial");
        text.setAttribute("dominant-baseline", "hanging");
        text.setAttribute("fill", "black");
        text.textContent = weekno;
        svg.appendChild(text);
      }
    }
  }

  // Ajouter le SVG au conteneur
  document.getElementById("svg-container").innerHTML = "";
  document.getElementById("svg-container").appendChild(svg);
}


function toggleCircleTextNo(){
  document.getElementById("weekno").checked = false; // no semaine non affichés
  generate();
  
}

function toggleCircleTextLetter(){
  document.getElementById("weekday").checked = false; // jour semaine non affiché
  generate();
  
}




function downloadSVG() {
  const svgString = document.getElementById("svg-container").innerHTML;
  let year = Number(document.getElementById("year").value);
  const TEMPLATE   = year == 0;

  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  download(url, `dot calendar ${TEMPLATE ? "template" : year}.svg`);

  URL.revokeObjectURL(url); // Libère l'URL après téléchargement

}

/// source : https://www.beaubus.com/blog/how_to_save_inline_svg_as_png_with_vanilla_javascript_and_html_canvas.html
function downloadPNG()
{
  let year = Number(document.getElementById("year").value);
  const U_VERTICAL = document.getElementById("vertical").checked; // vertical
  const TEMPLATE   = year == 0;
    // specify png with and height in pixels

    //// DIMENTIONS
    /// avec titre
    // w526 x h242 - horizontal
    // w222 x h546 - vertical
    // w526 x h222 - horizontal
    // w222 x h526 - horizontal

    const t = 20;
    const x = 222;
    const y = 526;
    const p = 3;


    var png_width = (U_VERTICAL ? x : y) * p;
    var png_height = (U_VERTICAL ? y : x + (!TEMPLATE ? t : 0)) * p;

    const svgString = document.getElementById("svg-container").innerHTML;
    var inline_svg = svgString; // code of inline SVG

    var canvas = document.createElement("canvas"); // create <canvas> element
    // The 2D Context provides objects, methods, and properties to draw 
    // and manipulate graphics on a canvas drawing surface.
    var context = canvas.getContext("2d");

    // set canvas with and height equal to png with and height
    canvas.width = png_width;
    canvas.height = png_height;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    let image = new Image(); // create <img> element
    image.onload = function () {
        context.drawImage(image, 0, 0, png_width, png_height); 
        download(canvas.toDataURL("image/png"), `dot calendar ${TEMPLATE ? "template" : year}.png`);
    }.bind(this);

    // btoa — binary string to ASCII (Base64-encoded)
    image.src = 'data:image/svg+xml;base64,' + btoa(inline_svg); 
}

function downloadPDF(){
  var svg_text = document.getElementById("svg-container").innerHTML.toString();
  var svg_width = Number(svg_text.substring(12, 15));
  var svg_height = Number(svg_text.substring(25, 28));
  const scale = 0.5;
  svg_width *= scale;
  svg_height *= scale;
  var new_svg_text = svg_text.replace(/<svg width="\d{3}" height="\d{3}"/i, `<svg width="${svg_width}" height="${svg_height}" margin="10"`);

  let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');

  mywindow.document.write(`<html><head><title>Dot Calendar</title>`);
  /*mywindow.document.write(`<style type="text/css" media="print"> 
    @page { size: landscape; }
    </style>`);
  mywindow.document.write(` <style>
       @media print {
    body {
        transform: scale(0.9);
        transform-origin: 0 0;
    }
}
    </style>`);*/
  mywindow.document.write('</head><body >');
  //svggg.style.width = 300;
  //mywindow.document.write(`<p>aaabbbcc ${svg_text.substring(4,50)}</p>`);
  //mywindow.document.write(`<p>aaabbbcc ${new_svg_text.substring(4,50)}</p>`);
  //mywindow.document.write(`<p>aaabbbcc ${svg_width} ${svg_height}</p>`);
  //mywindow.document.write(svggg.innerHTML);
  mywindow.document.write(new_svg_text);
  mywindow.document.write(new_svg_text);
  mywindow.document.write(new_svg_text);
 // mywindow.document.write(document.getElementById("svg-container").innerHTML);
 // mywindow.document.write(document.getElementById("svg-container").innerHTML);
 // mywindow.document.write(document.getElementById("svg-container").innerHTML);
  mywindow.document.write('</body></html>');


  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.close();
}


function download(href, name)
{
  const link = document.createElement("a");
  link.href = href;
  link.download = name ;
  link.click();
  delete link;
}


