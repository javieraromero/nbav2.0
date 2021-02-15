const params = (new URL(document.location)).searchParams;
const date = params.get('date');

let statusNums = [];

run();

async function run(){
    const longDate = document.querySelector('#longDate');
    longDate.innerText = setLongDate();

    const prevDayBtn = document.querySelector('#prevDayBtn');
    const nextDayBtn = document.querySelector('#nextDayBtn');

    const [ previousDate, nextDate ] = setPreviousAndNextDate();

    prevDayBtn.href = `date?date=${ previousDate }`;
    nextDayBtn.href = `date?date=${ nextDate }`;

    do {
        console.log('Getting game data');
        await getData();
        console.log(statusNums);
        await sleep(5000);
    } while(checkStatusNums());
}

async function getData() {
    try {
        let tempStatusNums = [];
        const data = await (await fetch(`https://data.nba.net/10s/prod/v1/${ date }/scoreboard.json`)).json();
        const games = data.games;
        for(let i = 0; i < games.length; i++) {
            const game = games[i];
            if(document.querySelector(`#game${ i }`)) {
                const statusNum = game.statusNum;
                tempStatusNums.push(statusNum);
                const vTeamCol = document.querySelector(`#game${ i }vTeamCol`);
                const middleCol = document.querySelector(`#game${ i }middleCol`);
                const hTeamCol = document.querySelector(`#game${ i }hTeamCol`);

                buildCols(game, vTeamCol, middleCol, hTeamCol);
                
            } else {
                const statusNum = game.statusNum;
                tempStatusNums.push(statusNum);
                const gameLink = document.createElement('a');

                gameLink.href = `game?date=${ date }&gameId=${ game.gameId }`;

                const table = document.createElement('table');
                const firstRow = document.createElement('tr');
                const vTeamCol = document.createElement('td');
                const middleCol = document.createElement('td');
                const hTeamCol = document.createElement('td');

                firstRow.appendChild(vTeamCol);
                firstRow.appendChild(middleCol);
                firstRow.appendChild(hTeamCol);
                table.appendChild(firstRow);
                gameLink.appendChild(table);

                //firstRow.id = `game${ i }firstRow`;
                vTeamCol.id = `game${ i }vTeamCol`;
                middleCol.id = `game${ i }middleCol`;
                hTeamCol.id = `game${ i }hTeamCol`;
                gameLink.id = `game${ i }`;
                table.className = 'gameTable';
                vTeamCol.className = 'teamCol';
                middleCol.className = 'middleCol';
                hTeamCol.className = 'teamCol';

                buildCols(game, vTeamCol, middleCol, hTeamCol);

                document.body.append(gameLink);
            }
            statusNums = tempStatusNums;
        }
    } catch(e) {
        console.error(e);
        const errorMsg = document.createElement('h1');
        errorMsg.innerText = 'Sorry, unable to retrieve today\'s games';
        document.body.append(errorMsg);
    }
}

function buildCols(game, vTeamCol, middleCol, hTeamCol) {

    let vTeam = teams[game.vTeam.teamId];
    let hTeam = teams[game.hTeam.teamId];

    vTeamCol.innerHTML = `
        <span class='teamName'>${ vTeam.simpleName }</span>
        <img src="${ vTeam.secondaryLogoLocation }" class="teamLogo">
        <span class='score'>${ game.vTeam.score }</span>`;
    hTeamCol.innerHTML = `
        <span class='teamName'>${ hTeam.simpleName }</span>
        <img src="${ hTeam.secondaryLogoLocation }" class="teamLogo">
        <span class='score'>${ game.hTeam.score }</span>`;

    let topLabel = '';
    let bottomLabel = '';
    
    let statusNum = game.statusNum;
    if(statusNum == 1) {
        const isStartTimeTBD = game.isStartTimeTBD;
        if(isStartTimeTBD) {
            topLabel = "TBD";
        } else {
            topLabel = game.startTimeEastern;
        }
        bottomLabel = '';
    } else if(statusNum == 2) {
        let quartersElapsed = game.period.current;
        let clock = game.clock;
        let isHalftime = game.period.isHalftime;
        let isEndOfPeriod = game.period.isEndOfPeriod;
        if(isHalftime) {
            topLabel = 'Halftime';
        } else if(isEndOfPeriod) {
            if(quartersElapsed > 4)
                topLabel = `End of ${ quartersElapsed > 5 ? String(quartersElapsed - 4) : '' }OT`;
            else
                topLabel = `End of Q${ quartersElapsed }`;
        } else {
        if(quartersElapsed > 4)
            topLabel = `${ quartersElapsed > 5 ? String(quartersElapsed - 4) : '' }OT`;
        else
            topLabel = `Q${ quartersElapsed }`;
        }
        bottomLabel = `${ clock }`;
    } else if(statusNum == 3) {
        topLabel = "Final";
        let quartersElapsed = game.period.current;
        if(quartersElapsed > 4)
            topLabel += ` (${ quartersElapsed > 5 ? String(quartersElapsed - 4) : ''}OT)`;
    }

    middleCol.innerText = `${topLabel} \n ${bottomLabel}`;
}

function setPreviousAndNextDate() {
    let currentYear = Number(date.substring(0, 4));
    let currentMonth = Number(date.substring(4, 6));
    let currentDay = Number(date.substring(6, ));

    let previousDate, nextDate;

    let temp = new MyDate(currentMonth, currentDay, currentYear);
    temp.previousDay();
    let tempMonth = String(temp.getMonth());
    let tempMonthFormatted = tempMonth < 10 ? "0" + tempMonth : tempMonth;
    let tempDay = String(temp.getDay());
    let tempDayFormatted = tempDay < 10 ? "0" + tempDay : tempDay;
    let tempYear = String(temp.getYear());

    previousDate = tempYear + tempMonthFormatted + tempDayFormatted;

    temp = new MyDate(currentMonth, currentDay, currentYear);
    temp.nextDay();
    tempMonth = String(temp.getMonth());
    tempMonthFormatted = tempMonth < 10 ? "0" + tempMonth : tempMonth;
    tempDay = String(temp.getDay());
    tempDayFormatted = tempDay < 10 ? "0" + tempDay : tempDay;
    tempYear = String(temp.getYear());

    nextDate = tempYear + tempMonthFormatted + tempDayFormatted;

    return [ previousDate, nextDate ];
}

function setLongDate()
{
    let year = Number(date.slice(0, 4));
    let month = Number(date.slice(4, 6));
    let day = Number(date.slice(6, ));

    let newDate = new MyDate(month, day, year);

    return `${ newDate.getDayOfWeekName()}, ${ newDate.getMonthName() } ${ newDate.getDay() } ${ newDate.getYear() }`;
}

function checkStatusNums() {
    return statusNums.indexOf(1) !== -1 || statusNums.indexOf(2) !== -1;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log(teams)