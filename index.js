//1 - only last coin is marked when going back to home
//2 - live report has error

const app = document.querySelector('#app');
let coin_data;
let more_info = {};
let report_list = [];
report_list_id = [];
let inter = function(){};
let sixth_coin;
console.log(inter);

let test = {1:3,2:4};
test.college={}
test.college.life=3
test[1]['timer']=2
test[1['trime']]=5
console.log(test);

(async () => {
    app.innerHTML = `<div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>`
    let api = await fetch (`https://api.coingecko.com/api/v3/coins/list`);
    coin_data = await api.json();
    moveTo('home');
 })()


function navTo(elem){
    let target = elem.dataset.target;
    console.log(target);
    moveTo(target);
    document.querySelectorAll('.nav-item > a').forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-target='${target}']`).classList.add('active');
}

async function moveTo(target) {
    console.log(target);
    clearInterval(inter);
    let html;
    app.innerHTML = '';
    switch (target) {
        case 'home': html = home(); break;
        case 'reports': graph_build(report_list); return;
        case 'about': html = about(); break;
        case 'search' : html = search(); break;
        case 'filter' : html = filter(); break;
        default: html = home(); break;
    }

    
    app.innerHTML += html;

}

function home() {
    app.innerHTML = `<div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>`
    app.innerHTML=``
    let card_html ='';
     for(let i=1000; i<=1010; i++){
        let coin = coin_data[i];
        coin = new Card(coin).check_list();
        card_html += new Card(coin).create();
       }
       return `<div class="boxes container-md">${card_html}</div>`;
}

function reports(my_data){
    console.log('my dataaaaaa ===',my_data);
        let graph_data = [];
    Object.entries(my_data).forEach(e => 
        {let tname = (e[0])
        let timing = (e[1])
            graph_data.push({
                type:"line",
                axisYType: "secondary",
                name: tname,
                showInLegend: true,
                markerSize: 0,
                yValueFormatString: "$#.###",
                dataPoints: timing
            })        
        })
        console.log(graph_data);
        var chart = new CanvasJS.Chart("app", {
            title: {
                text: "House Median Price"
            },
            axisX: {
                // interval: 3,
                // intervalType: "second"
                valueFormatString: " HH:mm:ss"
            },
            axisY2: {
                title: "Median List Price",
                prefix: "$",
                suffix: ""
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                horizontalAlign: "center",
                dockInsidePlotArea: true,
                itemclick: toogleDataSeries
            },
            data: graph_data
        }
        );
        chart.render();
        
        function toogleDataSeries(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else{
                e.dataSeries.visible = true;
            }
            chart.render();
        }
}

function about() {
    console.log(sixth_coin);
    return `<div class="container about">
                <h1>About</h1>
                <p>This is the about page</p>
            </div>`;

}
async function moreinfo(a_coin){
    if(a_coin.getAttribute('aria-expanded')=='false'){
        return;
    }
    let the_span = document.getElementById(`s_${a_coin.id}`);
    if(a_coin.id in more_info && ( Date.now() - more_info[`${a_coin.id}`].test_time < 120000)){
        the_span.innerHTML = new Info(more_info[a_coin.id]).create();
    }else{
        the_span.innerHTML = `<div><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...</div>`
        let api = await fetch (`https://api.coingecko.com/api/v3/coins/${a_coin.id}`);
        more_info[a_coin.id] = await api.json();
        more_info[`${a_coin.id}`].test_time = new Date().getTime();
        setTimeout(() => {
            the_span.innerHTML = new Info(more_info[a_coin.id]).create();
        }, 2000);
    }
}






// ==================================================
// =======================calss======================
// ==================================================

class Card{
    constructor(obj){
        this.obj=obj;
        // this.report_list=report_list
    }
    
    check_list(){
        this.obj.bool='false';
        for (const e of report_list_id) {
            if(e==this.obj.id){
                console.log('inside= ',e);
                console.log('inside= ',this.obj.id);
                this.obj.check='checked';
                this.obj.bool= 'true'; break;
            }else{
                this.obj.check='';
                // this.obj.bool= 'false';
            }
        }
        
        return this.obj;
    }

    create(){
        return `<div class="card main_card"   >
                    <div class="card-body">
                        <h5 class="card-title">${this.obj.symbol}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${this.obj.name}</h6>
                        <p>
                            <button onclick=moreinfo(this) id="${this.obj.id}" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#i_${this.obj.id}" aria-expanded="false" aria-controls="i_${this.obj.id}_i">
                                    more info
                            </button>
                        </p>
                        <div class="collapse" id="i_${this.obj.id}">
                        <div class="card card-body">
                            <span class="dropdown" id="s_${this.obj.id}"></span>
                        </div>
                    </div>


                    <div class="form-check form-switch main_switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="t_${this.obj.symbol}+${this.obj.id}" onclick="change(this)" ison="${this.obj.bool}" ${this.obj.check} >
                    </div>
                </div>
                
                </div>` 
    }
}

class Info{
    constructor(obj){
        this.obj=obj;
    }
   
    create(){
        return   ` <div> USD:${this.obj.market_data.ath.usd} </br>
                    EUR:${this.obj.market_data.ath.eur} </br>
                    ILS:${this.obj.market_data.ath.ils} </br></div>
                    <div class="thumb"><img  src="${this.obj.image.small}"></div>`
    };
}

