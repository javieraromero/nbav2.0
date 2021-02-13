let params = (new URL(document.location)).searchParams;
let date = params.get('date');

let statusNums = [];

run();

async function run(){
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
        const data = await (await fetch(`http://data.nba.net/10s/prod/v1/${ date }/scoreboard.json`)).json();
        const games = data.games;
        for(let i = 0; i < games.length; i++) {
            const game = games[i];
            if(document.querySelector(`#game${ i }`)) {
                const statusNum = game.statusNum;
                tempStatusNums.push(statusNum);
                const vTeamCol = document.querySelector(`#game${ i }vTeamCol`);
                const middleCol = document.querySelector(`#game${ i }middleCol`);
                const hTeamCol = document.querySelector(`#game${ i }hTeamCol`);

                vTeamCol.innerhtml = `
                    <span class='teamName'>${ game.vTeam.triCode }</span>
                    <span class='score'>${ game.vTeam.score }</span>`;
                hTeamCol.innerHTML = `
                    <span class='teamName'>${ game.hTeam.triCode }</span>
                    <span class='score'>${ game.hTeam.score }</span>`;

                    let topLabel = '';
                    let bottomLabel = '';
                    if(statusNum == 1)
                    {
                        const isStartTimeTBD = game.isStartTimeTBD;
                        if(isStartTimeTBD)
                        {
                            topLabel = "TBD";
                        }
                        else
                        {
                            topLabel = data.startTimeEastern;
                        }
                        bottomLabel = '';
                    }
                    else if(statusNum == 2)
                    {
                        let quartersElapsed = game.period.current;
                        var clock = game.clock;
                        var isHalftime = game.period.isHalftime;
                        var isEndOfPeriod = game.period.isEndOfPeriod;
                        if(isHalftime)
                        {
                            topLabel = 'Halftime';
                        }
                        else if(isEndOfPeriod)
                        {
                            if(quartersElapsed > 4)
                                topLabel = `End of ${ quartersElapsed > 5 ? String(quartersElapsed - 4) : '' }OT`;
                            else
                                topLabel = `End of Q${ quartersElapsed }`;
                        }
                        else
                        {
                        if(quartersElapsed > 4)
                            topLabel = `${ quartersElapsed > 5 ? String(quartersElapsed - 4) : '' }OT`;
                        else
                            topLabel = `Q${ quartersElapsed }`;
                        }
                        bottomLabel = `${ clock }`;
                    }
                    else if(statusNum == 3)
                    {
                        topLabel = "Final";
                        let quartersElapsed = game.period.current;
                        if(quartersElapsed > 4)
                            topLabel += ` (${ quartersElapsed > 5 ? String(quartersElapsed - 4) : ''}OT)`;
                    }
    
                    middleCol.innerText = `${topLabel} \n ${bottomLabel}`;
                
            } else {
                const statusNum = game.statusNum;
                tempStatusNums.push(statusNum);
                const gameLink = document.createElement('a');

                gameLink.href = `game?date=${ date }&gameId=${ game.gameId }`;

                const table = document.createElement('table');
                const firstRow = document.createElement('tr');
                const vTeamCol = document.createElement('td');
                const middleCol = document.createElement('td')
                const hTeamCol = document.createElement('td');

                firstRow.appendChild(vTeamCol);
                firstRow.appendChild(middleCol);
                firstRow.appendChild(hTeamCol);
                table.appendChild(firstRow);
                gameLink.appendChild(table);

                vTeamCol.innerHTML = `
                    <span class='teamName'>${ game.vTeam.triCode }</span>
                    <span class='score'>${ game.vTeam.score }</span>`;
                hTeamCol.innerHTML = `
                    <span class='teamName'>${ game.hTeam.triCode }</span>
                    <span class='score'>${ game.hTeam.score }</span>`;
                
                let topLabel = '';
                let bottomLabel = '';
                if(statusNum == 1)
                {
                    const isStartTimeTBD = game.isStartTimeTBD;
                    if(isStartTimeTBD)
                    {
                        topLabel = "TBD";
                    }
                    else
                    {
                        topLabel = data.startTimeEastern;
                    }
                    bottomLabel = '';
                }
                else if(statusNum == 2)
                {
                    let quartersElapsed = game.period.current;
                    var clock = game.clock;
                    var isHalftime = game.period.isHalftime;
                    var isEndOfPeriod = game.period.isEndOfPeriod;
                    if(isHalftime)
                    {
                        topLabel = 'Halftime';
                    }
                    else if(isEndOfPeriod)
                    {
                        if(quartersElapsed > 4)
                            topLabel = `End of ${ quartersElapsed > 5 ? String(quartersElapsed - 4) : '' }OT`;
                        else
                            topLabel = `End of Q${ quartersElapsed }`;
                    }
                    else
                    {
                    if(quartersElapsed > 4)
                        topLabel = `${ quartersElapsed > 5 ? String(quartersElapsed - 4) : '' }OT`;
                    else
                        topLabel = `Q${ quartersElapsed }`;
                    }
                    bottomLabel = `${ clock }`;
                }
                else if(statusNum == 3)
                {
                    topLabel = "Final";
                    let quartersElapsed = game.period.current;
                    if(quartersElapsed > 4)
                        topLabel += ` (${ quartersElapsed > 5 ? String(quartersElapsed - 4) : ''}OT)`;
                }

                middleCol.innerText = `${topLabel} \n ${bottomLabel}`;

                //firstRow.id = `game${ i }firstRow`;
                vTeamCol.id = `game${ i }vTeamCol`;
                middleCol.id = `game${ i }middleCol`;
                hTeamCol.id = `game${ i }hTeamCol`;
                gameLink.id = `game${ i }`;
                table.className = 'gameTable';
                vTeamCol.className = 'teamCol';
                middleCol.className = 'middleCol';
                hTeamCol.className = 'teamCol';

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

function setMiddleCol() {

}

function checkStatusNums() {
    return statusNums.indexOf(1) !== -1 || statusNums.indexOf(2) !== -1;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}