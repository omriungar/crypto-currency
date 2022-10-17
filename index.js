const app = document.querySelector('#app');
let coin_data;
let more_info = {};
let report_list_id_name = [];
let sixth_coin;
let update_chart;
let check_list_loop_count;
let my_search = document.getElementById('search_input');

function my_loader(){
    return `<div class="my_coin_loader"></br><img src="/assets/${Math.floor(Math.random()*5+1)}.gif" height="100px" alt=""></div>`;
}

(async () => {
    app.innerHTML = my_loader();
    coin_data = await get_data('list');
    if (coin_data == 'error'){
        app.innerHTML = `<div class='error'>Error loading data. Please try again, or contact support</div>`;
        return;
    } 
    setTimeout(() => {
        moveTo('home');
    }, 1500); 
 })()

async function get_data(endp){
    try {
        // let api = await fetch (`https://api.codetabs.com/v1/proxy/?quest=https://api.coingecko.com/api/v3/coins/${endp}`); //added proxy due to CORS problem
        let api = await fetch (`https://api.coingecko.com/api/v3/coins/${endp}`);
        return await api.json();
    } catch (error) {
        return 'error';
    }
   
}


///////////////////////////////////////////////////
///////////////////// NAVIGATION /////////////////
//////////////////////////////////////////////////


function navTo(elem){
    let target = elem.dataset.target;
    moveTo(target);
    target = target == 'search' || target == 'filter' ?  'home' :  target; //search or filter returns to HOME tab
    document.querySelectorAll('.nav-item > a').forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-target='${target}']`).classList.add('active');
}

function moveTo(target) {
    clearInterval(update_chart); //stop auto chart update when moving tabs
    if (coin_data == 'error') return;
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
    check_list_loop_count = 0;
     for(let i=1; i<=1000; i++){ //for loop because of testing only 100
        let coin = coin_data[i];
        coin = new Card(coin).check_list(); //keeps client's chosen coins through page re-render
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


function navbar_toggler_click(elem){ //controls margin-top of app
    app.classList.add('collapsed-nav');
    elem.getAttribute('aria-expanded')=='false' && app.classList.remove('collapsed-nav');
}

///////////////////////////////////////////////////
///////////////////// MORE INFO //////////////////
//////////////////////////////////////////////////

async function moreinfo(a_coin){
    if(a_coin.getAttribute('aria-expanded')=='false'){
        return;
    }
    let the_span = document.getElementById(`s_${a_coin.id}`);
    if(a_coin.id in more_info && ( Date.now() - more_info[a_coin.id].test_time < 120000)){
        the_span.innerHTML = new Info(more_info[a_coin.id]).create();
    }else{
        the_span.innerHTML =`<div><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </div>`
        more_info[a_coin.id] = await get_data(a_coin.id);
        
        if(more_info[a_coin.id] == 'Could not find coin with the given id'){ //in case of id without info
            the_span.innerHTML = 'Error loading info'; 
            return;
        } 
        if (!more_info[a_coin.id].market_data.current_price.usd){ //no current price data. example - ome
            the_span.innerHTML = 'No price data for chosen coin';
            return;
        }
        more_info[a_coin.id].test_time = new Date().getTime(); 
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
    let splitstr = coin_switch.id.slice(2).split("+"); //need id to find element, need name for graph
    if(report_list_id_name.length < 5){
        report_list_id_name.push([splitstr[1],splitstr[0]]); //[coin.id , coin.name]
        coin_switch.setAttribute('ison','true');
    } else{
        event.preventDefault();
        popup(coin_switch);
    }
}

function toggle_off(coin_switch){
    let splitstr = coin_switch.id.slice(2).split("+");
    coin_switch.setAttribute('ison','false');
    report_list_id_name = (report_list_id_name.filter(n => n[0] !== splitstr[1]));
}

function popup(coin_switch){
    popupdiv = document.createElement("div");
    popupdiv.classList.add('pop','modal-dialog','modal-lg');
    sixth_coin = coin_switch; //saves the coin the user wanted to add
    let html = '';
    for(i = 0; i < report_list_id_name.length ; i++){
        html += `
        <div class="innerpop">${report_list_id_name[i][1]} <br/><span>${report_list_id_name[i][0]}<span></div>
        <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="k_${report_list_id_name[i][1]}+${report_list_id_name[i][0]}" onclick="change2(this)" ison="true" checked >
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
    }else{                  //relevant for testing - when some coins were not printed to screen, but checked through SEARCH
        change(coin_switch);
    }
}

function close_modal(){
    report_list_id_name.length < 5 && change2(sixth_coin);
    let elem_delete = document.getElementById("exampleModal");
    elem_delete.remove();
}


///////////////////////////////////////////////////
////////// SEARCH & FILTER BTNS //////////////////
//////////////////////////////////////////////////

my_search.addEventListener("keypress", event => event.key === "Enter" && navTo(document.querySelector(`[data-target='search']`)));

function s_or_f(coin){
    coin = new Card(coin).check_list();
    return html = new Card(coin).create();
}

function search(){
        let html = '';
        inp = $('#search_input').val();
        check_list_loop_count=0; //helps to stop check_list() after all coins in report_list were checked
        for (const coin of coin_data) {
             if (inp == coin.symbol)  html += s_or_f(coin); //no break - in case of more than one coin with same name
        }
        if (!html)  return error_s(`<h1>Coin <b>"${inp}"</b> not in list...</h1>`);
        app.innerHTML = '';
        return correct_s(html,'hide');
}