class MyModal{
constructor(html,n){
    this.html = html;
    this.n=n;
}

create(){
   return `<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Only 5 coins allowed! If you want to add <b>${this.n}</b> to the report, choose one or more to remove</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" onclick="close_modal()" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${this.html}
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="close_modal()" data-bs-dismiss="modal">Continue</button>
                    </div>
                    </div>
                    </div>
                    </div>`
}

}

function change(coin_switch){
    console.log('changeeeeeeee',coin_switch);
    coin_switch.getAttribute('ison')=='false' ? toggle_on(coin_switch) : toggle_off(coin_switch);
    
}

function toggle_on(coin_switch){
    let splitstr = coin_switch.id.slice(2).split("+");
    console.log('spliiiiiiiiiittttttt',splitstr);
    if(report_list.length < 5){
        console.log(23);
        report_list.push(splitstr[0]);
        report_list_id.push(splitstr[1]);
        console.log('idddddddd',report_list_id);
        coin_switch.setAttribute('ison','true');
        console.log(report_list);
    } else{
        event.preventDefault();
        popup(coin_switch);
    }
}
function toggle_off(coin_switch){
    console.log(999);
    let splitstr = coin_switch.id.slice(2).split("+");
    coin_switch.setAttribute('ison','false')
    console.log('now off');
    report_list = (report_list.filter(n => n !== splitstr[0]));
    report_list_id = (report_list_id.filter(n => n !== splitstr[1]));
    console.log(report_list);
    console.log(report_list_id);
}

async function graph_build(arr){
    let my_data_point ={};
    arr.forEach(e => {
        console.log(e);
        my_data_point[`${e}`] = [];
    })
    let my_url = arr.join();
    console.log('my url = ', my_url);
    inter = setInterval(async () => {
        let res ={};
        // let api = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC`);
        let api = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${my_url}&tsyms=USD`);
        res = await api.json();
        console.log('my res =',res);
        console.log('ressss ====',Object.entries(res));
        res = Object.entries(res);
        let count = 0;
        arr.forEach(e => {
            let x = new Date();
            // let y = res.e;
            let y = Object.entries(res[count][1])[0][1];
            console.log( 'my y =', y);
            let obj = {x:x, y:y};
            my_data_point[`${e}`].push(obj);
            count++;
        })        
        console.log(my_data_point);
        reports(my_data_point);
    }, 2000);
    inter();
}
// graph_build(['USD','ILS','EUR']);


function popup(coin_switch){
    popupdiv = document.createElement("div");
    popupdiv.classList.add('pop','modal-dialog','modal-lg');
    sixth_coin = coin_switch;
    console.log(sixth_coin);
    let html = '';
    for(i = 0; i < report_list.length ; i++){
        html += `
        <div class="innerpop">${report_list[i]}</div>
        <div class="form-check form-switch innerpop">
        <input class="form-check-input" type="checkbox" role="switch" id="k_${report_list[i]}+${report_list_id[i]}" onclick="change2(this)" ison="true" checked >
        </div> `
    }
    // list.forEach(e => {
    //     html += `
    //     <div class="innerpop">${e}</div>
    //     <div class="form-check form-switch innerpop">
    //     <input class="form-check-input" type="checkbox" role="switch" id="k_${e}" onclick="change2(this)" ison="true" checked >
    //     </div> `
    // })
    popupdiv.innerHTML = new MyModal(html,coin_switch.id.slice(2)).create();
    console.log(coin_switch);
    app.appendChild(popupdiv);
    $('#exampleModal').modal('show');
    console.log(app);
}

function change2(coin_switch){
    let original = `t${coin_switch.id.slice(1)}`;
    original_elem = document.getElementById(`${original}`);
    console.log(original_elem);
    if(original_elem){
        original_elem.click();
    }else{
        let splitstr = coin_switch.id.slice(2).split("+");
        report_list = (report_list.filter(n => n !== splitstr[0]));
        report_list_id = (report_list_id.filter(n => n !== splitstr[1]))
    }
}

function close_modal(){
    report_list.length >= 5 || change2(sixth_coin);
    let elem_delete = document.getElementById("exampleModal");
    elem_delete.remove();
    
}

function search(){
    let res = {};
    let html = ''
    inp = $('#search_input').val();
    for (const coin of coin_data) {
        if(inp == coin.symbol){
            res = coin;
            console.log(res);
            res = new Card(res).check_list();
            html += new Card(res).create();
        }
    }
    html = html=='' ? `<h1>Coin <b>"${inp}"</b> not in list...</h1>` : html;
    return `<div class="boxes container-md">${html}</div>`;
}

function filter(){
    let html ='';
    report_list_id.forEach(e => {
        console.log(e);
        for (const coin of coin_data) {
            if(e == coin.id){
                res = coin;
                console.log(res);
                res = new Card(res).check_list();
                html += new Card(res).create();
                break;
            }
        } 
    })
    html = html=='' ? `<h1>No coins in list...</h1>` : html;
    return `<div class="boxes container-md">${html}</div>
            </br>
            <div class="container"><button class="btn btn-primary" type="button" onclick="moveTo('home')">Show All</button></div>`;
}

////////////////////////////////////////////////////////
// for (const key in region_count) {
//     console.log(`${key} -> ${region_count[key]}`)
// }