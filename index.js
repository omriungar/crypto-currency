// let coin_data = getcoins();
const app = document.querySelector('#app');
moveTo('home');


function navTo(elem){
    let target = elem.dataset.target;
    console.log(target);
    moveTo(target);
    document.querySelectorAll('.nav-item > a').forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-target='${target}']`).classList.add('active');
}

async function moveTo(target) {

    let html;
    app.innerHTML = '';
    switch (target) {
        case 'home': html = await home(); break;
        case 'reports': html = reports(); break;
        case 'about': html = about(); break;
        default: html = home(); break;
    }

    
    app.innerHTML += html;

}

// function nav(){
     
            
// }


async  function home() {
    app.innerHTML = `<div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>`
    coin_data = await getcoins();
    app.innerHTML=``
    let card_html ='';
     for(let i=3; i<=100; i++){
        let coin = coin_data[i];
        card_html += new Card(coin).create();
       }
       return `<div class="boxes container-md">${card_html}</div>`;

}

function reports(){
    return `<div class="container reports">
                <h1>Live Reports</h1>
                <p>This is the live reports page</p>
            </div>`;
}

function about() {
    return `<div class="container about">
                <h1>About</h1>
                <p>This is the about page</p>
            </div>`;

}
async function moreinfo(a_coin){
    let the_span = document.getElementById(`s_${a_coin.id}`);
    let more_info = await getcoins(a_coin.id);
    setTimeout(() => {
        the_span.innerHTML = new Info(more_info).create();
    }, 2000);
}

async function getcoins(id){
   id = id == undefined ? 'list/' : id; 
   console.log(id);
   let api = await fetch (`https://api.coingecko.com/api/v3/coins/${id}`);
   return await api.json();
}



// ===============
// =====calss=====
// ===============

class Card{
    constructor(obj){
        this.obj=obj;
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
                            <span class="dropdown" id="s_${this.obj.id}"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...</span>
                        </div>
                    </div>


                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
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
