const app = document.querySelector('#app');
let coin_data;
let more_info = {};
let report_list = [];
let report_list_id = [];
let sixth_coin;
let update_chart;
;
let my_search = document.getElementById('search_input');

function my_loader(){
    return `<div class="my_coin_loader"></br><img src="/assets/${Math.floor(Math.random()*5+1)}.gif" height="100px" alt=""></div>`;
}

async function get_data(endp){
    try {
        let api = await fetch (`https://api.coingecko.com/api/v3/coins/${endp}`);
        return await api.json();
    } catch (error) {
        return alert('Error loading data. Please try again, or contact support.')
    }
   
}

(async () => {
    app.innerHTML = my_loader();
    coin_data = await get_data('list');
    moveTo('home');
 })()

///////////////////////////////////////////////////
///////////////////// NAVIGATION /////////////////
//////////////////////////////////////////////////


function navTo(elem){
    let target = elem.dataset.target;
    moveTo(target);
    document.querySelectorAll('.nav-item > a').forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-target='${target}']`).classList.add('active');
}

function moveTo(target) {
    clearInterval(update_chart);
    let html;
    app.innerHTML = '';
    switch (target) {
        case 'home': html = home(); break;
        case 'reports': graph_build(); return;
        case 'about': html = about(); break;
        case 'search' : html =  search(); break;
        case 'filter' : html = filter(); break;
        default: html = home(); break;
    }
    app.innerHTML += html;
}

function home() {
    app.innerHTML=``
    let card_html ='';
     for(let i=1000; i<=1010; i++){
        let coin = coin_data[i];
        coin = new Card(coin).check_list();
        card_html += new Card(coin).create();
       }
       return `<div class="boxes container-md">${card_html}</div>`;
}

function about() {
    return `<div class='About_page container'>
            <section class="container aboutme d-flex align-items-center justify-content-evenly" style="font-size:16px">
                
                <div class="text">
                    <h1>About</h1>
                    <p>Thank you for taking the time to look at my work. This project was completed during my Full-Stack programing course at John Brice Academy.</p>
                    <p>Here you can get the up-to-date exchange rate of any number of Crypto Currencies, as well as see a real-time performance graph comparing up to five different coins. </p>
                </div>
                <div >
                    <img class="my_img" src="assets/Me.jpeg" alt="" >
                </div>
            </section>
            <footer class="container d-flex justify-content-evenly ">
                <i style="font-size:20px">Contact Info:</i>
                
                <a href="mailto:ungar23@gmail.com" style="text-decoration:none"><i class="fa fa-envelope" style="font-size:36px"></i></a>
                <a href="https://linkedin.com/in/omri-ungar-a02537219" target="_blank"><i class="fa fa-linkedin-square" style="font-size:36px"></i></a>
                <a href="https://github.com/omriungar" target="_blank"><i class="fa fa-github" style="font-size:36px"></i></a>
                <a href="https://wa.me/15551234567" target="_blank"><i class="fa fa-whatsapp" style="font-size:36px"></i></a>
                <a href="https://www.facebook.com/omri.ungar.7" target="_blank"><i class="fa fa-facebook-f" style="font-size:36px"></i></a>
            </footer>
            </div>`;
}

///////////////////////////////////////////////////
///////////////////// MORE INFO //////////////////
//////////////////////////////////////////////////

async function moreinfo(a_coin){
    if(a_coin.getAttribute('aria-expanded')=='false') return;
    let the_span = document.getElementById(`s_${a_coin.id}`);
    if(a_coin.id in more_info && ( Date.now() - more_info[`${a_coin.id}`].test_time < 120000)){
        the_span.innerHTML = new Info(more_info[a_coin.id]).create();
    }else{
        the_span.innerHTML =`<div><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </div>`
        more_info[a_coin.id] = await get_data(a_coin.id)
        // let api = await fetch (`https://api.coingecko.com/api/v3/coins/${a_coin.id}`);
        // more_info[a_coin.id] = await api.json();
        more_info[`${a_coin.id}`].test_time = new Date().getTime();
        setTimeout(() => {
            the_span.innerHTML = new Info(more_info[a_coin.id]).create();
        }, 1000);
    }
}

///////////////////////////////////////////////////
///////////////////// SWITCH TOGGLE //////////////
//////////////////////////////////////////////////

function change(coin_switch){
    coin_switch.getAttribute('ison')=='false' ? toggle_on(coin_switch) : toggle_off(coin_switch); 
}

function toggle_on(coin_switch){
    let splitstr = coin_switch.id.slice(2).split("+");
    if(report_list.length < 5){
        report_list.push(splitstr[0]);
        report_list_id.push(splitstr[1]);
        coin_switch.setAttribute('ison','true');
    } else{
        event.preventDefault();
        popup(coin_switch);
    }
}

function toggle_off(coin_switch){
    let splitstr = coin_switch.id.slice(2).split("+");
    coin_switch.setAttribute('ison','false');
    report_list = (report_list.filter(n => n !== splitstr[0]));
    report_list_id = (report_list_id.filter(n => n !== splitstr[1]));
}

