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
  const U_WEEKENDS = !TEMPLATE; // weekend affichés
  const U_WEEKS    = !TEMPLATE; // semaines affcihés
  const U_NOWEEEK  = !TEMPLATE; // no semaine affichés
  const U_WEEKDAY  = !TEMPLATE; // jour semaine affiché
  const U_PAST     = !TEMPLATE; // past blacked out
  const U_VERTICAL = false; // vertical


  // Namespace pour SVG
  const svgNS = "http://www.w3.org/2000/svg";

  // Dimensions du SVG
  const cellSize = 10; // taille des cercles
  const spacing = 5; // espacement entre les cercles
  const margin = 10;
  const header = 10;
  const title = 20;
  const trait = 1;
  const svgWidth = cellSize * 31 + spacing * 31 + trait * 31 + margin * 2 + header; // largeur totale
  const svgHeight = (!TEMPLATE ? title : 0) + cellSize * 12 + spacing * 12 + trait * 12 + margin * 2 + header; // hauteur totale
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const daysInMonths = [31, isLeapYear(year) || TEMPLATE ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];          // TODO : année bissextile

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
    text.setAttribute("x", margin + 0);
    text.setAttribute("y", (!TEMPLATE ? title : 0) + header + margin + (month + 1) * (cellSize + spacing) + trait);
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

        const x = header + margin + day * (cellSize + spacing); // Position horizontale
        const y = (!TEMPLATE ? title : 0) + header + margin + (month + 1) * (cellSize + spacing); // Position verticale

        // Définir la position et la taille des cercles
        square.setAttribute("width", cellSize + (day == days ? -(cellSize / 2) : spacing) + trait);
        square.setAttribute("height", cellSize + trait);
        square.setAttribute("x", x - trait / 2);
        square.setAttribute("y", y - cellSize / 2 - trait / 2);
        square.setAttribute("fill", "black"); 

        if (!isSunday(circle_date.getDay())) {
            svg.appendChild(square);
        }

        if(day == 1 && !isMonday(circle_date.getDay())){
          const square2 = square.cloneNode(true)
          //square2.x -= cellSize;
          square2.setAttribute("x", x - trait / 2 - cellSize/2);
          square2.setAttribute("width", cellSize / 2  + trait);
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
        text.setAttribute("x", header + margin + day * (cellSize + spacing) - cellSize/2 + (day <10 ? 2.5 : 0));
        text.setAttribute("y", (!TEMPLATE ? title : 0) + header/2 + margin + 0);
        text.setAttribute("font-size", "9");
        text.setAttribute("font-family", "Arial");
        text.setAttribute("dominant-baseline", "hanging");
        text.setAttribute("fill", "black");
        text.textContent = day;
        svg.appendChild(text);
      }

      const circle_date = new Date(year, month, day);

      const circle = document.createElementNS(svgNS, "circle");

      const x = header + margin + day * (cellSize + spacing); // Position horizontale
      const y = (!TEMPLATE ? title : 0) + header + margin + (month + 1) * (cellSize + spacing); // Position verticale

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
    }
  }

  // Ajouter le SVG au conteneur
  document.getElementById("svg-container").innerHTML = "";
  document.getElementById("svg-container").appendChild(svg);
}