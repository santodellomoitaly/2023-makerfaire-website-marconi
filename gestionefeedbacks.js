//-----------------------------------------------------------------------------------
// Client MQTT
//------------------------------------------------------------------------------------		
	var conn;
	start('ws://{WS}:81');
	function start(wsServer){
		conn = new WebSocket(wsServer, ['arduino']);
		conn.onopen = function () {
			console.log('Connected on: ' + new Date());
		};
		conn.onerror = function (e) {
			console.log('WebSocket Error');
		};
		conn.onmessage = function (e) {
			var obj = JSON.parse(e.data);
			if(obj.devid=='{IV}'||obj.devid=='FF'){
				console.log('Received: '+e.data);
				onRcv(e.data);
			}
		};
		conn.onclose = function (e) {
			console.log('WebSocket connection closed because '+e.reason);
			conn.close();
			setTimeout(function(){start(wsServer)}, 5000);
		};	
	};
	function press(s){
		console.log('press: '+s);
		if(!isOpen(conn)){
			conn.close();
			console.log('reload on press.');
			start('ws://{WS}:81');
		}
		conn.send(s);
	};
	function condsend(arr,i,eid,cs){
		var el=document.getElementById(eid);
		var c=arr[i].replace(cs, el.value.trim());
		conn.send(c);
		console.log('condsend: '+c);
	};
	function actsend(jsn,str,cs){
		var v=jsn.replace(cs, str.trim());
		console.log('actsend: '+v+'- subwith:'+str.trim()+'- cs:'+cs);
		conn.send(v);
	};
	function isOpen(ws) { return ws.readyState === ws.OPEN };
	
	
//------------------------------------------------------------------
// gestione comandi in ingresso
//------------------------------------------------------------------
	//cmd callback
	function onRcv(d) {
		//document.getElementById('p').innerHTML = f.data;\n"
		var obj = JSON.parse(d);
		console.log('Arrived data');
		for(x in obj){
			var el = document.getElementById(x);
			if(el){  //controlla se il campo esiste nel DOM della pagina
				//console.log(x);
				if(x=='to1' || x=='to2' || x=='to3' || x=='to4'){
					console.log('stato:'+obj[x]); 
					if(Number(obj[x]) == 1){
						el.style.backgroundColor = "#b30000";
					}else{
						el.style.backgroundColor = "#00ccff";
					}
				}
				if(x=='{TP}'){//temperatura
						//tmp.innerHTML=obj[x]+' &#176;'+'C';
						//tmp.style.backgroundColor = \"#333\";
					}
			}else{
				//{"devid":"pippo","on1":"0","sp1":"10000","tr1":"50"}
				//{"devid":"pippo","on1":"1","sp1":"10000","tr1":"10","pr1":"10"}
				//errori nel json staccano la connessione!!
			};
		}
	}	