function popup(coin_switch){
    popupdiv = document.createElement("div");
    popupdiv.classList.add('pop','modal-dialog','modal-lg');
    sixth_coin = coin_switch;
    let html = '';
    for(i = 0; i < report_list.length ; i++){
        html += `
        <div class="innerpop">${report_list[i]}</div>
        <div class="form-check form-switch innerpop">
        <input class="form-check-input" type="checkbox" role="switch" id="k_${report_list[i]}+${report_list_id[i]}" onclick="change2(this)" ison="true" checked >
        </div> `
    }
    popupdiv.innerHTML = new MyModal(html,coin_switch.id.slice(2)).create();
    app.appendChild(popupdiv);
    $('#exampleModal').modal('show');
}

function change2(coin_switch){
    let original = `t${coin_switch.id.slice(1)}`;
    original_elem = document.getElementById(`${original}`);
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


///////////////////////////////////////////////////
////////// SEARCH & FILTER BTNS //////////////////
//////////////////////////////////////////////////

my_search.addEventListener("keypress", event => event.key === "Enter" && moveTo('search'));


function search(){
        let res = {};
        let html = ''
        // inp = my_serach.value;
        inp = $('#search_input').val();
        for (const coin of coin_data) {
            if(inp == coin.symbol){
                res = coin;
                res = new Card(res).check_list();
                html += new Card(res).create();
            }
        }
        html = html=='' ? `<h1>Coin <b>"${inp}"</b> not in list...</h1>` : html;
        return simple(html);
}


function filter(){
    let html ='';
    report_list_id.forEach(e => {
        for (const coin of coin_data) {
            if(e == coin.id){
                res = coin;
                res = new Card(res).check_list();
                html += new Card(res).create();
                break;
            }
        } 
    })
    html = html=='' ? `<h1>No coins in list...</h1>` : html;
    return simple(html);
}

function simple(html){
     return `<div class="boxes container-md">${html}</div>
    </br>
    <div class="container"><button class="btn btn-primary" type="button" onclick="moveTo('home')">Show All</button></div>`
}


///////////////////////////////////////////////////
//////////////////////GRAPH BUILD/////////////////
//////////////////////////////////////////////////

async function graph_fetch(path){
    let api = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${path}&tsyms=USD`);
    return await api.json();
}

async function graph_build(){
    let arr = report_list;
    app.innerHTML = my_loader();
    let my_data_point ={};
    let my_url = arr.join();
    res = await graph_fetch(my_url);
    let filtered_arr = Object.keys(res);  //in case not all coins came back with data
    filtered_arr = filtered_arr[0]=="Response" ? [] : filtered_arr;
    arr.length > filtered_arr.length && alert (`No data for ${(arr.filter(x => filtered_arr.indexOf(x.toUpperCase())===-1))}`);
    res = Object.entries(res);
    let count = 0;
    let x = new Date();
    filtered_arr.forEach(e => {
            my_data_point[e.toUpperCase()] = [];
            let y = Object.entries(res[count][1])[0][1];
            let obj = {x:x, y:y};
            my_data_point[e.toUpperCase()].push(obj);
            count++;       
    }) 
    setTimeout(() => {
        reports(my_data_point,filtered_arr);
    }, 1500); 
    
}

function reports(my_data,arr){
    if (report_list.length == 0) {
        app.innerHTML=   `<div class='error'> No currnecy chosen. Please choose at least one currency to view.
                           <br/><button class="btn btn-secondary" type="button" onclick="navTo(this)" data-target='home'>Return to HOME</button> </div>`;
        return;
    }
    if (arr.length == 0) {
        app.innerHTML=   `<div class='error'> No data for chosen currency. Please choose different ones to view.
                            <br/><button class="btn btn-secondary" type="button" onclick="navTo(this)" data-target='home'>Return to HOME</button></div>`;
        return;
    }
    let my_url_filtered = arr.join();
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
        var chart = new CanvasJS.Chart("app", {
            title: {
                text: `${arr.join(', ').toUpperCase()} to USD`
            },
            axisX: {
                valueFormatString: " HH:mm:ss"
            },
            axisY2: {
                title: "USD",
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

        inter = async function (arr){
            let res = await graph_fetch(my_url_filtered);
            res = Object.entries(res);
            for (let i = 0; i < arr.length; i++) {
                let x = new Date();
                let y = Object.entries(res[i][1])[0][1];
                let obj = {x:x, y:y};
                graph_data[i].dataPoints.push(obj);
            }
            chart.render();
        };

        update_chart = setInterval(()=>inter(arr), 2000);
        
        function toogleDataSeries(e){
            if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else{
                e.dataSeries.visible = true;
            }
            chart.render();
        }
}



// ==================================================
// =======================calss======================
// ==================================================

class Card{
    constructor(obj){
        this.obj=obj;
    }
    
    check_list(){
        this.obj.bool='false';
        for (const e of report_list_id) {
            if(e==this.obj.id){
                this.obj.check='checked';
                this.obj.bool= 'true'; break;
            }else{
                this.obj.check='';
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
        return   ` <div> USD: ${this.obj.market_data.ath.usd}&#36</br>
                    EUR: ${this.obj.market_data.ath.eur}&#8364 </br>
                    ILS: ${this.obj.market_data.ath.ils}&#8362 </br></div>
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
                    <h5 class="modal-title" id="exampleModalLabel">Only 5 coins allowed! If you want to add <b>${this.n.split("+")[0]}</b> to the report, choose one or more to remove</h5>
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