function filter(){
    let html ='';
    check_list_loop_count=0;
    report_list_id_name.forEach(e => {
        for (const coin of coin_data) {
            if(e[0] == coin.id){
                html += s_or_f(coin);
                break;
            }
        } 
    })
    if (!html) return error_s(`<h1>No coins in list...</h1>`);
    return correct_s(html,'', 'all_select_btn');
}

function error_s(html){
    return `<div class='error'>${html}<button class="btn btn-secondary" data-target="home" type="button" onclick="navTo(this)">Return HOME</button></div>`
}

function correct_s(html,hide,my_class){
     return `<div class="boxes container-md">${html}</div>
    </br>
    <div class="container"><button class="btn btn-primary" type="button" onclick="moveTo('home')">Show All</button>
    <button class="btn btn-danger ${hide} ${my_class}" type="button" onclick="deselect_all('card-body')">Deselect All</button>
    <button class="btn btn-success hide ${my_class}" type="button" onclick="deselect_all('card-body', 'select')">select All</button></div>`
}

function deselect_all(location, select){
    let elems = document.querySelectorAll(`.${location} > .form-switch > input`);
    elems.forEach(e => {
        if (select == 'select' && !e.checked) e.click(); //click only unselected switched
        if (select != 'select' && e.checked) e.click(); //click only selected switches
    })
    document.getElementsByClassName('all_select_btn')[0].classList.toggle('hide');
    document.getElementsByClassName('all_select_btn')[1].classList.toggle('hide');
}

///////////////////////////////////////////////////
//////////////////////GRAPH BUILD/////////////////
//////////////////////////////////////////////////

async function graph_fetch(path){
    try {
        // let api = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=khegb&tsyms=USD`);
        let api = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${path}&tsyms=USD`);
        return await api.json();
    } catch (error) {
        return error;
    }
    
}

async function graph_build(){
    app.innerHTML = my_loader();
    let my_data_point ={};
    let arr = [];
    report_list_id_name.forEach( e => arr.push(e[1].toUpperCase())); //graph api needs coin NAME in uppercase
    let my_url = arr.join();
    let res = await graph_fetch(my_url);
    arr = Object.keys(res);  //in case not all coins came back with data
    if (arr.length==0) return app.innerHTML = error_s('<h1>Network failure. Please try again.</h1>'); //fetch fail
    arr = arr[0]=="Response" ? [] : arr; //error response
    report_list_id_name.length > arr.length && //display coins that didnt return with data. for example - asdhalf
    alert (`ATTENTION! No data for: \n - ${(report_list_id_name.filter(x => arr.indexOf(x[1].toUpperCase())===-1)).join(`\n - `)}`);
    res = Object.entries(res);
    let count = 0;
    let x = new Date();
    arr.forEach(e => {
            my_data_point[e] = [];
            let y = Object.entries(res[count][1])[0][1];
            let obj = {x:x, y:y};
            my_data_point[e].push(obj);
            count++;       
    }) 
    setTimeout(() => {
        reports(my_data_point,arr);
    }, 1500); 
    
}

function reports(my_data,arr){
    if (report_list_id_name.length == 0) { //no coins chosen
        app.innerHTML=   `<div class='error'> No currency chosen. Please choose at least one currency to view.
                           <br/><button class="btn btn-secondary" type="button" onclick="navTo(this)" data-target='home'>Return to HOME</button> </div>`;
        return;
    }
    if (arr.length == 0) { //no data for chosen coins
        app.innerHTML=   `<div class='error'> No data for chosen currency. Please choose different ones to view.
                            <br/><button class="btn btn-secondary" type="button" onclick="navTo(this)" data-target='home'>Return to HOME</button></div>`;
        return;
    }
    let my_url_filtered = arr.join(); //in case not all coins have data in graph api
    let graph_data = [];
    Object.entries(my_data).forEach(e => 
        {let tname = (e[0])
        let timing = (e[1])
            graph_data.push({
                type:"line",
                lineThickness: 3,
                axisYType: "secondary",
                name: tname,
                showInLegend: true,
                markerSize: 1,
                yValueFormatString: "$#.###",
                dataPoints: timing
            })        
        })
        var chart = new CanvasJS.Chart("app", {
            backgroundColor: "rgba(255,255,255,0.5)",
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
                dockInsidePlotArea: false,
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
        this.obj.check='';
        if (check_list_loop_count == report_list_id_name.length) return this.obj; //dont go in loop only if all coins on list were already checked 
        for (const e of report_list_id_name) {
            if(e[0]==this.obj.id){
                this.obj.check='checked';
                this.obj.bool= 'true'; 
                check_list_loop_count++; break;
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
        return   ` <div> USD: ${this.obj.market_data.current_price.usd}&#36</br>
                    EUR: ${this.obj.market_data.current_price.eur}&#8364 </br>
                    ILS: ${this.obj.market_data.current_price.ils}&#8362 </br></div>
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
                            <button type="button" class="btn btn-danger all_select_btn"  onclick="deselect_all('modal-body')" >Deselect All</button>
                            <button class="btn btn-success hide all_select_btn" type="button"  onclick="deselect_all('modal-body', 'select')">select All</button>
                            <button type="button" class="btn btn-secondary" onclick="close_modal()" data-bs-dismiss="modal">Continue</button>
                        </div>
                    </div>
                </div>
            </div>`
    }

}
