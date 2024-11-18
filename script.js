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


const FUCK_JAVASCRIPT = -1;
generate();

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                          CODE                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////


function generate(){

  document.getElementById("test").innerHTML = "start";

  // user input
  let year = Number(document.getElementById("year").value);
  const TEMPLATE   = year == 0;
  const U_WEEKENDS = !TEMPLATE && document.getElementById("weekend").checked; // weekend affichés
  const U_WEEKS    = !TEMPLATE && document.getElementById("week").checked; // semaines affcihés
  const U_NOWEEEK  = !TEMPLATE; // no semaine affichés
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
    }
  }

  // Ajouter le SVG au conteneur
  document.getElementById("svg-container").innerHTML = "";
  document.getElementById("svg-container").appendChild(svg);
}