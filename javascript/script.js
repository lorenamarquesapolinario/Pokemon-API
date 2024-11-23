// controlar slide show
$(document).ready(function(){
    let count = 1;
    
    setInterval(function(){
        nextImage();
    }, 15000);
    
    function nextImage(){
        count++;
        if(count>10){
            count = 1;
        }
        document.getElementById(`radio${count}`).checked = true;
    };

    addSlider();
    carregar();

    // adicionar conteudo ao slider
    async function addSlider(obj){
        for(let j=25, i=1; j<=35; j++, i++){
            let url = `https://pokeapi.co/api/v2/pokemon/${j}/`;

        await fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                let endereco = data["sprites"]["front_default"];
                let imagem = $('#img'+i);
                imagem.attr('src', endereco)

                let nome = data["name"].toUpperCase();
                let h1 = $('#ht'+i);
                h1.html(nome);

            })
            .catch((erro) => {
                console.log("Erro: " + erro);
            }) 
        }
    }


    // função para adicionar zero a esquerda
    function addZero(x){
        if(x<=9){
            return '000'+x;
        }
        else if(x<=99){
            return '00'+x;
        }
        else if(x<=999){
            return '0'+ x;
        }
        else{
            return x;
        }
    }

    // limpar barra de pesquisa
    function limparInput(){
        document.getElementById("busca").value = "";
    }

    // função para limpar o main 
    function limparMain(){
        $('main').empty();
        $('main').html('<h2>Quem é esse Pokémon?</h2>');
        return;
    }

    //fechar card maior
    function limparCardMaior(){
        $('#poke').empty();
    }
    
    // função para trasformar números em inteiros
    function trasformInt(obj){
        let numeroInt = obj.children[1].innerHTML;
        numeroInt = numeroInt.replaceAll('N°', '');
        numeroInt = parseInt(numeroInt);

        return numeroInt;
    }

    

    // função para criar os cards
    function criarCard(data){
        let conteudo = "";

            let name = data["name"];
            let codigo = data["id"];
            let img = data["sprites"]["front_default"];

            conteudo += `<div class="amostra-cards">
                            <img class="img-cards" src="${img}" alt="">
                            <p class="ndex">N° ${addZero(codigo)}</p>
                            <p class="cards-text">${name.toUpperCase()}</p> 
                            <div class="poketype">`;

            for(let j=0; j<data["types"].length; j++){
                let tipoStyle = data["types"][j]["type"]["name"];
                conteudo += `<p class="dest ${tipoStyle}">${tipoStyle.toUpperCase()}</p>`;
            }                                        
                                
            conteudo +=` </div>
                    </div>`;                    
            
            return conteudo;
    }
    

    
    // função incial primeiro carregamento
    $(document).on('click', '#ver-mais', function(){
        let ultimoCard = document.querySelector('main').lastChild;
        ultimoCard = trasformInt(ultimoCard);

        carregar(ultimoCard);
    })    

    async function carregar(paginacao) {
        let inicio=0;

        if(paginacao>=20){
            inicio = paginacao;
        }

        let url = `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${inicio}`;
        
        await fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            for(let i=0; i<data["results"].length; i++){
                let lista = data["results"][i]["name"];
                procurarPorIndice(lista);
            };            
            $('#chamar-mais').html('<button id="ver-mais">Ver Mais</button>');
        })
        .catch((erro) => {
            console.log("Erro: " + erro);
        })                     
    };
    
    
    // realizar busca da url por tipo, nome ou região
    // realizar busca da url por nome e construir o card maior
    async function loadpkName(){
        let pokeBusca = $('#busca').val();
        pokeBusca = pokeBusca.toLowerCase();
    
        let urlName = `https://pokeapi.co/api/v2/pokemon/${pokeBusca}/`;
            
            await fetch(urlName)
            .then((response) => {
                return response.json();                
            })
            .then((data) => {            
                contruirCard(data);                
            })
            .catch((erro) => {
                console.log("Erro: " + erro);
            }) 
    }



    // realizar busca da url por tipo e retornar uma lista com os nomes dos pokemons
    async function loadpkType(){
        let pokeBusca = $('#busca').val();
        pokeBusca = pokeBusca.toLowerCase();

        let urtType = `https://pokeapi.co/api/v2/type/${pokeBusca}`;

            await fetch(urtType)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    
                    limparMain();
                    limparCardMaior();
                    for(let i=1; i<=data["pokemon"].length; i++){
                        let carregarType = (data["pokemon"][i]["pokemon"]["name"]);
                        procurarPorIndice(carregarType);        
                    }
                })
                .catch((erro) => {
                    console.log("Erro: " + erro);
                })       
    };


    // define inicio e fim de região
    const REGION = {
        'kanto': { comeco: 1, fim: 151 },
        'johto': { comeco: 152, fim: 251 },
        'hoenn': { comeco: 252, fim: 386 },
        'sinnoh': { comeco: 387, fim: 493 },
        'unova': { comeco: 494, fim: 649 },
        'kalos': { comeco: 650, fim: 721 },
        'alola': { comeco: 722, fim: 809 },
        'galar': { comeco: 810, fim: 898 }
    };
    // realizar busca da url por região e retorna os pokemons presentes na região
    async function loadpkRegion(regian) {    
        let regiaoBusca = $('#busca').val();     
        
        if((typeof(regian)) != 'string' && $('#busca').val() == ""){
            if(!pokeBusca){alert('Nenhum valor foi inserido na pesquisa!')};  
        }
        if($('#busca').val() == ""){
            regiaoBusca = regian;
        }        
        
        regiaoBusca = regiaoBusca.toLowerCase();
        let comeco = REGION[regiaoBusca].comeco;

        limparMain();
        limparCardMaior();
        verifica();

        carregar(comeco);
    }



    // buscar url de pokemon por nome a partir da chamada da função do tipo e da região
    async function procurarPorIndice(buscar){
        let url = `https://pokeapi.co/api/v2/pokemon/${buscar}/`;

        await fetch(url)
            .then((response) => {                    
                return response.json();    
            })
            .then((data) => {
                document.querySelector('main').innerHTML += criarCard(data);
                return;
            })
            .catch((erro) => {
                console.log("Erro: " + erro);
            })
    };



    // construir card maior
    function contruirCard(obj){
        let card;

        let name = obj["name"];
        let codigo = obj["id"];
        let img = obj["sprites"]["front_default"];

        card =`<div class="card-pokebola">
                    <span class="material-symbols-outlined" class="fecharCard">
                        close
                    </span>
                    <div class="poke-descricao">
                        <p class="poke-number">N° ${addZero(codigo)}</p>
                        <p class="poke-nome">${name.toUpperCase()}</p>
                    </div>
                    <div class="pokebola">
                        <img class="pokebola-card" src="${img}" alt="">
                    </div>
                    <div class="poke-habilidades">`;

                        for(let k=0; k<obj["abilities"].length; k++){
                            card += `<p class="habilidades">${obj["abilities"][k]["ability"]["name"].toUpperCase()}</p>`;
                        }
                        
                    card += `</div>
                    <div class="types">`;

                        for(let j=0; j<obj["types"].length; j++){
                            let tipoStyle = obj["types"][j]["type"]["name"];
                            card += `<p class="type ${tipoStyle}">${tipoStyle.toUpperCase()}</p>`;
                        } 
                   card += `</div>
                </div>`;
        document.querySelector("#poke").innerHTML = card;
    }



    // contruir o card maior apartir do evento de click no card padrão
    $(document).on('click', '.amostra-cards', async function(){
        let numero = $(this).find('p.ndex').html();
        numero = numero.replaceAll('N°', '');
        numero = parseInt(numero);

        let urtType = `https://pokeapi.co/api/v2/pokemon/${numero}/`;        
        
            await fetch(urtType)
            .then((response) => {
                return response.json();                
            })
            .then((data) => {
                contruirCard(data);
            })
            .catch((erro) => {
                console.log("Erro: " + erro);
            }) 
    })




    // fechar card maior
    $(document).on('click', '#poke span', function(){
        limparCardMaior();
    });

    // realizar busca por tipo apartir do evento de click no menu suspenso
    $('.menu-none a').click(function(){
        limparInput();
        verifica();
        
        let valor = $(this).html();
        valor = valor.toLowerCase();
        loadpkRegion(valor);
    });
    
    $(document).keypress(function(event){
        if(event.key === 'Enter'){
            redirecionar();
        }
    })
    
    // realizar buscas de urls
    $('#search').click(function(){
        redirecionar();        
    });
    
    function redirecionar() {
        let regiaoBusca = $('#busca').val();  
        verifica();

        if(!regiaoBusca){
            alert('Nenhum valor foi inserido na pesquisa!');        
        }
        else{
            loadpkName();
            loadpkType();
            loadpkRegion();
        }
    }

    // limpar o input
    $('#close').click(limparInput);   



    $('#menu-departaments').click( () => {
        // alert('ll')
        $(".menu-none").toggleClass("exibir");
    })


    function verifica(){
        let veri = $(".menu-none").css("display");
        if(veri == 'flex'){            
            $(".menu-none").toggleClass("exibir");
        }

        return;
    }
});