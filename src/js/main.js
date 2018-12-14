"use strict";
(function(){
	class Table{
		constructor(){
			this.table = document.querySelector("#table");
		  this.buttonSubmit = document.querySelector("#form .btn.submit");

		  this.formFields = Array.from(document.querySelectorAll("#form input"));
		  this.registerEvents();
		}
		registerEvents(){
		  //edit on hover for file name
			this.buttonSubmit.addEventListener("click",((e)=>{
				 let jsonInput = {};
				 let input = this.formFields.every((element,ind) => {
				 	jsonInput[element.name] = element.value;
				 	return true;
				 });
				 console.log(jsonInput);
				 $.ajax({
                url: '/table',
                dataType: 'text',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(jsonInput),
                success: this.createTable.bind(this),
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log( errorThrown );
                }
            });
			}));
		}
		createTable( data, textStatus, jQxh){
			this.table.innerHTML = data;
		}
	}
	window.addEventListener("load", init);

	function init(){
		const config = {table: null};
		config.table = new Table();
	}
	
}())