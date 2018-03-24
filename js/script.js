var timerID;
//Количество клеток
var Nx = 200;
var Ny = 100;
//Размер клетки
var dz = 3;

var list;
//Ссылки на кнопки
var start;
var conf;

//Надписи на кнопках
var nameA = "Начать";
var nameB = "Отсановить";

//Переменные для графики
var cnv, ctx;

//Ссылка на массив конфигураций клеток
var A;

//Функция, определяющая вероятность начального распределения живых и мертвых клеток
function init(B){
	var i,j,p;
	p = list.value;
	for(i = 0; i < B.length; i++)
		for(j = 0; j < B[i].length; j++)
			if(Math.random() < p)
				B[i][j] = 1;
			else
				B[i][j] = 0;
	
}

//Функция для подсчета живых "соседов"
function getState(B,i,j){
	var im,ip,jm,jp,r;
	//Если клетка не в первой строке
	if(i > 0)
		//Первый индекс для соседа сверху
		im = i - 1;
	else
		im = B.length - 1;
	//Если не в последней строке
	if(i < B.length - 1)
		//Индекс для соседа сверху
		ip = i + 1;
	else
		ip = 0;
	
	//Если не первый столбец
	if(j > 0)
		jm = j - 1;
	else
		jm = B[i].length - 1;
	
	//Если не последний столбец
	if(j < B[i].length - 1)
		jp = j + 1;
	else
		jp = 0;
	
	r = B[i][jm]+B[i][jp]+B[im][j]+B[ip][j]+B[im][jm]+B[ip][jp]+B[im][jp]+B[ip][jm];
	//Возвращение числа живых клеток
	return r;
}

//Функция для вычисления новой конфигурации
function recalc(B){
	var nbs;

	var C = new Array(B.length);
	for(var i = 0; i < C.length; i++){
		C[i] = new Array(B[i].length);
		for(var j = 0; j < C[i].length; j++){
			nbs = getState(B,i,j);
			if(B[i][j] == 0){
				if(nbs == 3){
					C[i][j] = 1;
				}
				else{
					C[i][j] = 0;
				}
			}
			else{
				if((nbs == 2)||(nbs == 3)){
					C[i][j] = 1;
				}
				else{
					C[i][j] = 0;
				}
			}
		}
	}
	return C;
}

//Функция для вывода изображения
function show(B){
	ctx.clearRect(0,0,cnv.width,cnv.height);
	ctx.fillStyle = "blue";
	for(var i = 0; i < B.length; i++)
		for(var j = 0; j < B[i].length; j++)
			if(B[i][j] == 1)
				ctx.fillRect(dz*j,dz*i,dz,dz);
}

//Функция для вычисления новой конфигурации
function showNext(){
	A = recalc(A);
	show(A);
}

function config(){
	init(A);
	show(A);
}


//Обработчик события загрузки окна
window.onload = function(){
	cnv = document.getElementById("mycanvas");
	cnv.width = Nx * dz;
	cnv.height = Ny * dz;
	
	document.getElementById("myform").style.width = cnv.width - 10 + "px";
	ctx = cnv.getContext("2d");
	conf = document.getElementById("conf");
	conf.disabled = false;
	
	start = document.getElementById("start");
	start.value = nameA;
	
	list = document.getElementById("prob");
	list.disabled = false;
	
	var index = 1
	list.selectedIndex = index;
	
	A = new Array(Ny);
	for(var k = 0; k < A.length; k++)
		A[k] = new Array(Nx);
	
	config();
	
	conf.onclick = config; 
	
	list.onchange = conf.onclick;
	
	start.onclick = function(){
		if(this.value == nameA){
			list.disabled = true;
			conf.disabled = true;
			this.value = nameB;
			timerID = setInterval(showNext,100);
		}
		else{
			list.disabled = false;
			conf.disabled = false;
			this.value = nameA;
			clearInterval(timerID);
		}
	}
	
}
 